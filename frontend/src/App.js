import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ApiKeyPage from './components/ApiKeyPage';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';

const Header = () => {
  const location = useLocation();
  
  const getStepInfo = () => {
    switch (location.pathname) {
      case '/':
        return { step: 1, title: 'API Setup', description: 'Enter your Gemini API key' };
      case '/upload':
        return { step: 2, title: 'Upload & Analyze', description: 'Upload resume and job description' };
      case '/results':
        return { step: 3, title: 'Results & Optimize', description: 'View analysis and optimize with AI' };
      default:
        return { step: 1, title: 'HireMe Maker', description: '' };
    }
  };

  const { step, title, description } = getStepInfo();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">HireMe Maker</h1>
              <p className="text-sm text-gray-500">AI-Powered Resume Optimizer</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">HireMe Maker</h1>
            </div>
          </div>

          {/* Progress Steps - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step 
                    ? 'bg-blue-600 text-white' 
                    : stepNum < step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum < step ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  stepNum === step ? 'text-blue-600' : stepNum < step ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepNum === 1 ? 'Setup' : stepNum === 2 ? 'Upload' : 'Results'}
                </span>
                {stepNum < 3 && (
                  <svg className="ml-4 h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden flex items-center space-x-1">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className={`h-2 w-8 rounded-full ${
                stepNum === step 
                  ? 'bg-blue-600' 
                  : stepNum < step 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`} />
            ))}
          </div>
        </div>

        {/* Current Step Info - Mobile */}
        <div className="md:hidden pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Step {step}/3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="mt-6 mb-8 md:mb-0 border-t bg-white/70 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm text-gray-600">
      <a
        href="https://www.linkedin.com/in/mohan-mahesh-boggavarapu-b1a48b249/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-gray-700 hover:text-blue-700 underline-offset-2 hover:underline"
        aria-label="Open LinkedIn profile of mohan mahesh"
      >
        © 2025 mohan mahesh — all rights reserved
      </a>
    </div>
  </footer>
);

function App() {
  const [apiKey, setApiKey] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [tailoredResults, setTailoredResults] = useState(null);

  const basename = process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL).pathname : '';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1 pb-10 md:pb-0">
          <Routes>
            <Route 
              path="/" 
              element={
                !apiKey ? (
                  <ApiKeyPage onApiKeySet={setApiKey} />
                ) : (
                  <Navigate to="/upload" replace />
                )
              } 
            />
            <Route 
              path="/upload" 
              element={
                apiKey ? (
                  <UploadPage 
                    onAnalysisComplete={(results, resumeText, jd) => {
                      setAnalysisResults(results);
                      setResumeText(resumeText);
                      setJobDescription(jd);
                    }}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/results" 
              element={
                analysisResults ? (
                  <ResultsPage 
                    analysisResults={analysisResults}
                    resumeText={resumeText}
                    jobDescription={jobDescription}
                    tailoredResults={tailoredResults}
                    onTailoredComplete={setTailoredResults}
                  />
                ) : (
                  <Navigate to="/upload" replace />
                )
              } 
            />
          </Routes>
        </main>

        <Footer />

        {/* Mobile Bottom Banner */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-center">
            <div className="bg-blue-50 rounded-full px-4 py-2">
              <p className="text-xs text-blue-700 font-medium">
                🔒 Your data is secure and processed locally
              </p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 