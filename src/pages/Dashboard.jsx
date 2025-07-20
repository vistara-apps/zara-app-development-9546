import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Star, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { generateMarketInsight } from '../services/aiService';
import PremiumModal from '../components/PremiumModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { portfolios, marketData } = useData();
  const [aiInsight, setAiInsight] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(user?.isPremium || false);

  // Calculate total portfolio value
  const totalValue = portfolios.reduce((sum, portfolio) => sum + portfolio.performance.totalValue, 0);
  const totalChange = portfolios.reduce((sum, portfolio) => sum + portfolio.performance.dayChangeValue, 0);
  const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  // Mock performance data for charts
  const performanceData = [
    { name: 'Mon', value: totalValue - 400 },
    { name: 'Tue', value: totalValue - 200 },
    { name: 'Wed', value: totalValue - 100 },
    { name: 'Thu', value: totalValue + 150 },
    { name: 'Fri', value: totalValue },
  ];

  // Portfolio allocation data
  const allocationData = portfolios.map(portfolio => ({
    name: portfolio.name,
    value: portfolio.performance.totalValue,
    color: portfolio.id === 1 ? '#0ea5e9' : '#10b981'
  }));

  useEffect(() => {
    if (isPremiumUser && portfolios.length > 0) {
      loadAiInsight();
    }
  }, [isPremiumUser, portfolios]);

  const loadAiInsight = async () => {
    try {
      const insight = await generateMarketInsight(marketData, portfolios);
      setAiInsight(insight);
    } catch (error) {
      console.error('Error loading AI insight:', error);
    }
  };

  const handlePremiumSuccess = () => {
    setIsPremiumUser(true);
    loadAiInsight();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        {!isPremiumUser && (
          <button
            onClick={() => setShowPremiumModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-md font-medium flex items-center hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            <Star className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Change</p>
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  ${Math.abs(totalChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                {totalChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-600 ml-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-danger-600 ml-2" />
                )}
              </div>
              <p className={`text-sm ${totalChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {totalChange >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Portfolios</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
          {allocationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-gray-500">
              <p>No portfolio data available</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            AI-Powered Market Insights
          </h3>
          {!isPremiumUser && (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Upgrade for Full Access
            </button>
          )}
        </div>

        {isPremiumUser ? (
          <div className="prose prose-sm max-w-none">
            {aiInsight ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Generating insights...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
            <p className="text-gray-600 mb-4">
              Get AI-powered market insights and personalized recommendations tailored to your portfolio.
            </p>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Unlock Premium Features
            </button>
          </div>
        )}
      </div>

      {/* Recent Market Data */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Change</th>
                <th className="py-3 px-4">Volume</th>
              </tr>
            </thead>
            <tbody>
              {marketData.slice(0, 5).map((asset) => (
                <tr key={asset.asset} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{asset.asset}</td>
                  <td className="py-3 px-4">${asset.price}</td>
                  <td className={`py-3 px-4 ${asset.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </td>
                  <td className="py-3 px-4">{(asset.volume / 1000000).toFixed(1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Dashboard;