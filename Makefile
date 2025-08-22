.PHONY: help build up down logs restart clean dev prod test

# Default target
help:
	@echo "Smart Resume Optimizer - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development environment with hot reloading"
	@echo "  make dev-logs   - Show development logs"
	@echo "  make dev-down   - Stop development environment"
	@echo ""
	@echo "Production:"
	@echo "  make prod       - Start production environment"
	@echo "  make prod-logs  - Show production logs"
	@echo "  make prod-down  - Stop production environment"
	@echo ""
	@echo "General:"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start services (production)"
	@echo "  make down       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - Show logs from all services"
	@echo "  make clean      - Remove all containers, images, and volumes"
	@echo "  make test       - Run tests"
	@echo ""

# Development environment
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build -d
	@echo ""
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo ""
	@echo "Use 'make dev-logs' to see logs"

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-down:
	docker-compose -f docker-compose.dev.yml down

# Production environment
prod:
	@echo "Starting production environment..."
	docker-compose up --build -d
	@echo ""
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "Proxy:    http://localhost (with --profile production)"
	@echo ""

prod-logs:
	docker-compose logs -f

prod-down:
	docker-compose down

# Production with proxy
prod-proxy:
	@echo "Starting production environment with proxy..."
	docker-compose --profile production up --build -d
	@echo ""
	@echo "Services started!"
	@echo "Application: http://localhost"
	@echo ""

# General commands
build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

restart:
	make down
	make up

logs:
	docker-compose logs -f

# Cleanup
clean:
	@echo "Stopping all containers..."
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	@echo "Removing containers..."
	docker container prune -f
	@echo "Removing images..."
	docker image prune -f
	@echo "Removing volumes..."
	docker volume prune -f
	@echo "Cleanup complete!"

# Testing
test:
	@echo "Running backend tests..."
	docker-compose -f docker-compose.dev.yml exec backend-dev python -m pytest
	@echo "Running frontend tests..."
	docker-compose -f docker-compose.dev.yml exec frontend-dev npm test -- --watchAll=false

# Health check
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8000/ && echo "✓ Backend healthy" || echo "✗ Backend unhealthy"
	@curl -f http://localhost:3000/health && echo "✓ Frontend healthy" || echo "✗ Frontend unhealthy"

# Database operations (if needed in future)
db-reset:
	docker-compose down -v
	docker volume rm $(shell docker volume ls -q | grep resume-optimizer) 2>/dev/null || true
	docker-compose up -d

# Show container status
status:
	@echo "Container Status:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 