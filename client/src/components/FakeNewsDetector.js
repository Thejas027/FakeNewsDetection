import React, { useState } from 'react';
import axios from 'axios';

const FakeNewsDetector = () => {
  const [newsText, setNewsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsText.trim()) {
      setError('Please enter some news text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        text: newsText
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewsText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🕵️</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fake News Detective
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-gray-600">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm">AI-Powered Detection</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse-slow">
            <span className="text-white text-3xl">🔍</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Detect Fake News with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste any news article or text below and our advanced AI will analyze it for credibility and authenticity
          </p>
        </div>

        {/* Detection Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newsText" className="block text-lg font-semibold text-gray-700 mb-3">
                Enter News Text to Analyze
              </label>
              <textarea
                id="newsText"
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                placeholder="Paste your news article or text here..."
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-gray-700"
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newsText.length} characters
                </span>
                {newsText.length < 50 && newsText.length > 0 && (
                  <span className="text-sm text-yellow-600">
                    ⚠️ Text should be at least 50 characters for better accuracy
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !newsText.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Analyze News</span>
                  </>
                )}
              </button>
              
              {(newsText || result || error) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-2xl">❌</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analysis Results</h3>
            
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                result.prediction === 'REAL' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <span className="text-4xl">
                  {result.prediction === 'REAL' ? '✅' : '❌'}
                </span>
              </div>
              
              <div className={`text-3xl font-bold mb-2 ${
                result.prediction === 'REAL' ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.prediction === 'REAL' ? 'LIKELY REAL' : 'LIKELY FAKE'}
              </div>
              
              <p className="text-gray-600 max-w-md mx-auto">
                {result.prediction === 'REAL' 
                  ? 'This text appears to be legitimate news content based on our AI analysis.'
                  : 'This text shows characteristics commonly found in fake news content.'
                }
              </p>
            </div>

            {result.confidence && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-700 mb-3">Confidence Score</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      result.prediction === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0%</span>
                  <span className="font-semibold">{result.confidence}%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Disclaimer:</strong> This is an AI-powered analysis tool. Results should not be considered as definitive fact-checking. Always verify news through multiple reliable sources.
              </p>
            </div>
          </div>
        )}

        {/* How it Works Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Input Text</h4>
              <p className="text-gray-600 text-sm">Paste any news article or text you want to verify</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h4>
              <p className="text-gray-600 text-sm">Our machine learning model analyzes language patterns and credibility markers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">3. Get Results</h4>
              <p className="text-gray-600 text-sm">Receive instant feedback on the likelihood of the content being fake or real</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Fake News Detective. Built with AI for a more informed world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FakeNewsDetector;
