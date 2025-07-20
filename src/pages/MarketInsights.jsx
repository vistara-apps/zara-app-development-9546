import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchMarketData, fetchStockQuote } from '../services/marketService';
import { generateMarketInsights } from '../services/openaiService';

function MarketInsights() {
  const [marketData, setMarketData] = useState([]);
  const [insights, setInsights] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock detailed chart data for selected stock
  const generateChartData = (basePrice) => {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.5) * price * 0.02; // 2% max change
      data.push({
        date: `Day ${i + 1}`,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 5000000
      });
    }
    
    return data;
  };

  const [chartData, setChartData] = useState([]);

  const marketSectors = [
    { name: 'Technology', change: 2.3, color: 'text-green-600' },
    { name: 'Healthcare', change: 1.8, color: 'text-green-600' },
    { name: 'Finance', change: -0.5, color: 'text-red-600' },
    { name: 'Energy', change: 3.2, color: 'text-green-600' },
    { name: 'Consumer', change: -1.1, color: 'text-red-600' },
    { name: 'Real Estate', change: 0.8, color: 'text-green-600' }
  ];

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketData();
      setMarketData(data);
      
      const marketInsights = await generateMarketInsights(data);
      setInsights(marketInsights);
      
      if (data.length > 0) {
        setSelectedStock(data[0]);
        setChartData(generateChartData(data[0].price));
      }
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMarketData();
    setRefreshing(false);
  };

  const handleStockSelect = async (stock) => {
    try {
      const detailedQuote = await fetchStockQuote(stock.symbol);
      setSelectedStock(detailedQuote);
      setChartData(generateChartData(detailedQuote.price));
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  const filteredMarketData = marketData.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
              <p className="text-gray-600 mt-1">Real-time market data and AI-powered analysis</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI Market Analysis</h2>
          </div>
          <div className="prose prose-gray max-w-none">
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

        {/* Market Overview and Sectors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Market Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
            <div className="space-y-3">
              {filteredMarketData.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedStock?.symbol === stock.symbol ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-gray-600">
                          {stock.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                        <p className="text-sm text-gray-600">
                          Vol: {(stock.volume / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className={`flex items-center text-sm ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                        ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Performance</h3>
            <div className="space-y-3">
              {marketSectors.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{sector.name}</span>
                  <div className={`flex items-center ${sector.color}`}>
                    {sector.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-semibold">
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Stock Details */}
        {selectedStock && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h3>
                  <p className="text-gray-600">Stock Details</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    ${selectedStock.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center justify-end mt-1 ${
                    selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedStock.change >= 0 ? (
                      <TrendingUp className="w-5 h-5 mr-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-1" />
                    )}
                    <span className="font-semibold">
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} 
                      ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Stats */}
              {selectedStock.high && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">High</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedStock.high.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Low</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedStock.low.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Open</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedStock.open.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Prev. Close</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedStock.previousClose.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketInsights;