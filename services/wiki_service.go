package services

import (
	"errors"
	"sort"
	"tiddlywiki-manager/models"
	"tiddlywiki-manager/storage"
	"time"

	"github.com/google/uuid"
)

type WikiService struct {
	storage        *storage.Storage
	processService *ProcessService
}

func NewWikiService(storage *storage.Storage, processService *ProcessService) *WikiService {
	return &WikiService{
		storage:        storage,
		processService: processService,
	}
}

func (s *WikiService) GetAll() []models.Wiki {
	wikis := s.storage.GetWikis()
	// Sort by name
	sort.Slice(wikis, func(i, j int) bool {
		return wikis[i].Name < wikis[j].Name
	})
	return wikis
}

func (s *WikiService) GetByID(id string) (*models.Wiki, error) {
	wikis := s.storage.GetWikis()
	for _, wiki := range wikis {
		if wiki.ID == id {
			return &wiki, nil
		}
	}
	return nil, errors.New("wiki not found")
}

func (s *WikiService) Add(wiki *models.Wiki) error {
	if wiki.ID == "" {
		wiki.ID = uuid.New().String()
	}
	wiki.CreatedAt = time.Now()
	wiki.UpdatedAt = time.Now()

	if wiki.Port == 0 {
		wiki.Port = s.findAvailablePort()
	}

	return s.storage.AddWiki(*wiki)
}

func (s *WikiService) Update(wiki *models.Wiki) error {
	existing, err := s.GetByID(wiki.ID)
	if err != nil {
		return err
	}
	
	wiki.CreatedAt = existing.CreatedAt
	wiki.UpdatedAt = time.Now()
	
	return s.storage.UpdateWiki(*wiki)
}

func (s *WikiService) Delete(id string) error {
	return s.storage.DeleteWiki(id)
}

func (s *WikiService) StartWiki(id string) error {
	wiki, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if s.processService.IsRunning(id) {
		return errors.New("wiki is already running")
	}

	return s.processService.Start(wiki)
}

func (s *WikiService) StopWiki(id string) error {
	return s.processService.Stop(id)
}

func (s *WikiService) RestartWiki(id string) error {
	if err := s.StopWiki(id); err != nil {
		return err
	}
	
	// Wait a moment before restarting
	time.Sleep(1 * time.Second)
	
	return s.StartWiki(id)
}

func (s *WikiService) GetStatus(id string) string {
	if s.processService.IsRunning(id) {
		return "running"
	}
	return "stopped"
}

func (s *WikiService) GetAllTags() []string {
	wikis := s.storage.GetWikis()
	tagMap := make(map[string]bool)
	
	for _, wiki := range wikis {
		for _, tag := range wiki.Tags {
			tagMap[tag] = true
		}
	}
	
	tags := make([]string, 0, len(tagMap))
	for tag := range tagMap {
		tags = append(tags, tag)
	}
	
	sort.Strings(tags)
	return tags
}

func (s *WikiService) GetAllCategories() []string {
	wikis := s.storage.GetWikis()
	categoryMap := make(map[string]bool)
	
	for _, wiki := range wikis {
		if wiki.Category != "" {
			categoryMap[wiki.Category] = true
		}
	}
	
	categories := make([]string, 0, len(categoryMap))
	for category := range categoryMap {
		categories = append(categories, category)
	}
	
	sort.Strings(categories)
	return categories
}

func (s *WikiService) findAvailablePort() int {
	wikis := s.storage.GetWikis()
	usedPorts := make(map[int]bool)
	
	for _, wiki := range wikis {
		usedPorts[wiki.Port] = true
	}
	
	// Start from 8080
	port := 8080
	for {
		if !usedPorts[port] {
			return port
		}
		port++
		if port > 9000 {
			// Fallback to random port
			return 8080
		}
	}
}

