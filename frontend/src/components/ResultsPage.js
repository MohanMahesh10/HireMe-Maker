import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import ViewLatexModal from './ViewLatexModal.jsx';

const ResultsPage = ({ 
  analysisResults, 
  resumeText, 
  jobDescription, 
  tailoredResults, 
  onTailoredComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    original: false,
    tailored: false
  });
  const [latexOpen, setLatexOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTailorResume = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        resume_text: resumeText,
        job_description: jobDescription,
      };

      const response = await axios.post(`${config.API_BASE_URL}/tailor_resume_overleaf`, { ...payload, fast: true }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log('tailor_resume_overleaf response', data);
      if (data.status === 'success') {
        const result = {
          new_ats_score: data.ats_after,
          improvement: data.ats_after - (analysisResults?.ats_score || 0),
          tailored_resume: data.latex_source, // store LaTeX for modal only
          pdf_base64: data.pdf_base64, // compiled PDF only (data URL)
          filename: data.filename || 'tailored_resume.pdf',
        };
        onTailoredComplete(result);
        if (!data.pdf_base64 || !data.latex_source) {
          alert('Generation succeeded but missing PDF or LaTeX. Please retry.');
        }
        setExpandedSections(prev => ({ ...prev, tailored: true }));
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  const b64ToBlob = (b64, contentType='application/pdf') => {
    const byteCharacters = atob(b64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const handleDownload = async (format) => {
    if (!tailoredResults) return;

    try {
      // Prefer direct PDF from base64 when available
      if (format === 'pdf' && tailoredResults.pdf_base64) {
        let url = tailoredResults.pdf_base64;
        if (!url.startsWith('data:')) {
          // raw base64 without data URL
          const blob = b64ToBlob(tailoredResults.pdf_base64, 'application/pdf');
          url = window.URL.createObjectURL(blob);
        }
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', tailoredResults.filename || 'tailored_resume.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        if (!url.startsWith('data:')) window.URL.revokeObjectURL(url);
        return;
      }

      // Fallback to legacy backend for txt/docx
      const formData = new FormData();
      formData.append('resume_text', tailoredResults.tailored_resume);
      formData.append('filename', 'tailored_resume');

      const response = await axios.post(`${config.API_BASE_URL}/download/${format}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tailored_resume.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Resume Analysis Results</h2>
          <p className="text-sm sm:text-base text-gray-600">Here's how your resume performs</p>
        </div>

        {/* ATS Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Original ATS Score</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">{analysisResults.ats_score}%</div>
            <p className="text-gray-600 text-sm">
              {analysisResults.analysis.matched_count} of {analysisResults.analysis.total_jd_keywords} keywords matched
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Optimized Score</h3>
            {tailoredResults ? (
              <>
                <div className="text-4xl font-bold text-green-600 mb-2">{tailoredResults.new_ats_score}%</div>
                <p className="text-gray-600 text-sm">Improvement: +{tailoredResults.improvement.toFixed(2)}%</p>
              </>
            ) : (
              <p className="text-gray-400 text-lg">Click "Optimize" below</p>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4">Matching Keywords</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {analysisResults.matching_keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {analysisResults.missing_keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Optimization Button */}
        {!tailoredResults && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <button
              onClick={handleTailorResume}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold text-base touch-manipulation"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Optimizing with AI...
                </div>
              ) : (
                'Optimize with Gemini AI'
              )}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Optimized Resume */}
        {tailoredResults && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Optimized Resume</h3>
                  <p className="text-green-100 text-sm mt-1">AI optimization complete!</p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button onClick={() => handleDownload('pdf')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">PDF</button>
                  <button onClick={() => handleDownload('docx')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">DOCX</button>
                  <button onClick={() => handleDownload('txt')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">TXT</button>
                </div>
              </div>
            </div>

            {/* PDF Preview when available */}
            {tailoredResults.pdf_base64 ? (
              <div className="px-6 pt-6">
                <div className="rounded-lg overflow-hidden border bg-white">
                  <object data={tailoredResults.pdf_base64} type="application/pdf" width="100%" height="800">
                    <iframe title="Optimized Resume PDF" src={tailoredResults.pdf_base64} className="w-full h-[70vh]" />
                  </object>
                </div>
              </div>
            ) : null}
            
            <div className="px-6 py-4">
              <button onClick={() => setLatexOpen(true)} disabled={!tailoredResults?.tailored_resume?.length} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border disabled:opacity-50">View LaTeX (copy-only)</button>
            </div>
          </div>
        )}

        {/* Original Resume */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button onClick={() => toggleSection('original')} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900">Original Resume</h3>
            <svg className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.original ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          
          {expandedSections.original && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{resumeText}</pre>
              </div>
            </div>
          )}
        </div>
        <ViewLatexModal open={latexOpen} onClose={() => setLatexOpen(false)} latex={tailoredResults?.tailored_resume || ''} />
      </div>
    </div>
  );
};

export default ResultsPage; 