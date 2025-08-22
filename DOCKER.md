# Docker Deployment Guide for Smart Resume Optimizer

## 🐳 Overview

This application is fully containerized using Docker and Docker Compose for easy deployment and development. We provide separate configurations for development and production environments.

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (usually included with Docker Desktop)
- **Make** (optional, for convenient commands)

### Installation Links:
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

## 🚀 Quick Start

### Option 1: Using Make (Recommended)

```bash
# Show all available commands
make help

# Start development environment
make dev

# Start production environment
make prod

# View logs
make dev-logs  # or make prod-logs

# Stop services
make dev-down  # or make prod-down
```

### Option 2: Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build

# Production with nginx proxy
docker-compose --profile production up --build
```

## 🛠️ Development Environment

The development setup includes:
- **Hot reloading** for both frontend and backend
- **Volume mounting** for live code changes
- **Separate containers** for easy debugging

```bash
# Start development environment
make dev

# Services will be available at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

### Development Features:
- ✅ Live code reloading
- ✅ Volume mounting for instant updates
- ✅ Debug-friendly configuration
- ✅ Separate development Dockerfiles

## 🏭 Production Environment

The production setup includes:
- **Optimized builds** with multi-stage Dockerfiles
- **Nginx** for serving static files
- **Health checks** for all services
- **Security headers** and rate limiting

```bash
# Start production environment
make prod

# Services will be available at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

### Production with Nginx Proxy:
```bash
# Start with nginx reverse proxy
make prod-proxy

# Application will be available at:
# http://localhost (nginx routes traffic automatically)
```

## 📊 Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Proxy                         │
│                  (Port 80/443)                         │
│              [Optional for production]                  │
└─────────────────┬─────────────────┬─────────────────────┘
                  │                 │
                  ▼                 ▼
         ┌─────────────────┐ ┌─────────────────┐
         │    Frontend     │ │     Backend     │
         │   (React App)   │ │   (FastAPI)     │
         │   Port 3000     │ │   Port 8000     │
         └─────────────────┘ └─────────────────┘
```

## 🔧 Configuration Files

### Docker Compose Files:
- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration

### Dockerfiles:
- `backend/Dockerfile` - Production backend image
- `backend/Dockerfile.dev` - Development backend image
- `frontend/Dockerfile` - Production frontend image (multi-stage)
- `frontend/Dockerfile.dev` - Development frontend image

### Nginx Configuration:
- `frontend/nginx.conf` - Frontend nginx config
- `nginx-proxy.conf` - Reverse proxy config

## 🌍 Environment Variables

### Backend Environment Variables:
```bash
# Optional: Set in docker-compose.yml or .env file
PYTHONPATH=/app
ENVIRONMENT=development
```

### Frontend Environment Variables:
```bash
# For custom API URL
REACT_APP_API_URL=http://localhost:8000

# For development hot reloading
CHOKIDAR_USEPOLLING=true
```

## 📱 Using the Application

1. **Start the services:**
   ```bash
   make dev  # or make prod
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **Enter your Gemini API key** on the first page

4. **Upload resume and job description**

5. **Get ATS analysis and tailored resume**

## 🔍 Monitoring and Logs

### View Logs:
```bash
# All services
make logs

# Development logs
make dev-logs

# Production logs
make prod-logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks:
```bash
# Check service health
make health

# Manual health check
curl http://localhost:8000/     # Backend
curl http://localhost:3000/health  # Frontend
```

### Container Status:
```bash
# Show running containers
make status

# Detailed container info
docker ps
docker stats
```

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Stop conflicting services
make down
```

#### 2. Build Failures
```bash
# Clean rebuild
make clean
make build

# Check Docker space
docker system df
docker system prune
```

#### 3. File Permission Issues (Linux/Mac)
```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

#### 4. Hot Reloading Not Working
```bash
# For React (Windows users especially)
# Set in docker-compose.dev.yml:
CHOKIDAR_USEPOLLING=true
```

### Debug Commands:
```bash
# Enter container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# View container logs
docker logs resume-optimizer-backend
docker logs resume-optimizer-frontend

# Restart specific service
docker-compose restart backend
```

## 🔒 Security Considerations

### Production Security:
- ✅ Security headers in nginx
- ✅ Rate limiting on API endpoints  
- ✅ File upload size limits
- ✅ Non-root user in containers
- ✅ Minimal base images

### Environment Security:
```bash
# Use environment variables for secrets
echo "GEMINI_API_KEY=your_key_here" > .env

# Add to .gitignore
echo ".env" >> .gitignore
```

## 📦 Deployment Options

### 1. Docker Hub
```bash
# Build and push images
docker build -t yourusername/resume-optimizer-backend ./backend
docker build -t yourusername/resume-optimizer-frontend ./frontend

docker push yourusername/resume-optimizer-backend
docker push yourusername/resume-optimizer-frontend
```

### 2. AWS ECS/EKS
- Use the docker-compose.yml as a base
- Configure load balancers and auto-scaling

### 3. Google Cloud Run
```bash
# Deploy backend
gcloud run deploy resume-optimizer-backend \
  --source ./backend \
  --region us-central1

# Deploy frontend  
gcloud run deploy resume-optimizer-frontend \
  --source ./frontend \
  --region us-central1
```

### 4. DigitalOcean App Platform
- Connect your GitHub repository
- Use the Dockerfiles for automatic deployment

## ⚡ Performance Optimization

### Production Optimizations:
- ✅ Multi-stage builds for smaller images
- ✅ Nginx gzip compression
- ✅ Static file caching
- ✅ Health checks for reliability
- ✅ Resource limits

### Scaling:
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🧹 Cleanup

### Remove All Containers and Images:
```bash
# Complete cleanup
make clean

# Manual cleanup
docker-compose down -v
docker system prune -a
docker volume prune
```

### Development Reset:
```bash
# Reset development environment
make dev-down
make clean
make dev
```

## 📋 Available Make Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make dev` | Start development environment |
| `make dev-logs` | Show development logs |
| `make dev-down` | Stop development environment |
| `make prod` | Start production environment |
| `make prod-logs` | Show production logs |
| `make prod-down` | Stop production environment |
| `make prod-proxy` | Start with nginx proxy |
| `make build` | Build all images |
| `make logs` | Show all logs |
| `make clean` | Complete cleanup |
| `make health` | Check service health |
| `make status` | Show container status |

## 🎯 Next Steps

1. **For Development:**
   - Run `make dev`
   - Start coding with hot reloading
   - Use `make dev-logs` to monitor

2. **For Production:**
   - Run `make prod` for testing
   - Deploy to cloud platform
   - Configure domain and SSL

3. **For CI/CD:**
   - Use the Dockerfiles in your pipeline
   - Set up automated testing
   - Deploy to container registry

Your Smart Resume Optimizer is now fully containerized and ready for any deployment scenario! 🚀 