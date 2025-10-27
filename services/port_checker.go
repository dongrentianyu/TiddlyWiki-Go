package services

import (
	"fmt"
	"net"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"
)

// IsPortAvailable checks if a port is available
func IsPortAvailable(port int) bool {
	address := fmt.Sprintf("localhost:%d", port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		return false // Port is in use
	}
	listener.Close()
	return true // Port is available
}

// WaitForPort waits for a port to become available (with timeout)
func WaitForPort(port int, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if !IsPortAvailable(port) {
			return true // Port is now in use (server started)
		}
		time.Sleep(100 * time.Millisecond)
	}
	return false
}

// CheckPortOwnership tries to determine if the port is used by a TiddlyWiki server
func CheckPortOwnership(port int) (bool, error) {
	address := fmt.Sprintf("localhost:%d", port)
	conn, err := net.DialTimeout("tcp", address, 2*time.Second)
	if err != nil {
		return false, err
	}
	conn.Close()
	return true, nil
}

// PortInfo contains information about a port
type PortInfo struct {
	Port      int    `json:"port"`
	InUse     bool   `json:"inUse"`
	ProcessID string `json:"processId"`
}

// CheckPortsInUse checks which ports are in use from the given list
func CheckPortsInUse(ports []int) []PortInfo {
	results := make([]PortInfo, 0)
	for _, port := range ports {
		inUse := !IsPortAvailable(port)
		pid := ""
		if inUse {
			pid = GetProcessUsingPort(port)
		}
		results = append(results, PortInfo{
			Port:      port,
			InUse:     inUse,
			ProcessID: pid,
		})
	}
	return results
}

// GetProcessUsingPort gets the PID of the process using a specific port
func GetProcessUsingPort(port int) string {
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("netstat", "-ano")
	case "linux", "darwin":
		cmd = exec.Command("lsof", "-i", fmt.Sprintf(":%d", port))
	default:
		return ""
	}
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		return ""
	}
	
	lines := strings.Split(string(output), "\n")
	portStr := fmt.Sprintf(":%d", port)
	
	for _, line := range lines {
		if strings.Contains(line, portStr) && strings.Contains(line, "LISTENING") {
			fields := strings.Fields(line)
			if len(fields) > 0 {
				return fields[len(fields)-1]
			}
		}
	}
	
	return ""
}

// KillProcessByPID kills a process by its PID
func KillProcessByPID(pid string) error {
	if pid == "" {
		return fmt.Errorf("invalid PID")
	}
	
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("taskkill", "/F", "/PID", pid)
	case "linux", "darwin":
		cmd = exec.Command("kill", "-9", pid)
	default:
		return fmt.Errorf("unsupported platform")
	}
	
	LogInfo(fmt.Sprintf("Killing process with PID: %s", pid))
	return cmd.Run()
}

// KillProcessOnPort kills the process using a specific port
func KillProcessOnPort(port int) error {
	pid := GetProcessUsingPort(port)
	if pid == "" {
		return fmt.Errorf("no process found on port %d", port)
	}
	
	// Validate PID is a number
	if _, err := strconv.Atoi(pid); err != nil {
		return fmt.Errorf("invalid PID: %s", pid)
	}
	
	return KillProcessByPID(pid)
}


