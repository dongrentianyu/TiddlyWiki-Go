package models

import (
	"time"
)

// Wiki represents a TiddlyWiki instance
type Wiki struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Path        string    `json:"path"`
	Port        int       `json:"port"`
	Tags        []string  `json:"tags"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// WikiStatus represents the running status of a wiki
type WikiStatus struct {
	ID        string `json:"id"`
	IsRunning bool   `json:"isRunning"`
	URL       string `json:"url"`
}


