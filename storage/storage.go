package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"tiddlywiki-manager/models"
)

type Storage struct {
	wikis    []models.Wiki
	mu       sync.RWMutex
	filePath string
}

func NewStorage() *Storage {
	homeDir, _ := os.UserHomeDir()
	dataPath := filepath.Join(homeDir, ".tiddlywiki-manager", "data.json")
	
	return &Storage{
		wikis:    make([]models.Wiki, 0),
		filePath: dataPath,
	}
}

func (s *Storage) Load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Ensure directory exists
	dir := filepath.Dir(s.filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	// Check if file exists
	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		// Create empty file
		s.wikis = make([]models.Wiki, 0)
		return s.saveUnlocked()
	}

	// Read file
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}

	// Parse JSON
	return json.Unmarshal(data, &s.wikis)
}

func (s *Storage) Save() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.saveUnlocked()
}

func (s *Storage) saveUnlocked() error {
	data, err := json.MarshalIndent(s.wikis, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}

func (s *Storage) GetWikis() []models.Wiki {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]models.Wiki, len(s.wikis))
	copy(result, s.wikis)
	return result
}

func (s *Storage) AddWiki(wiki models.Wiki) error {
	s.mu.Lock()
	// Allow duplicate paths - no validation
	s.wikis = append(s.wikis, wiki)
	s.mu.Unlock()

	return s.Save()
}

func (s *Storage) UpdateWiki(wiki models.Wiki) error {
	s.mu.Lock()
	for i, w := range s.wikis {
		if w.ID == wiki.ID {
			s.wikis[i] = wiki
			s.mu.Unlock()
			return s.Save()
		}
	}
	s.mu.Unlock()

	return nil
}

func (s *Storage) DeleteWiki(id string) error {
	s.mu.Lock()
	for i, w := range s.wikis {
		if w.ID == id {
			s.wikis = append(s.wikis[:i], s.wikis[i+1:]...)
			s.mu.Unlock()
			return s.Save()
		}
	}
	s.mu.Unlock()

	return nil
}

