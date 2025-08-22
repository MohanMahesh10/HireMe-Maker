# HireMe Maker

An AI-powered web application that helps optimize resumes for better ATS (Applicant Tracking System) scores using Google's Gemini AI.

![Screenshot 2025-08-22 122322](https://github.com/user-attachments/assets/557ff43b-8c41-48fb-ba97-7a2547e5f34f)


![Screenshot 2025-08-22 122035](https://github.com/user-attachments/assets/4a31a397-4420-4be0-8393-34321f7e43c5)


![Screenshot 2025-08-22 121801](https://github.com/user-attachments/assets/f0be38ad-08ba-4260-a12c-2a8236506fec)




## ✨ Features

- **📱 Mobile-First Design**: Fully responsive with touch-friendly interface optimized for all devices
- **🔑 API Key Integration**: Secure session-based storage of Gemini API key
- **📄 Multi-format Resume Upload**: Supports PDF, Word (.doc/.docx), and Text files with drag & drop
- **📊 ATS Score Analysis**: Calculate keyword matching percentage before and after optimization
- **🤖 AI-Powered Resume Tailoring**: Uses Gemini AI to rewrite resumes for better job description alignment
- **💾 Multiple Export Formats**: Download optimized resumes as PDF, DOCX, or TXT
- **🏷️ Keyword Analysis**: View matching and missing keywords between resume and job description
- **⚡ Progressive Web App**: Install on mobile devices for app-like experience
- **🎯 Touch Optimizations**: Large touch targets and gesture-friendly interactions

## Tech Stack

### Backend
- **FastAPI** (Python) - REST API framework
- **Google Generative AI** - Gemini Pro for resume optimization
- **PyMuPDF & pdfplumber** - PDF text extraction
- **python-docx** - Word document processing
- **ReportLab** - PDF generation
  <img width="802" height="670" alt="_- visual selection (1)" src="https://github.com/user-attachments/assets/11830d83-69ec-4110-99f2-b1576ca2c608" />


### Frontend
- **React** - UI framework
- **Tailwind CSS** - Mobile-first responsive styling
- **React Router** - SPA navigation
- **Axios** - HTTP client
- **PWA Features** - Service worker, manifest, offline support
  <img width="528" height="618" alt="_- visual selection" src="https://github.com/user-attachments/assets/acb5ac3b-eec5-41e8-9b32-825eb54f3b44" />


## 🐳 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://docs.docker.com/desktop/) installed and running
- [Gemini API Key](https://makersuite.google.com/app/apikey) from Google AI Studio

### Option 1: Using PowerShell Script (Windows)
```powershell
# Run the interactive Docker setup script
.\start-docker.ps1
```

### Option 2: Using MakeCommands
```bash
# Show available commands
make help

# Start development environment
make dev

# Start production environment  
make prod

# View logs
make dev-logs
```

### Option 3: Using Docker Compose Directly
```bash
# Development (with hot reloading)
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Documentation: http://localhost:8000/docs

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

## 📱 Mobile Experience

The application is designed mobile-first with:

- **Responsive Design**: Adapts perfectly to phones, tablets, and desktops
- **Touch-Friendly Interface**: Large buttons and touch targets (minimum 44px)
- **Progressive Web App**: Can be installed on mobile devices
- **Offline Capabilities**: Core functionality works without internet
- **Fast Loading**: Optimized for mobile networks
- **Gesture Support**: Drag & drop file uploads on touch devices

### PWA Installation
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Install App"
4. Access like a native app with offline support

## 🔧 Manual Setup (Alternative)

### Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and npm installed
3. **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Quick Start Scripts

**Windows:**
```bash
start.bat           # Traditional setup
start-docker.ps1    # Docker setup (recommended)
```

**Linux/Mac:**
```bash
./start.sh          # Traditional setup
make dev            # Docker setup (recommended)
```

## Usage

1. **Enter API Key**: Start by entering your Gemini API key from Google AI Studio
2. **Upload Resume**: Upload your resume (PDF, DOCX, or TXT format) with drag & drop
3. **Add Job Description**: Paste the job description you're targeting
4. **Analyze**: View your current ATS score and missing keywords
5. **Optimize**: Click "Optimize with AI" to generate an AI-optimized version
6. **Download**: Export your optimized resume in your preferred format

## API Endpoints

### POST `/set-api-key`
Set and validate Gemini API key for the session
- **Body**: `api_key` (form data)

### POST `/analyze`
Analyze resume against job description
- **Body**: `resume` (file), `job_description` (form data)
- **Returns**: ATS score, matching/missing keywords, extracted resume text

### POST `/tailor`
Generate AI-optimized resume using Gemini
- **Body**: `resume_text`, `job_description` (form data)
- **Returns**: Tailored resume, before/after ATS scores

### POST `/download/{format}`
Download tailored resume in specified format
- **Parameters**: `format` (pdf/docx/txt)
- **Body**: `resume_text`, `filename` (form data)
- **Returns**: File download

## 📦 Deployment

### Docker Deployment (Recommended)

1. **Development:**
   ```bash
   make dev
   ```

2. **Production:**
   ```bash
   make prod
   ```

3. **Cloud Deployment:**
   - Use the provided Dockerfiles
   - Deploy to AWS ECS, Google Cloud Run, or DigitalOcean
   - See [DOCKER.md](DOCKER.md) for detailed instructions

### Traditional Deployment

For traditional deployment to GitHub Pages and cloud services, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Frontend Deployment

1. Update the `homepage` field in `frontend/package.json`:
```json
"homepage": "https://yourusername.github.io/smart-resume-optimizer"
```

2. Update the Router basename in `frontend/src/App.js`:
```jsx
<Router basename="/smart-resume-optimizer">
```

3. Build and deploy:
```bash
cd frontend
npm run build
npm run deploy
```

### Backend Deployment Options

#### Option 1: Heroku
```bash
heroku create your-app-name
git subtree push --prefix backend heroku main
```

#### Option 2: Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `backend` folder

#### Option 3: Docker-based Deployment
```bash
# Build and push to registry
docker build -t yourusername/resume-optimizer-backend ./backend
docker push yourusername/resume-optimizer-backend
```

## Project Structure

```
smart-resume-optimizer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Production Docker image
│   └── Dockerfile.dev      # Development Docker image
├── frontend/
│   ├── public/
│   │   ├── index.html       # HTML template with PWA support
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiKeyPage.js    # Mobile-optimized API key input
│   │   │   ├── UploadPage.js    # Touch-friendly upload interface
│   │   │   └── ResultsPage.js   # Responsive results display
│   │   ├── App.js           # Main app with mobile navigation
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Mobile-first CSS with Tailwind
│   ├── package.json         # Node.js dependencies
│   ├── Dockerfile          # Production Docker image
│   └── Dockerfile.dev      # Development Docker image
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
├── Makefile                # Docker convenience commands
├── DOCKER.md               # Docker documentation
├── DEPLOYMENT.md           # Traditional deployment guide
└── README.md               # This file
```

<img width="2982" height="1805" alt="diagram-export-8-22-2025-4_28_40-PM" src="https://github.com/user-attachments/assets/938fc97a-133c-46cb-a8fc-217e807ccbd1" />


## 🛠️ Development

### With Docker (Recommended):
```bash
# Start development environment with hot reloading
make dev

# View logs
make dev-logs

# Stop services
make dev-down
```

### Without Docker:
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```


<img width="924" height="841" alt="_- visual selection (4)" src="https://github.com/user-attachments/assets/f8af69f3-7625-49f0-94fd-4916d4b696a7" />


## 🌟 Mobile Optimizations

- **Touch Targets**: All interactive elements are minimum 44px for easy touch access
- **Responsive Grid**: Adaptive layouts for different screen sizes
- **Gesture Support**: Drag & drop file uploads work on touch devices
- **Loading States**: Visual feedback for all network operations
- **Progressive Enhancement**: Core functionality works on older devices
- **Safe Area Support**: Proper handling of notches and rounded corners
- **Landscape Mode**: Optimized layouts for mobile landscape orientation
  ![Screenshot 2025-08-22 122322](https://github.com/user-attachments/assets/d9289796-a63b-45e4-b2b5-72f5290bb6d5)


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `make dev`
5. Test on mobile devices and different screen sizes
6. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the [Issues](https://github.com/yourusername/smart-resume-optimizer/issues) page
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce
4. Mention device/browser information for mobile issues

## Documentation

- [Docker Setup Guide](DOCKER.md) - Complete Docker deployment instructions
- [Traditional Deployment](DEPLOYMENT.md) - Non-Docker deployment options

## Roadmap

- [x] Mobile-first responsive design
- [x] Progressive Web App support
- [x] Touch-friendly interface
- [x] Drag & drop file uploads
- [ ] Dark mode support
- [ ] Offline functionality expansion
- [ ] Multi-language support
- [ ] Enhanced accessibility features
- [ ] Voice input for job descriptions
- [ ] Batch resume processing
- [ ] Resume templates library
- [ ] Advanced ATS scoring algorithms
- [ ] Integration with job boards
- [ ] AI-powered interview preparation 
