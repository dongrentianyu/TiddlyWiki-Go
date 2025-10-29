package services

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"sync"
	"syscall"
	"tiddlywiki-manager/models"
)

type ProcessService struct {
	processes map[string]*exec.Cmd
	mu        sync.RWMutex
}

func NewProcessService() *ProcessService {
	return &ProcessService{
		processes: make(map[string]*exec.Cmd),
	}
}

func (s *ProcessService) Start(wiki *models.Wiki) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.processes[wiki.ID]; exists {
		LogError(fmt.Sprintf("Wiki %s is already running", wiki.Name), nil)
		return fmt.Errorf("此 Wiki 已在运行中")
	}

	// Check if port is already in use
	if !IsPortAvailable(wiki.Port) {
		LogError(fmt.Sprintf("Port %d is already in use", wiki.Port), nil)
		return fmt.Errorf("端口 %d 已被占用，请更换端口或停止占用此端口的程序", wiki.Port)
	}

	LogInfo(fmt.Sprintf("Starting wiki: %s on port %d", wiki.Name, wiki.Port))

	// Start TiddlyWiki server
	// Command: tiddlywiki . --listen port=<port> [username=<username>]
	args := []string{".", "--listen", fmt.Sprintf("port=%d", wiki.Port)}
	if wiki.Username != "" {
		args = append(args, fmt.Sprintf("username=%s", wiki.Username))
	}
	cmd := exec.Command("tiddlywiki", args...)
	cmd.Dir = wiki.Path // Set working directory to wiki path
	
	// Hide console window on Windows
	if runtime.GOOS == "windows" {
		cmd.SysProcAttr = &syscall.SysProcAttr{
			HideWindow:    true,
			CreationFlags: 0x08000000, // CREATE_NO_WINDOW
		}
	}
	
	if err := cmd.Start(); err != nil {
		LogError(fmt.Sprintf("Failed to start wiki %s", wiki.Name), err)
		return fmt.Errorf("启动失败: %w", err)
	}

	s.processes[wiki.ID] = cmd
	LogInfo(fmt.Sprintf("Wiki %s started successfully", wiki.Name))
	
	// Monitor process in background
	go func() {
		err := cmd.Wait()
		s.mu.Lock()
		delete(s.processes, wiki.ID)
		s.mu.Unlock()
		if err != nil {
			LogError(fmt.Sprintf("Wiki %s process ended with error", wiki.Name), err)
		} else {
			LogInfo(fmt.Sprintf("Wiki %s process ended", wiki.Name))
		}
	}()

	return nil
}

func (s *ProcessService) Stop(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	cmd, exists := s.processes[id]
	if !exists {
		LogError("Wiki is not running", nil)
		return fmt.Errorf("wiki is not running")
	}

	LogInfo(fmt.Sprintf("Stopping wiki process (ID: %s)", id))
	
	if err := cmd.Process.Kill(); err != nil {
		LogError("Failed to stop wiki", err)
		return fmt.Errorf("failed to stop wiki: %w", err)
	}

	delete(s.processes, id)
	LogInfo("Wiki stopped successfully")
	return nil
}

func (s *ProcessService) StopAll() {
	s.mu.Lock()
	defer s.mu.Unlock()

	for id, cmd := range s.processes {
		cmd.Process.Kill()
		delete(s.processes, id)
	}
}

func (s *ProcessService) IsRunning(id string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	_, exists := s.processes[id]
	return exists
}

// Helper functions for opening external applications

func OpenFolder(path string) error {
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("explorer", path)
	case "darwin":
		cmd = exec.Command("open", path)
	case "linux":
		cmd = exec.Command("xdg-open", path)
	default:
		return fmt.Errorf("unsupported platform")
	}
	
	return cmd.Start()
}

func OpenVSCode(path string) error {
	cmd := exec.Command("code", path)
	return cmd.Start()
}

func OpenGitHubDesktop(path string) error {
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", "github", path)
	case "darwin":
		cmd = exec.Command("open", "-a", "GitHub Desktop", path)
	default:
		return fmt.Errorf("GitHub Desktop only supports Windows and macOS")
	}
	
	return cmd.Start()
}

func OpenInfoFile(path string) error {
	infoPath := path + "/tiddlywiki.info"
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", infoPath)
	case "darwin":
		cmd = exec.Command("open", infoPath)
	case "linux":
		cmd = exec.Command("xdg-open", infoPath)
	default:
		return fmt.Errorf("unsupported platform")
	}
	
	return cmd.Start()
}

// CreateNewWiki creates a new TiddlyWiki using tiddlywiki command
func CreateNewWiki(parentDir string, wikiName string) (string, error) {
	LogInfo(fmt.Sprintf("Initializing new wiki: %s", wikiName))
	
	// Command: tiddlywiki <wikiName> --init server
	cmd := exec.Command("tiddlywiki", wikiName, "--init", "server")
	cmd.Dir = parentDir
	
	// Hide console window on Windows
	if runtime.GOOS == "windows" {
		cmd.SysProcAttr = &syscall.SysProcAttr{
			HideWindow:    true,
			CreationFlags: 0x08000000, // CREATE_NO_WINDOW
		}
	}
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		LogError(fmt.Sprintf("Failed to create wiki: %s", string(output)), err)
		return "", fmt.Errorf("failed to create wiki: %w\nOutput: %s", err, string(output))
	}
	
	wikiPath := filepath.Join(parentDir, wikiName)
	
	// Check and create tiddlers folder if not exists
	tiddlersPath := filepath.Join(wikiPath, "tiddlers")
	if _, err := os.Stat(tiddlersPath); os.IsNotExist(err) {
		LogInfo(fmt.Sprintf("Creating tiddlers folder for wiki: %s", wikiName))
		if err := os.MkdirAll(tiddlersPath, 0755); err != nil {
			LogError("Failed to create tiddlers folder", err)
			return "", fmt.Errorf("failed to create tiddlers folder: %w", err)
		}
	}
	
	LogInfo(fmt.Sprintf("Successfully created wiki: %s at %s", wikiName, wikiPath))
	return wikiPath, nil
}

// ExportWikiToHTML exports a TiddlyWiki to HTML file using --build index command
func ExportWikiToHTML(wikiPath string) (string, error) {
	LogInfo(fmt.Sprintf("Exporting wiki to HTML: %s", wikiPath))
	
	// Command: tiddlywiki . --build index (run in wiki directory)
	cmd := exec.Command("tiddlywiki", ".", "--build", "index")
	cmd.Dir = wikiPath
	
	// Hide console window on Windows
	if runtime.GOOS == "windows" {
		cmd.SysProcAttr = &syscall.SysProcAttr{
			HideWindow:    true,
			CreationFlags: 0x08000000, // CREATE_NO_WINDOW
		}
	}
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		LogError(fmt.Sprintf("Failed to export wiki: %s", string(output)), err)
		return "", fmt.Errorf("导出失败: %w\n输出: %s", err, string(output))
	}
	
	// The output HTML file is usually in output/index.html
	outputPath := filepath.Join(wikiPath, "output", "index.html")
	
	// Check if output file exists
	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		LogError("Output HTML file not found", err)
		return "", fmt.Errorf("输出文件未找到: %s", outputPath)
	}
	
	LogInfo(fmt.Sprintf("Successfully exported wiki to: %s", outputPath))
	return outputPath, nil
}

