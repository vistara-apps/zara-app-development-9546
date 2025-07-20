import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, TrendingUp, Zap, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { analyzeNewsImpact } from '../services/aiService';
import PremiumModal from '../components/PremiumModal';

const News = () => {
  const { news, portfolios } = useData();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsAnalysis, setNewsAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(user?.isPremium || false);

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'earnings', name: 'Earnings' },
    { id: 'monetary-policy', name: 'Monetary Policy' },
    { id: 'crypto', name: 'Cryptocurrency' },
    { id: 'market-update', name: 'Market Updates' }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  useEffect(() => {
    if (isPremiumUser && news.length > 0 && portfolios.length > 0) {
      analyzeNews();
    }
  }, [isPremiumUser, news, portfolios]);

  const analyzeNews = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeNewsImpact(news.slice(0, 3), portfolios);
      setNewsAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumSuccess = () => {
    setIsPremiumUser(true);
    analyzeNews();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'earnings': 'bg-blue-100 text-blue-800',
      'monetary-policy': 'bg-purple-100 text-purple-800',
      'crypto': 'bg-orange-100 text-orange-800',
      'market-update': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatCategory = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial News</h1>
          <p className="text-gray-600">Stay updated with the latest market news</p>
        </div>
        {!isPremiumUser && (
          <button
            onClick={() => setShowPremiumModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-md font-medium flex items-center hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            <Star className="h-5 w-5 mr-2" />
            Get AI News Analysis
          </button>
        )}
      </div>

      {/* AI News Impact Analysis */}
      {isPremiumUser && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI News Impact Analysis
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Analyzing news impact...</span>
            </div>
          ) : newsAnalysis ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{newsAnalysis}</p>
            </div>
          ) : (
            <p className="text-gray-500">No analysis available. Make sure you have portfolios set up.</p>
          )}
        </div>
      )}

      {!isPremiumUser && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
            <p className="text-gray-600 mb-4">
              Get AI-powered analysis of how current news might impact your portfolio holdings.
            </p>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Unlock News Analysis
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' 
                ? 'No news items found.' 
                : `No news found for ${categories.find(c => c.id === selectedCategory)?.name}.`}
            </p>
          </div>
        ) : (
          filteredNews.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {formatCategory(item.category)}
                  </span>
                  <span className="text-sm text-gray-500">{item.source}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="flex justify-between items-center">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  Read Full Article
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
                
                {isPremiumUser && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    Impact analyzed
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={handlePremiumSuccess}
      />
    </div>
  );
};

export default News;