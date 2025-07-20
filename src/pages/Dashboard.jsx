import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchMarketData } from '../services/marketService';
import { generateMarketInsights, generatePersonalizedRecommendations } from '../services/openaiService';
import { fetchNews } from '../services/newsService';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { format } from 'date-fns';

function Dashboard() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState([]);
  const [insights, setInsights] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { createSession } = usePaymentContext();

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125430.50,
    todayChange: 2340.25,
    todayChangePercent: 1.9,
    allocation: [
      { name: 'Stocks', value: 65, amount: 81530 },
      { name: 'Bonds', value: 25, amount: 31358 },
      { name: 'Cash', value: 10, amount: 12543 }
    ]
  };

  // Mock performance data for chart
  const performanceData = [
    { date: '2024-01', value: 100000 },
    { date: '2024-02', value: 105000 },
    { date: '2024-03', value: 102000 },
    { date: '2024-04', value: 112000 },
    { date: '2024-05', value: 118000 },
    { date: '2024-06', value: 125430 }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load market data
        const market = await fetchMarketData();
        setMarketData(market.slice(0, 5));

        // Load latest news
        const news = await fetchNews();
        setLatestNews(news.slice(0, 3));

        // Generate insights for free users
        if (!showPaywall) {
          const marketInsights = await generateMarketInsights(market);
          setInsights(marketInsights);
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showPaywall]);

  const handleUpgradeToPremium = async () => {
    try {
      await createSession('$9.99');
      setIsPremium(true);
      setShowPaywall(false);
      
      // Load premium content
      const recs = await generatePersonalizedRecommendations(
        user.financialProfile, 
        portfolioData
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleViewPremiumContent = () => {
    if (!isPremium) {
      setShowPaywall(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your financial overview for {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${portfolioData.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Change</p>
                <p className="text-2xl font-bold text-green-600">
                  +${portfolioData.todayChange.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{portfolioData.todayChangePercent}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Asset Allocation</p>
                <div className="space-y-2">
                  {portfolioData.allocation.map((asset, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{asset.name}</span>
                      <span className="font-medium">{asset.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Market Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Market Insights</h3>
              <Activity className="w-5 h-5 text-primary-600" />
            </div>
            <div className="prose prose-sm max-w-none">
              {insights ? (
                <p className="text-gray-700 leading-relaxed">{insights}</p>
              ) : (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Data and Premium Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Market Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
            <div className="space-y-4">
              {marketData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{stock.symbol}</p>
                    <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </span>
                    </div>
                    <p className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Recommendations - Premium Feature */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
              {!isPremium && (
                <Crown className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            
            {isPremium && recommendations ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{recommendations}</p>
              </div>
            ) : showPaywall ? (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
                <p className="text-gray-600 mb-6">
                  Unlock personalized investment recommendations with our premium plan.
                </p>
                <button
                  onClick={handleUpgradeToPremium}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Upgrade to Premium - $9.99/month
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Diversify Your Portfolio</h4>
                  <p className="text-gray-600 text-sm">
                    Consider adding international exposure to reduce risk...
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Rebalance Opportunity</h4>
                  <p className="text-gray-600 text-sm">
                    Your stock allocation is above target...
                  </p>
                </div>
                <button
                  onClick={handleViewPremiumContent}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Unlock Detailed Recommendations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Latest News */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Latest Market News</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{format(article.timestamp, 'h:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;