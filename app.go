package main

import (
	"context"
	"fmt"
	"runtime"
	"tiddlywiki-manager/models"
	"tiddlywiki-manager/services"
	"tiddlywiki-manager/storage"

	wruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	storage        *storage.Storage
	wikiService    *services.WikiService
	processService *services.ProcessService
}

// NewApp creates a new App application struct
func NewApp() *App {
	st := storage.NewStorage()
	processService := services.NewProcessService()
	wikiService := services.NewWikiService(st, processService)

	return &App{
		storage:        st,
		wikiService:    wikiService,
		processService: processService,
	}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	
	// Initialize logger
	logger, err := services.InitLogger()
	if err != nil {
		wruntime.LogErrorf(ctx, "Failed to initialize logger: %v", err)
	} else {
		services.LogInfo("Application started")
	}
	
	err = a.storage.Load()
	if err != nil {
		wruntime.LogErrorf(ctx, "Failed to load storage: %v", err)
		services.LogError("Failed to load storage", err)
	}
	
	// Store logger reference for cleanup
	if logger != nil {
		// Will be closed in shutdown
	}
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	services.LogInfo("Application shutting down")
	// Stop all running wikis
	a.processService.StopAll()
	services.LogInfo("Application closed")
}

// GetWikis returns all wikis
func (a *App) GetWikis() []models.Wiki {
	return a.wikiService.GetAll()
}

// AddWiki adds a new wiki
func (a *App) AddWiki(wiki models.Wiki) error {
	return a.wikiService.Add(&wiki)
}

// UpdateWiki updates an existing wiki
func (a *App) UpdateWiki(wiki models.Wiki) error {
	return a.wikiService.Update(&wiki)
}

// DeleteWiki deletes a wiki
func (a *App) DeleteWiki(id string) error {
	// Stop the wiki if running
	a.wikiService.StopWiki(id)
	return a.wikiService.Delete(id)
}

// StartWiki starts a wiki server
func (a *App) StartWiki(id string) error {
	return a.wikiService.StartWiki(id)
}

// StopWiki stops a wiki server
func (a *App) StopWiki(id string) error {
	return a.wikiService.StopWiki(id)
}

// RestartWiki restarts a wiki server
func (a *App) RestartWiki(id string) error {
	return a.wikiService.RestartWiki(id)
}

// GetWikiStatus gets the status of a wiki
func (a *App) GetWikiStatus(id string) string {
	return a.wikiService.GetStatus(id)
}

// OpenFolder opens the wiki folder in file explorer
func (a *App) OpenFolder(path string) error {
	return services.OpenFolder(path)
}

// OpenVSCode opens the wiki folder in VSCode
func (a *App) OpenVSCode(path string) error {
	return services.OpenVSCode(path)
}

// OpenGitHubDesktop opens the wiki folder in GitHub Desktop
func (a *App) OpenGitHubDesktop(path string) error {
	return services.OpenGitHubDesktop(path)
}

// OpenInfoFile opens the tiddlywiki.info file
func (a *App) OpenInfoFile(path string) error {
	return services.OpenInfoFile(path)
}

// SelectFolder opens a folder selection dialog
func (a *App) SelectFolder() (string, error) {
	path, err := wruntime.OpenDirectoryDialog(a.ctx, wruntime.OpenDialogOptions{
		Title: "选择 TiddlyWiki 文件夹",
	})
	if err != nil {
		return "", err
	}
	return path, nil
}

// OpenWikiWindow opens a new window with the wiki URL
func (a *App) OpenWikiWindow(url string) error {
	services.LogInfo(fmt.Sprintf("Opening wiki window: %s", url))
	// Use Wails runtime to create a new window
	wruntime.BrowserOpenURL(a.ctx, url)
	return nil
}

// OpenWikiInNewWindow opens wiki in a new application window
func (a *App) OpenWikiInNewWindow(id string) error {
	wiki, err := a.wikiService.GetByID(id)
	if err != nil {
		services.LogError("Failed to get wiki for new window", err)
		return err
	}
	
	url := fmt.Sprintf("http://localhost:%d", wiki.Port)
	services.LogInfo(fmt.Sprintf("Opening wiki in new window: %s at %s", wiki.Name, url))
	
	// Open in system default browser for now
	// In future versions, this could be a custom webview window
	wruntime.BrowserOpenURL(a.ctx, url)
	return nil
}

// GetAllTags returns all unique tags
func (a *App) GetAllTags() []string {
	return a.wikiService.GetAllTags()
}

// GetAllCategories returns all unique categories
func (a *App) GetAllCategories() []string {
	return a.wikiService.GetAllCategories()
}

// Window control functions
func (a *App) WindowMinimize() {
	wruntime.WindowMinimise(a.ctx)
}

func (a *App) WindowMaximize() {
	wruntime.WindowMaximise(a.ctx)
}

func (a *App) WindowToggleMaximize() {
	wruntime.WindowToggleMaximise(a.ctx)
}

func (a *App) WindowClose() {
	wruntime.Quit(a.ctx)
}

// CreateNewWiki creates a new TiddlyWiki in the specified directory and adds it to the manager
func (a *App) CreateNewWiki(parentDir string, wikiName string) (string, error) {
	services.LogInfo(fmt.Sprintf("Creating new wiki: %s in %s", wikiName, parentDir))
	
	// Create the wiki
	wikiPath, err := services.CreateNewWiki(parentDir, wikiName)
	if err != nil {
		return "", err
	}
	
	// Automatically add to wiki manager
	wiki := models.Wiki{
		Name:        wikiName,
		Path:        wikiPath,
		Port:        8080, // Default port, user can change later
		Description: "通过软件创建的 TiddlyWiki",
		Category:    "",
		Tags:        []string{},
	}
	
	// Add to storage
	if err := a.wikiService.Add(&wiki); err != nil {
		services.LogError("Failed to add created wiki to manager", err)
		return wikiPath, fmt.Errorf("wiki created but failed to add to manager: %w", err)
	}
	
	services.LogInfo(fmt.Sprintf("Successfully created and added wiki: %s", wikiName))
	return wikiPath, nil
}

// GetAppVersion returns the application version
func (a *App) GetAppVersion() string {
	return "2.6.0"
}

// GetPlatform returns the platform information
func (a *App) GetPlatform() string {
	return runtime.GOOS + "/" + runtime.GOARCH
}

// CheckPortsStatus checks which wiki ports are in use
func (a *App) CheckPortsStatus() []services.PortInfo {
	wikis := a.wikiService.GetAll()
	ports := make([]int, 0)
	for _, wiki := range wikis {
		ports = append(ports, wiki.Port)
	}
	return services.CheckPortsInUse(ports)
}

// KillPortProcess kills the process using a specific port
func (a *App) KillPortProcess(port int) error {
	services.LogInfo(fmt.Sprintf("Attempting to kill process on port %d", port))
	return services.KillProcessOnPort(port)
}

// ExportWikiToHTML exports a wiki to HTML file
func (a *App) ExportWikiToHTML(id string) (string, error) {
	wiki, err := a.wikiService.GetByID(id)
	if err != nil {
		return "", err
	}
	
	outputPath, err := services.ExportWikiToHTML(wiki.Path)
	if err != nil {
		return "", err
	}
	
	services.LogInfo(fmt.Sprintf("Wiki exported successfully: %s", outputPath))
	return outputPath, nil
}

