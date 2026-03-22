package usecase

import (
	"chipsiBackend/domain"
	"context"
	"mime/multipart"
	"time"
)

type menuItemUsecase struct {
	categoryUsecase    domain.CategoryUsecase
	menuItemRepository domain.MenuItemRepository
	contextTimeout     time.Duration
}

func NewMenuItemUsecase(categoryUsecase domain.CategoryUsecase, menuItemRepository domain.MenuItemRepository, timeout time.Duration) domain.MenuItemUsecase {
	return &menuItemUsecase{
		categoryUsecase:    categoryUsecase,
		menuItemRepository: menuItemRepository,
		contextTimeout:     timeout,
	}
}

func (mu menuItemUsecase) Create(ctx context.Context, menuItem *domain.MenuItem, image multipart.File, handler *multipart.FileHeader) (*domain.MenuItem, error) {
	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()

	// Без загрузки на S3, просто сохраняем имя файла как URL
	if handler != nil {
		menuItem.ImageURL = "/uploads/" + handler.Filename
	}
	
	newMenuItem, err := mu.menuItemRepository.Create(ctx, menuItem)
	if err != nil {
		return nil, err
	}
	return newMenuItem, nil
}

func (mu menuItemUsecase) GetByID(ctx context.Context, id int64) (*domain.MenuItem, error) {
	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()
	return mu.menuItemRepository.GetByID(ctx, id)
}

func (mu menuItemUsecase) GetAllByCategory(ctx context.Context, categoryId int64) ([]*domain.MenuItem, error) {
	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()
	_, err := mu.categoryUsecase.GetByID(ctx, categoryId)
	if err != nil {
		return nil, err
	}
	return mu.menuItemRepository.GetAllByCategory(ctx, categoryId)
}

func (mu menuItemUsecase) Delete(ctx context.Context, id int64) error {
	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()
	return mu.menuItemRepository.Delete(ctx, id)
}
