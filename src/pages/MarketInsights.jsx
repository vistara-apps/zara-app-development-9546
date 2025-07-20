import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Star, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { generateMarketInsight, generatePersonalizedRecommendations } from '../services/aiService';
import PremiumModal from '../components/PremiumModal';

const MarketInsights = () => {
  const { marketData, portfolios } = useData();
  const { user } = useAuth();
  const [aiInsight, setAiInsight] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(user?.isPremium || false);

  useEffect(() => {
    if (isPremiumUser) {
      loadAiContent();
    }
  }, [isPremiumUser, marketData, portfolios]);

  const loadAiContent = async () => {
    if (marketData.length === 0 || portfolios.length === 0) return;
    
    setLoading(true);
    try {
      const [insight, recs] = await Promise.all([
        generateMarketInsight(marketData, portfolios),
        generatePersonalizedRecommendations(user?.financialProfile, marketData)
      ]);
      setAiInsight(insight);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumSuccess = () => {
    setIsPremiumUser(true);
    loadAiContent();
  };

  const refreshInsights = () => {
    if (isPremiumUser) {
      loadAiContent();
    }
  };

  // Data for volatility chart
  const volatilityData = marketData.map(asset => ({
    name: asset.asset,
    volatility: asset.volatility,
    volume: asset.volume / 1000000 // Convert to millions
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
          <p className="text-gray-600">AI-powered analysis and market data</p>
        </div>
        <div className="flex gap-2">
          {isPremiumUser && (
            <button
              onClick={refreshInsights}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
          {!isPremiumUser && (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-md font-medium flex items-center hover:from-yellow-500 hover:to-yellow-700 transition-all"
            >
              <Star className="h-5 w-5 mr-2" />
              Upgrade for AI Insights
            </button>
          )}
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Market Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {marketData.map((asset) => (
            <div key={asset.asset} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{asset.asset}</h4>
                <div className={`flex items-center ${asset.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {asset.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">${asset.price}</p>
              <p className={`text-sm ${asset.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {asset.change >= 0 ? '+' : ''}{asset.change}%
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Vol: {(asset.volume / 1000000).toFixed(1)}M</p>
                <p>Volatility: {asset.volatility}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volatility Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Volatility Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volatilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'volatility' ? `${value}%` : `${value}M`,
                name === 'volatility' ? 'Volatility' : 'Volume'
              ]}
            />
            <Bar dataKey="volatility" fill="#ef4444" name="volatility" />
            <Bar dataKey="volume" fill="#0ea5e9" name="volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              AI Market Analysis
            </h3>
          </div>

          {isPremiumUser ? (
            <div className="prose prose-sm max-w-none">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Analyzing market data...</span>
                </div>
              ) : aiInsight ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
              ) : (
                <p className="text-gray-500">No analysis available. Try refreshing or check your data.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
              <p className="text-gray-600 mb-4">
                Get AI-powered market analysis with insights tailored to current conditions.
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Unlock AI Analysis
              </button>
            </div>
          )}
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Personalized Recommendations
            </h3>
          </div>

          {isPremiumUser ? (
            <div className="prose prose-sm max-w-none">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Generating recommendations...</span>
                </div>
              ) : recommendations ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{recommendations}</p>
              ) : (
                <p className="text-gray-500">No recommendations available. Try refreshing or check your profile.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
              <p className="text-gray-600 mb-4">
                Receive personalized investment recommendations based on your profile and market conditions.
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Get Recommendations
              </button>
            </div>
          )}
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={handlePremiumSuccess}
      />
    </div>
  );
};

export default MarketInsights;