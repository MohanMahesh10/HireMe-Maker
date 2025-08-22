const config = {
  development: {
    // For Docker development, backend runs on localhost:8000
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
  },
  production: {
    // On GitHub Pages, provide REACT_APP_API_URL at build time; fallback to local backend
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment]; 