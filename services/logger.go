package services

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

type Logger struct {
	file   *os.File
	logger *log.Logger
}

var globalLogger *Logger

func InitLogger() (*Logger, error) {
	// Get executable directory
	exePath, err := os.Executable()
	if err != nil {
		return nil, err
	}
	exeDir := filepath.Dir(exePath)

	// Create logs directory in the same folder as executable
	logDir := filepath.Join(exeDir, "logs")
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}

	// Create log file with timestamp
	logFileName := fmt.Sprintf("tiddlywiki-manager-%s.log", time.Now().Format("2006-01-02"))
	logPath := filepath.Join(logDir, logFileName)

	file, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}

	logger := log.New(file, "", log.LstdFlags)
	globalLogger = &Logger{
		file:   file,
		logger: logger,
	}

	globalLogger.Info(fmt.Sprintf("Logger initialized at %s", logPath))
	return globalLogger, nil
}

func (l *Logger) Info(message string) {
	l.logger.Printf("[INFO] %s", message)
}

func (l *Logger) Error(message string, err error) {
	if err != nil {
		l.logger.Printf("[ERROR] %s: %v", message, err)
	} else {
		l.logger.Printf("[ERROR] %s", message)
	}
}

func (l *Logger) Debug(message string) {
	l.logger.Printf("[DEBUG] %s", message)
}

func (l *Logger) Close() error {
	if l.file != nil {
		return l.file.Close()
	}
	return nil
}

// Global logging functions
func LogInfo(message string) {
	if globalLogger != nil {
		globalLogger.Info(message)
	}
}

func LogError(message string, err error) {
	if globalLogger != nil {
		globalLogger.Error(message, err)
	}
}

func LogDebug(message string) {
	if globalLogger != nil {
		globalLogger.Debug(message)
	}
}

