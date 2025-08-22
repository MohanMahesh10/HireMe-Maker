import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const UploadPage = ({ onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (file) => {
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
      if (validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.txt')) {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a PDF, Word document, or text file');
        setResumeFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload a resume file');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const response = await axios.post(`${config.API_BASE_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        onAnalysisComplete(response.data, response.data.resume_text, jobDescription);
        navigate('/results');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (filename) => {
    if (filename.toLowerCase().endsWith('.pdf')) {
      return (
        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z"/>
        </svg>
      );
    } else if (filename.toLowerCase().includes('doc')) {
      return (
        <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z"/>
        </svg>
      );
    } else {
      return (
        <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z"/>
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Resume & Job Description</h2>
          <p className="text-sm sm:text-base text-gray-600">Let's analyze your resume against the target job</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              1. Upload Your Resume
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : resumeFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume"
                onChange={(e) => handleFileChange(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {resumeFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {getFileIcon(resumeFile.name)}
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-green-700 text-sm sm:text-base">{resumeFile.name}</p>
                    <p className="text-xs sm:text-sm text-green-600">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click to change file
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                      Drop your resume here, or <span className="text-blue-600">click to browse</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Supports PDF, Word (.doc/.docx), and Text files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <label htmlFor="jobDescription" className="block text-lg font-semibold text-gray-900 mb-4">
              2. Job Description
            </label>
            <div className="relative">
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Paste the complete job description here...

Include requirements, responsibilities, skills, and qualifications for the best analysis."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {jobDescription.length} characters
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                💡 Include all job requirements
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✨ More details = better analysis
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base sm:text-lg touch-manipulation shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing Resume...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Analyze Resume & Get ATS Score
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Progress Steps */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Resume Analysis</p>
                <p className="text-xs text-gray-600">We'll extract text and analyze your resume content</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ATS Score Calculation</p>
                <p className="text-xs text-gray-600">Calculate keyword matching percentage with the job description</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">AI Optimization</p>
                <p className="text-xs text-gray-500">Generate an AI-optimized version using Gemini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;