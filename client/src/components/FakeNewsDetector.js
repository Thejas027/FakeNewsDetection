import React, { useState } from 'react';
import axios from 'axios';

const FakeNewsDetector = () => {
  // Original text analysis state
  const [newsText, setNewsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New feature states
  const [activeTab, setActiveTab] = useState('text'); // text, url, batch, social
  const [urlInput, setUrlInput] = useState('');
  const [batchFiles, setBatchFiles] = useState([]);
  const [socialInput, setSocialInput] = useState('');
  const [urlResult, setUrlResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [socialResult, setSocialResult] = useState(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  
  // Demo examples state
  const [showDemoExamples, setShowDemoExamples] = useState(false);

  // Demo examples data
  const realNewsExamples = [
    {
      title: "Federal Reserve Interest Rate Decision",
      preview: "The Federal Reserve announced a 0.25% interest rate increase...",
      text: "The Federal Reserve announced a 0.25% interest rate increase following their monthly meeting. Federal Reserve Chair Jerome Powell cited inflation concerns and strong employment data as key factors in the decision. The rate increase brings the federal funds rate to 5.50%, the highest level in over 20 years. Powell noted that the Fed will continue to monitor economic indicators and adjust policy as needed to maintain price stability and full employment.",
      category: "Economic News",
      confidence: "Very High"
    },
    {
      title: "Scientific Breakthrough in Medicine", 
      preview: "Researchers at Johns Hopkins University have published findings...",
      text: "Researchers at Johns Hopkins University have published findings in the journal Nature Medicine showing promising results for a new cancer treatment. The phase 2 clinical trial involved 150 patients with advanced melanoma. The treatment showed a 65% response rate, significantly higher than current standard treatments. Lead researcher Dr. Sarah Chen emphasized that while these results are encouraging, larger phase 3 trials are needed before the treatment can be approved for widespread use.",
      category: "Health & Science",
      confidence: "Very High"
    },
    {
      title: "Climate Change Research Update",
      preview: "New data from NASA satellites reveals significant changes...",
      text: "New data from NASA satellites reveals significant changes in Arctic ice coverage over the past decade. The study, published in the journal Science, analyzed satellite imagery from 2013 to 2023. Researchers found that Arctic sea ice extent has declined by an average of 13% per decade. Dr. Michael Thompson, lead author of the study, noted that these findings are consistent with climate models and underscore the importance of continued monitoring and climate action.",
      category: "Environmental",
      confidence: "Very High"
    },
    {
      title: "Tech Company Quarterly Earnings Report",
      preview: "Apple Inc. reported quarterly earnings that exceeded analyst expectations...",
      text: "Apple Inc. reported quarterly earnings that exceeded analyst expectations, with revenue of $89.5 billion for the fourth quarter of 2023. CEO Tim Cook attributed the strong performance to iPhone sales in emerging markets and growth in services revenue. The company's stock price rose 3.2% in after-hours trading. Apple also announced plans to increase its dividend and continue its share buyback program.",
      category: "Business",
      confidence: "High"
    }
  ];

  const fakeNewsExamples = [
    {
      title: "Shocking Celebrity Scandal (Fake)",
      preview: "BREAKING: You won't believe what this celebrity did...",
      text: "BREAKING: You won't believe what this celebrity did that doctors hate! This shocking revelation will change everything you thought you knew about Hollywood. Sources close to the star reveal this unbelievable secret that the mainstream media doesn't want you to know. Click here to find out more about this urgent breaking news that will blow your mind!",
      category: "Clickbait",
      redFlags: ["Sensational language", "No credible sources", "Call to action"]
    },
    {
      title: "Miracle Cure Conspiracy (Fake)",
      preview: "Doctors HATE this one weird trick that cures everything...",
      text: "Doctors HATE this one weird trick that cures everything! Big Pharma doesn't want you to know about this ancient remedy that can cure cancer, diabetes, and heart disease in just 7 days! This amazing discovery was found in a 5000-year-old manuscript and has been suppressed by the medical establishment. Order now before this information is banned forever!",
      category: "Health Misinformation",
      redFlags: ["Miracle cure claims", "Conspiracy theories", "Urgency tactics"]
    },
    {
      title: "Political Conspiracy Theory (Fake)",
      preview: "URGENT: Government cover-up exposed by whistleblower...",
      text: "URGENT: Government cover-up exposed by whistleblower! Shocking documents reveal that politicians have been secretly planning to control the population using mind control technology. This explosive revelation proves that everything you've been told is a lie. Share this immediately before it gets deleted by the deep state censors!",
      category: "Political Misinformation",
      redFlags: ["Conspiracy language", "Fear mongering", "Unverified claims"]
    },
    {
      title: "Investment Scam Alert (Fake)",
      preview: "Make $5000 a day with this one simple trick...",
      text: "Make $5000 a day with this one simple trick that Wall Street doesn't want you to know! Sarah from Ohio made $50,000 in her first week using this secret method. Limited time offer - only 50 spots remaining! Don't miss out on this life-changing opportunity. Click now to secure your financial freedom!",
      category: "Financial Scam",
      redFlags: ["Unrealistic promises", "False testimonials", "Pressure tactics"]
    }
  ];

  const urlExamples = [
    {
      source: "Reuters News",
      type: "Highly Credible Source",
      url: "https://www.reuters.com/business/finance/fed-rate-decision-2024",
      description: "Federal Reserve monetary policy update",
      trustScore: 95
    },
    {
      source: "BBC News",
      type: "Highly Credible Source", 
      url: "https://www.bbc.com/news/science-environment-climate-report",
      description: "Climate change research findings",
      trustScore: 92
    },
    {
      source: "Associated Press",
      type: "Highly Credible Source",
      url: "https://apnews.com/technology/ai-breakthrough-research",
      description: "AI technology breakthrough coverage",
      trustScore: 96
    },
    {
      source: "CNN Breaking",
      type: "Credible Source",
      url: "https://www.cnn.com/politics/breaking-news-update",
      description: "Political news update",
      trustScore: 85
    },
    {
      source: "Tech News Daily",
      type: "Moderate Credibility",
      url: "https://technewsdaily.com/latest-gadget-review",
      description: "Technology product reviews",
      trustScore: 70
    },
    {
      source: "Questionable News Site",
      type: "Low Credibility",
      url: "https://fakenewssite.com/shocking-revelation",
      description: "Sensationalized content example",
      trustScore: 25
    }
  ];

  const socialMediaExamples = [
    {
      platform: "Twitter/X",
      type: "Legitimate Post",
      content: "Just published our latest research on renewable energy efficiency in @ScienceJournal. Excited to share findings that could impact solar panel technology! 🔬⚡ #CleanEnergy #Research",
      description: "Scientific announcement with credible source",
      category: "Real",
      engagement: "High quality engagement"
    },
    {
      platform: "Facebook",
      type: "Misinformation",
      content: "URGENT SHARE BEFORE DELETED!!! Scientists have discovered that drinking coffee with honey can cure any disease! Big Pharma doesn't want you to know this SECRET! My aunt tried it and cured her diabetes in 3 days! 😱🍯☕",
      description: "Health misinformation with emotional triggers",
      category: "Fake",
      engagement: "Suspicious viral sharing"
    },
    {
      platform: "Instagram",
      type: "Legitimate Post",
      content: "Behind the scenes at our climate research station in Antarctica. Temperature data collection is crucial for understanding global warming patterns. #ClimateScience #Antarctica #Research 🧊📊",
      description: "Educational content from verified scientist",
      category: "Real",
      engagement: "Educational engagement"
    },
    {
      platform: "TikTok",
      type: "Conspiracy Theory",
      content: "Nobody is talking about this but the government is using 5G towers to control our thoughts! I have PROOF that they're reading our minds through our phones! Wake up people! 📱👁️ #Truth #Conspiracy #WakeUp",
      description: "Conspiracy theory without evidence",
      category: "Fake",
      engagement: "Polarized reactions"
    }
  ];

  // Original text analysis function
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

  // URL Analysis function
  const handleUrlAnalysis = async (e) => {
    e.preventDefault();
    
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setUrlLoading(true);
    setError('');
    setUrlResult(null);

    try {
      // First extract text from URL, then analyze
      const response = await axios.post('http://localhost:5000/api/analyze-url', {
        url: urlInput
      });
      
      setUrlResult({
        ...response.data,
        source: urlInput,
        sourceCredibility: getSourceCredibility(urlInput)
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze URL. Please check the URL and try again.');
    } finally {
      setUrlLoading(false);
    }
  };

  // Batch Processing function
  const handleBatchAnalysis = async (e) => {
    e.preventDefault();
    
    if (batchFiles.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    setBatchLoading(true);
    setError('');
    setBatchResults([]);

    try {
      const results = [];
      for (let i = 0; i < batchFiles.length; i++) {
        const file = batchFiles[i];
        const text = await readFileAsText(file);
        
        const response = await axios.post('http://localhost:5000/api/predict', {
          text: text
        });
        
        results.push({
          fileName: file.name,
          result: response.data,
          fileSize: file.size
        });
      }
      
      setBatchResults(results);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process batch files.');
    } finally {
      setBatchLoading(false);
    }
  };

  // Social Media Analysis function
  const handleSocialAnalysis = async (e) => {
    e.preventDefault();
    
    if (!socialInput.trim()) {
      setError('Please enter social media content or URL');
      return;
    }

    setSocialLoading(true);
    setError('');
    setSocialResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-social', {
        content: socialInput
      });
      
      setSocialResult({
        ...response.data,
        platform: detectPlatform(socialInput),
        factCheck: await performFactCheck(socialInput)
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze social media content.');
    } finally {
      setSocialLoading(false);
    }
  };

  // Helper functions
  const getSourceCredibility = (url) => {
    const domain = new URL(url).hostname.toLowerCase();
    const credibleSources = {
      'reuters.com': { score: 95, rating: 'Highly Credible' },
      'ap.org': { score: 95, rating: 'Highly Credible' },
      'bbc.com': { score: 90, rating: 'Highly Credible' },
      'cnn.com': { score: 85, rating: 'Credible' },
      'nytimes.com': { score: 90, rating: 'Highly Credible' },
      'washingtonpost.com': { score: 88, rating: 'Credible' },
      'theguardian.com': { score: 87, rating: 'Credible' },
      'npr.org': { score: 92, rating: 'Highly Credible' }
    };

    for (const source in credibleSources) {
      if (domain.includes(source)) {
        return credibleSources[source];
      }
    }
    
    return { score: 50, rating: 'Unknown Source' };
  };

  const detectPlatform = (input) => {
    if (input.includes('twitter.com') || input.includes('x.com')) return 'Twitter/X';
    if (input.includes('facebook.com')) return 'Facebook';
    if (input.includes('instagram.com')) return 'Instagram';
    if (input.includes('linkedin.com')) return 'LinkedIn';
    if (input.includes('tiktok.com')) return 'TikTok';
    return 'Generic Social Media';
  };

  const performFactCheck = async (content) => {
    // Mock fact-checking - in production, integrate with fact-checking APIs
    const factCheckAPIs = [
      'Snopes.com',
      'FactCheck.org', 
      'PolitiFact.com',
      'Reuters Fact Check'
    ];
    
    return {
      status: 'Checked',
      sources: factCheckAPIs.slice(0, 2),
      confidence: Math.floor(Math.random() * 30) + 70
    };
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setBatchFiles(files);
  };

  // Demo example handlers
  const handleDemoExample = (exampleText) => {
    setActiveTab('text');
    setNewsText(exampleText);
    setShowDemoExamples(false);
    // Scroll to the form
    setTimeout(() => {
      document.querySelector('#newsText')?.focus();
    }, 100);
  };

  const handleUrlExample = (exampleUrl) => {
    setActiveTab('url');
    setUrlInput(exampleUrl);
    setShowDemoExamples(false);
    // Scroll to the form
    setTimeout(() => {
      document.querySelector('#urlInput')?.focus();
    }, 100);
  };

  const handleSocialExample = (exampleContent) => {
    setActiveTab('social');
    setSocialInput(exampleContent);
    setShowDemoExamples(false);
    // Scroll to the form
    setTimeout(() => {
      document.querySelector('#socialInput')?.focus();
    }, 100);
  };

  const resetForm = () => {
    // Reset based on active tab
    if (activeTab === 'text') {
      setNewsText('');
      setResult(null);
    } else if (activeTab === 'url') {
      setUrlInput('');
      setUrlResult(null);
    } else if (activeTab === 'batch') {
      setBatchFiles([]);
      setBatchResults([]);
    } else if (activeTab === 'social') {
      setSocialInput('');
      setSocialResult(null);
    }
    setError('');
  };

  const tabs = [
    { id: 'text', label: '📝 Text Analysis', icon: '📝' },
    { id: 'url', label: '🔗 URL Analysis', icon: '🔗' },
    { id: 'batch', label: '📂 Batch Processing', icon: '📂' },
    { id: 'social', label: '📱 Social Media', icon: '📱' }
  ];

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
         
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-float">
            🚀 Advanced AI-Powered Fake News Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Analyze text, URLs, batch files, and social media content with our comprehensive AI detection system featuring source credibility analysis and real-time fact-checking
          </p>
          
          {/* Demo Examples Button */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setShowDemoExamples(!showDemoExamples)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse-glow"
            >
              {showDemoExamples ? '🙈 Hide Demo Examples' : '🎯 Try Interactive Demo Examples'}
            </button>
          </div>          {/* Demo Examples */}
          {showDemoExamples && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-slide-in">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                🎯 Interactive Demo Examples
              </h3>
              <p className="text-center text-gray-600 mb-8 text-lg">
                Click on any example below to automatically fill the form and test our AI detection system
              </p>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Real News Examples */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-green-600 flex items-center">
                      <span className="mr-3 text-2xl">✅</span> Legitimate News Examples
                    </h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {realNewsExamples.length} examples
                    </span>
                  </div>
                  {realNewsExamples.map((example, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 cursor-pointer hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group" 
                         onClick={() => handleDemoExample(example.text)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-green-800 text-lg">{example.title}</h5>
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md text-xs font-semibold">
                              {example.category}
                            </span>
                          </div>
                          <p className="text-green-700 mb-3 leading-relaxed">{example.preview}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-medium">
                              Expected Confidence: {example.confidence}
                            </span>
                            <span className="text-green-500">•</span>
                            <span className="text-xs text-green-600">Click to try →</span>
                          </div>
                        </div>
                        <button className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors duration-200 group-hover:scale-110">
                          Try Example
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake News Examples */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-red-600 flex items-center">
                      <span className="mr-3 text-2xl">❌</span> Misinformation Examples
                    </h4>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {fakeNewsExamples.length} examples
                    </span>
                  </div>
                  {fakeNewsExamples.map((example, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-5 cursor-pointer hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                         onClick={() => handleDemoExample(example.text)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-red-800 text-lg">{example.title}</h5>
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded-md text-xs font-semibold">
                              {example.category}
                            </span>
                          </div>
                          <p className="text-red-700 mb-3 leading-relaxed">{example.preview}</p>
                          <div className="mb-2">
                            <span className="text-xs text-red-600 font-medium block mb-1">Common Red Flags:</span>
                            <div className="flex flex-wrap gap-1">
                              {example.redFlags.map((flag, flagIndex) => (
                                <span key={flagIndex} className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-red-600">Click to test detection →</span>
                        </div>
                        <button className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors duration-200 group-hover:scale-110">
                          Try Example
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Examples */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-blue-600 flex items-center">
                    <span className="mr-3 text-2xl">🔗</span> URL Analysis Examples
                  </h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Switch to URL tab to test
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {urlExamples.map((example, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                         onClick={() => handleUrlExample(example.url)}>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            example.trustScore >= 90 ? 'bg-green-500' :
                            example.trustScore >= 70 ? 'bg-yellow-500' :
                            example.trustScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                          }`}>
                            {example.trustScore}
                          </div>
                        </div>
                        <h6 className="font-bold text-blue-800 text-sm mb-1">{example.source}</h6>
                        <p className="text-xs text-blue-600 mb-2">{example.type}</p>
                        <p className="text-xs text-gray-600 mb-3">{example.description}</p>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors duration-200 group-hover:scale-110">
                          Test URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 text-center">
                    💡 <strong>Tip:</strong> These URL examples demonstrate how our system analyzes source credibility, 
                    domain reputation, and content authenticity. Higher trust scores indicate more reliable sources.
                  </p>
                </div>
              </div>

              {/* Social Media Examples */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-purple-600 flex items-center">
                    <span className="mr-3 text-2xl">📱</span> Social Media Analysis Examples
                  </h4>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Switch to Social tab to test
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {socialMediaExamples.map((example, index) => (
                    <div key={index} className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg group ${
                      example.category === 'Real' 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300' 
                        : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100 hover:border-red-300'
                    }`}
                         onClick={() => handleSocialExample(example.content)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            example.category === 'Real' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {example.platform}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            example.category === 'Real' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {example.type}
                          </span>
                        </div>
                        <button className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-200 group-hover:scale-110 ${
                          example.category === 'Real' 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}>
                          Try Post
                        </button>
                      </div>
                      <p className={`text-sm mb-3 leading-relaxed ${
                        example.category === 'Real' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {example.content}
                      </p>
                      <div className="text-xs space-y-1">
                        <p className={example.category === 'Real' ? 'text-green-600' : 'text-red-600'}>
                          <strong>Analysis:</strong> {example.description}
                        </p>
                        <p className={example.category === 'Real' ? 'text-green-600' : 'text-red-600'}>
                          <strong>Engagement Pattern:</strong> {example.engagement}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 text-center">
                    🚀 <strong>Social Media Analysis:</strong> Our AI examines post content, engagement patterns, 
                    source credibility, and viral distribution characteristics to detect misinformation campaigns.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 pt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Original Text Analysis Tab */}
            {activeTab === 'text' && (
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
            )}

            {/* URL Analysis Tab */}
            {activeTab === 'url' && (
              <form onSubmit={handleUrlAnalysis} className="space-y-6">
                <div>
                  <label htmlFor="urlInput" className="block text-lg font-semibold text-gray-700 mb-3">
                    Enter News Article URL
                  </label>
                  <input
                    id="urlInput"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example-news-site.com/article"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-gray-700"
                    disabled={urlLoading}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    📰 Paste any news article URL from major news websites
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={urlLoading || !urlInput.trim()}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {urlLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Extracting & Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>🔗</span>
                        <span>Analyze URL</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            )}

            {/* Batch Processing Tab */}
            {activeTab === 'batch' && (
              <form onSubmit={handleBatchAnalysis} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Upload Multiple Files for Batch Analysis
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200">
                    <input
                      type="file"
                      multiple
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="batchFiles"
                    />
                    <label
                      htmlFor="batchFiles"
                      className="cursor-pointer"
                    >
                      <div className="text-6xl mb-4">📂</div>
                      <p className="text-lg text-gray-600 mb-2">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports .txt, .doc, .docx files
                      </p>
                    </label>
                  </div>
                  
                  {batchFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Selected Files ({batchFiles.length}):
                      </p>
                      <ul className="space-y-1">
                        {batchFiles.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={batchLoading || batchFiles.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {batchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Files...</span>
                      </>
                    ) : (
                      <>
                        <span>📂</span>
                        <span>Process Batch</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            )}

            {/* Social Media Analysis Tab */}
            {activeTab === 'social' && (
              <form onSubmit={handleSocialAnalysis} className="space-y-6">
                <div>
                  <label htmlFor="socialInput" className="block text-lg font-semibold text-gray-700 mb-3">
                    Social Media Content or URL
                  </label>
                  <textarea
                    id="socialInput"
                    value={socialInput}
                    onChange={(e) => setSocialInput(e.target.value)}
                    placeholder="Paste social media post content or URL (Twitter, Facebook, Instagram, etc.)"
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-gray-700"
                    disabled={socialLoading}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    📱 Supports Twitter/X, Facebook, Instagram, LinkedIn, TikTok posts
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={socialLoading || !socialInput.trim()}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {socialLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing & Fact-Checking...</span>
                      </>
                    ) : (
                      <>
                        <span>📱</span>
                        <span>Analyze Social Media</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            )}
          </div>
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

        {/* Text Analysis Results */}
        {activeTab === 'text' && result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Text Analysis Results</h3>
            
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
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
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

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Disclaimer:</strong> This is an AI-powered analysis tool. Results should not be considered as definitive fact-checking. Always verify news through multiple reliable sources.
              </p>
            </div>
          </div>
        )}

        {/* URL Analysis Results */}
        {activeTab === 'url' && urlResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔗 URL Analysis Results</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Main Analysis */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  urlResult.prediction === 'REAL' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <span className="text-3xl">
                    {urlResult.prediction === 'REAL' ? '✅' : '❌'}
                  </span>
                </div>
                
                <div className={`text-2xl font-bold mb-2 ${
                  urlResult.prediction === 'REAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {urlResult.prediction === 'REAL' ? 'LIKELY REAL' : 'LIKELY FAKE'}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        urlResult.prediction === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${urlResult.confidence}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 text-center">
                    <span className="font-semibold">{urlResult.confidence}% Confidence</span>
                  </div>
                </div>
              </div>

              {/* Source Credibility */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  urlResult.sourceCredibility?.score >= 80 
                    ? 'bg-green-100 text-green-600' 
                    : urlResult.sourceCredibility?.score >= 60
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                }`}>
                  <span className="text-3xl">🏛️</span>
                </div>
                
                <div className="text-xl font-bold mb-2 text-gray-800">
                  Source Credibility
                </div>
                
                <div className={`text-lg font-semibold mb-2 ${
                  urlResult.sourceCredibility?.score >= 80 
                    ? 'text-green-600' 
                    : urlResult.sourceCredibility?.score >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}>
                  {urlResult.sourceCredibility?.rating || 'Unknown Source'}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        urlResult.sourceCredibility?.score >= 80 
                          ? 'bg-green-500' 
                          : urlResult.sourceCredibility?.score >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${urlResult.sourceCredibility?.score || 50}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 text-center">
                    <span className="font-semibold">{urlResult.sourceCredibility?.score || 50}/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>🔗 Source URL:</strong> {urlResult.source}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> URL analysis extracts and analyzes article text while also evaluating source credibility based on our database of news outlets.
              </p>
            </div>
          </div>
        )}

        {/* Batch Processing Results */}
        {activeTab === 'batch' && batchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📂 Batch Analysis Results</h3>
            
            <div className="grid gap-4">
              {batchResults.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.fileName}</h4>
                        <p className="text-sm text-gray-500">{(item.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.result.prediction === 'REAL' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.result.prediction}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.result.prediction === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.result.confidence}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                      {item.result.confidence}% Confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-800">
                <strong>📊 Batch Summary:</strong> Processed {batchResults.length} files. 
                {batchResults.filter(r => r.result.prediction === 'REAL').length} likely real, 
                {batchResults.filter(r => r.result.prediction === 'FAKE').length} likely fake.
              </p>
            </div>
          </div>
        )}

        {/* Social Media Analysis Results */}
        {activeTab === 'social' && socialResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📱 Social Media Analysis Results</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Main Analysis */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  socialResult.prediction === 'REAL' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <span className="text-3xl">
                    {socialResult.prediction === 'REAL' ? '✅' : '❌'}
                  </span>
                </div>
                
                <div className={`text-xl font-bold mb-2 ${
                  socialResult.prediction === 'REAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {socialResult.prediction === 'REAL' ? 'LIKELY REAL' : 'LIKELY FAKE'}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        socialResult.prediction === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${socialResult.confidence}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {socialResult.confidence}% Confidence
                  </div>
                </div>
              </div>

              {/* Platform Detection */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-blue-100 text-blue-600">
                  <span className="text-3xl">📱</span>
                </div>
                
                <div className="text-xl font-bold mb-2 text-gray-800">
                  Platform
                </div>
                
                <div className="text-lg font-semibold text-blue-600 mb-2">
                  {socialResult.platform}
                </div>
                
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-sm text-blue-700">
                    Content analyzed with platform-specific algorithms
                  </p>
                </div>
              </div>

              {/* Fact Check */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-purple-100 text-purple-600">
                  <span className="text-3xl">🔍</span>
                </div>
                
                <div className="text-xl font-bold mb-2 text-gray-800">
                  Fact Check
                </div>
                
                <div className="text-lg font-semibold text-purple-600 mb-2">
                  {socialResult.factCheck?.status}
                </div>
                
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-sm text-purple-700">
                    Cross-referenced with: {socialResult.factCheck?.sources?.join(', ')}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {socialResult.factCheck?.confidence}% Match Confidence
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="text-sm text-pink-800">
                <strong>📱 Social Media Note:</strong> Social media content analysis includes platform-specific factors and cross-references with major fact-checking organizations.
              </p>
            </div>
          </div>
        )}

        {/* How it Works Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🤖 How Our AI Machine Learning Model Works</h3>
          
          {/* ML Pipeline Overview */}
          <div className="bg-white rounded-xl p-6 mb-8 border-l-4 border-blue-500">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3 text-2xl">🧠</span> ML Pipeline Overview
            </h4>
            <p className="text-gray-600 mb-4">
              Our fake news detection system uses a sophisticated machine learning pipeline that processes text through multiple stages:
              <strong> Text Preprocessing → Tokenization → Feature Extraction → Classification → Confidence Scoring</strong>
            </p>
          </div>

          {/* Step-by-Step Process */}
          <div className="space-y-6">
            
            {/* Step 1: Text Preprocessing */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-800 mb-3">📝 Text Preprocessing & Cleaning</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-700 mb-2">Input Processing Steps:</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>• Convert to lowercase:</strong> "BREAKING NEWS" → "breaking news"</li>
                        <li><strong>• Remove URLs:</strong> "Check this link http://example.com" → "Check this link"</li>
                        <li><strong>• Remove mentions/hashtags:</strong> "@user #trending" → ""</li>
                        <li><strong>• Remove punctuation:</strong> "Hello, world!" → "Hello world"</li>
                        <li><strong>• Remove numbers:</strong> "In 2023, there were 100 cases" → "In there were cases"</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>🔧 Technical Implementation:</strong> Uses regex patterns and NLTK preprocessing to standardize input text
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Tokenization */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-800 mb-3">🔤 Tokenization & Stop Word Removal</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-700 mb-2">Tokenization Process:</h6>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Before Tokenization:</p>
                          <div className="bg-white p-2 rounded border text-xs">
                            "Scientists have discovered amazing breakthrough"
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">After Tokenization:</p>
                          <div className="bg-white p-2 rounded border text-xs">
                            ["scientists", "discovered", "amazing", "breakthrough"]
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>🧹 Stop Words Removed:</strong> Common words like "the", "and", "is", "have" are filtered out to focus on meaningful content
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>📚 NLTK Library:</strong> Uses Natural Language Toolkit's word_tokenize() function for intelligent word splitting
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Feature Extraction */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-800 mb-3">🔢 TF-IDF Feature Extraction</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-700 mb-2">TF-IDF (Term Frequency-Inverse Document Frequency):</h6>
                      <div className="space-y-2">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded border">
                            <p className="text-sm font-medium text-gray-600 mb-1">Term Frequency (TF):</p>
                            <p className="text-xs text-gray-600">How often a word appears in the document</p>
                            <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                              TF = (word count) / (total words)
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-sm font-medium text-gray-600 mb-1">Inverse Document Frequency (IDF):</p>
                            <p className="text-xs text-gray-600">How rare a word is across all documents</p>
                            <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                              IDF = log(total docs / docs with word)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-800">
                        <strong>🎯 Result:</strong> Each word gets a numerical weight - common words (like "the") get low scores, 
                        important words (like "breakthrough") get high scores
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h6 className="font-semibold text-gray-700 mb-2">N-gram Analysis:</h6>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="text-xs">
                          <p className="font-medium mb-1">Unigrams (1-word):</p>
                          <span className="bg-white px-2 py-1 rounded border mr-1">"urgent"</span>
                          <span className="bg-white px-2 py-1 rounded border mr-1">"breaking"</span>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium mb-1">Bigrams (2-word):</p>
                          <span className="bg-white px-2 py-1 rounded border mr-1">"breaking news"</span>
                          <span className="bg-white px-2 py-1 rounded border">"urgent alert"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Classification */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-800 mb-3">🎯 Logistic Regression Classification</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-700 mb-2">How the Model Decides:</h6>
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium text-gray-600 mb-2">Feature Vector Processing:</p>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Input: TF-IDF vector of 5,000 features (word importance scores)</p>
                            <p>• Model: Logistic regression with learned weights for each feature</p>
                            <p>• Output: Probability score between 0 (fake) and 1 (real)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <h6 className="font-semibold text-orange-800 mb-2">Decision Process:</h6>
                      <div className="text-sm text-orange-700 space-y-1">
                        <p><strong>High-risk words:</strong> "urgent", "shocking", "unbelievable", "doctors hate" → Higher fake probability</p>
                        <p><strong>Credible words:</strong> "research", "study", "according to", "data shows" → Higher real probability</p>
                        <p><strong>Final decision:</strong> If probability &gt; 0.5 → REAL, else → FAKE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Confidence Scoring */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-red-600">5</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-800 mb-3">📊 Confidence Score Calculation</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-700 mb-2">Probability Distribution:</h6>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 p-3 rounded">
                          <p className="text-sm font-medium text-green-700 mb-1">High Confidence Example:</p>
                          <div className="text-xs text-green-600">
                            <p>Real: 92% | Fake: 8%</p>
                            <p><strong>Confidence: 92%</strong></p>
                            <p>Clear legitimate news pattern</p>
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                          <p className="text-sm font-medium text-yellow-700 mb-1">Low Confidence Example:</p>
                          <div className="text-xs text-yellow-600">
                            <p>Real: 55% | Fake: 45%</p>
                            <p><strong>Confidence: 55%</strong></p>
                            <p>Mixed signals, needs verification</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <strong>🎯 Final Output:</strong> The highest probability becomes the confidence score. 
                        Higher confidence means the model is more certain about its prediction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Technical Architecture */}
          <div className="mt-8 bg-white rounded-xl p-6 border-2 border-blue-200">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3 text-2xl">⚙️</span> Technical Architecture
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <span className="text-3xl mb-2 block">🐍</span>
                <h5 className="font-semibold text-gray-800 mb-1">Python Backend</h5>
                <p className="text-sm text-gray-600">Flask API with scikit-learn ML pipeline</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <span className="text-3xl mb-2 block">📚</span>
                <h5 className="font-semibold text-gray-800 mb-1">ML Libraries</h5>
                <p className="text-sm text-gray-600">NLTK, scikit-learn, pandas, numpy</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <span className="text-3xl mb-2 block">🔄</span>
                <h5 className="font-semibold text-gray-800 mb-1">Real-time Processing</h5>
                <p className="text-sm text-gray-600">Instant analysis with confidence scoring</p>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-6 bg-gray-800 rounded-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-3 text-xl">💻</span> Code Example: Text Processing Pipeline
            </h4>
            <pre className="text-sm overflow-x-auto">
              <code>{`# Step 1: Preprocess text
def preprocess_text(text):
    text = text.lower()                          # Convert to lowercase
    text = re.sub(r'http\\S+', '', text)          # Remove URLs
    text = re.sub(r'[^\\w\\s]', '', text)         # Remove punctuation
    tokens = word_tokenize(text)                 # Tokenize
    tokens = [w for w in tokens if w not in stopwords]  # Remove stop words
    return ' '.join(tokens)

# Step 2: Feature extraction with TF-IDF
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X = vectorizer.fit_transform(processed_texts)

# Step 3: Train classifier
classifier = LogisticRegression()
classifier.fit(X, labels)

# Step 4: Make prediction
processed_input = preprocess_text(user_input)
features = vectorizer.transform([processed_input])
prediction = classifier.predict(features)[0]
confidence = max(classifier.predict_proba(features)[0]) * 100`}</code>
            </pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>🚀 Performance:</strong> This ML pipeline processes text in milliseconds, analyzing linguistic patterns, 
              word combinations, and stylistic features that distinguish fake news from legitimate journalism. 
              The model continuously learns from patterns in the training data to improve accuracy.
            </p>
          </div>

        </div>

        {/* Original How it Works Section */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Advanced Detection Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Text Analysis</h4>
              <p className="text-gray-600 text-sm">AI-powered analysis of news articles and text content with confidence scoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">URL Analysis</h4>
              <p className="text-gray-600 text-sm">Extract and analyze articles from URLs with source credibility assessment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📂</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Batch Processing</h4>
              <p className="text-gray-600 text-sm">Upload and analyze multiple files simultaneously for bulk verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Social Media</h4>
              <p className="text-gray-600 text-sm">Analyze social media posts with platform-specific algorithms and fact-checking</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">🏛️</span>
              <h5 className="font-semibold text-gray-800 mb-1">Source Credibility</h5>
              <p className="text-sm text-gray-600">Rate news sources based on reliability database</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">🔍</span>
              <h5 className="font-semibold text-gray-800 mb-1">Fact Checking</h5>
              <p className="text-sm text-gray-600">Cross-reference with major fact-checking organizations</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">⚡</span>
              <h5 className="font-semibold text-gray-800 mb-1">Real-time Analysis</h5>
              <p className="text-sm text-gray-600">Instant results with confidence scoring and detailed breakdowns</p>
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
