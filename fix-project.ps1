# Cleanup script for HireMe Maker
# This script will stop any Node.js processes and fix the React component

# Stop any Node.js processes
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like '*\node.exe'} | ForEach-Object {
    Write-Host "Stopping process with ID: $($_.Id)" -ForegroundColor Gray
    $_ | Stop-Process -Force
}

# Fix the ApiKeyPage.js file
$apiKeyPagePath = Join-Path $PSScriptRoot "frontend\src\components\ApiKeyPage.js"
Write-Host "Fixing ApiKeyPage.js..." -ForegroundColor Yellow

$fileContent = @'
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const ApiKeyPage = ({ onApiKeySet }) => {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showKey, setShowKey] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            setError('Please enter an API key');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('api_key', apiKey);
            const response = await axios.post(`${config.API_BASE_URL}/set-api-key`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.status === 'success') {
                onApiKeySet(apiKey);
            }
        } catch (err) {
            // Fix with traditional error checking instead of optional chaining
            let errorMessage = 'Failed to validate API key';
            if (err && err.response && err.response.data && err.response.data.detail) {
                errorMessage = err.response.data.detail;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg 
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2-2m2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m2-2a2 2 0 012-2h2a2 2 0 012 2m-2 2v6"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to HireMe Maker</h2>
                    <p className="text-gray-600 mb-6">AI-powered resume optimization for better ATS scores</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                                Gemini API Key
                            </label>
                            <div className="relative">
                                <input 
                                    type={showKey ? 'text' : 'password'}
                                    id="apiKey"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your API key"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showKey ? (
                                        <svg 
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg 
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path 
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg 
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle 
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path 
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Validating...
                                </div>
                            ) : (
                                'Set API Key'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Don't have an API key?</p>
                            <div className="space-y-2">
                                <a 
                                    href="https://makersuite.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Get free API key from Google AI Studio
                                    <svg 
                                        className="ml-1 h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyPage;
'@

Set-Content -Path $apiKeyPagePath -Value $fileContent -Force

# Also fix the package.json to remove github pages URL
$packageJsonPath = Join-Path $PSScriptRoot "frontend\package.json"
Write-Host "Fixing package.json..." -ForegroundColor Yellow

$packageJson = Get-Content -Path $packageJsonPath -Raw
$packageJson = $packageJson -replace '"homepage": "https://username.github.io/smart-resume-optimizer",', ''
Set-Content -Path $packageJsonPath -Value $packageJson -Force

Write-Host "`n✓ All files fixed successfully!" -ForegroundColor Green
Write-Host "`nNow you can run the application with:" -ForegroundColor Cyan
Write-Host "  .\start-simple.ps1  (No Docker)" -ForegroundColor White
Write-Host "  .\start-docker-fixed.ps1  (With Docker)" -ForegroundColor White

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
