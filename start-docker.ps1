# HireMe Maker - Docker Startup Script
Write-Host "HireMe Maker - Docker Edition" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "`nChecking Docker status..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "✓ Docker is installed and running" -ForegroundColor Green
} 
catch {
    Write-Host "✗ Docker is not installed or not running" -ForegroundColor Red
    Write-Host "Please install Docker Desktop and make sure it's running." -ForegroundColor Red
    Write-Host "Download from: https://docs.docker.com/desktop/windows/install/" -ForegroundColor Blue
    exit 1
}

# Show menu
Write-Host "`nChoose deployment mode:" -ForegroundColor Yellow
Write-Host "1. Development (with hot reloading)" -ForegroundColor White
Write-Host "2. Production" -ForegroundColor White
Write-Host "3. Production with Nginx Proxy" -ForegroundColor White
Write-Host "4. Show logs" -ForegroundColor White
Write-Host "5. Stop all services" -ForegroundColor White
Write-Host "6. Clean up (remove all containers and images)" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host "`nStarting development environment..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up --build -d
        Write-Host "`n✓ Development services started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
        Write-Host "Backend:  http://localhost:8000" -ForegroundColor Blue
        Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Blue
        Write-Host "`nTo view logs, run this script again and choose option 4" -ForegroundColor Yellow
    }
    "2" {
        Write-Host "`nStarting production environment..." -ForegroundColor Green
        docker-compose up --build -d
        Write-Host "`n✓ Production services started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
        Write-Host "Backend:  http://localhost:8000" -ForegroundColor Blue
    }
    "3" {
        Write-Host "`nStarting production environment with nginx proxy..." -ForegroundColor Green
        docker-compose --profile production up --build -d
        Write-Host "`n✓ Production services with proxy started!" -ForegroundColor Green
        Write-Host "Application: http://localhost" -ForegroundColor Blue
    }
    "4" {
        Write-Host "`nChoose logs to view:" -ForegroundColor Yellow
        Write-Host "1. Development logs"
        Write-Host "2. Production logs"
        Write-Host "3. All services"
        $logChoice = Read-Host "Enter choice (1-3)"
        
        switch ($logChoice) {
            "1" { docker-compose -f docker-compose.dev.yml logs -f }
            "2" { docker-compose logs -f }
            "3" { 
                docker-compose logs --tail=50
                docker-compose -f docker-compose.dev.yml logs --tail=50
            }
            default { Write-Host "Invalid choice" -ForegroundColor Red }
        }
    }
    "5" {
        Write-Host "`nStopping all services..." -ForegroundColor Yellow
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        Write-Host "✓ All services stopped" -ForegroundColor Green
    }
    "6" {
        $confirm = Read-Host "`nThis will remove all containers and images. Are you sure? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host "`nCleaning up..." -ForegroundColor Yellow
            docker-compose down -v
            docker-compose -f docker-compose.dev.yml down -v
            docker container prune -f
            docker image prune -f
            docker volume prune -f
            Write-Host "✓ Cleanup complete!" -ForegroundColor Green
        } else {
            Write-Host "Cleanup cancelled" -ForegroundColor Yellow
        }
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nTo manage services later, you can use:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f      (view logs)" -ForegroundColor White
Write-Host "  docker-compose down         (stop services)" -ForegroundColor White
Write-Host "  docker-compose restart      (restart services)" -ForegroundColor White
Write-Host "  docker ps                   (show running containers)" -ForegroundColor White

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
