import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    shares: '',
    avgCost: ''
  });

  // Mock portfolio data
  const mockPortfolios = [
    {
      id: 1,
      name: 'Main Portfolio',
      totalValue: 125430.50,
      todayChange: 2340.25,
      todayChangePercent: 1.9,
      holdings: [
        { symbol: 'AAPL', shares: 100, avgCost: 150.00, currentPrice: 175.43, value: 17543 },
        { symbol: 'GOOGL', shares: 50, avgCost: 140.00, currentPrice: 142.56, value: 7128 },
        { symbol: 'MSFT', shares: 75, avgCost: 350.00, currentPrice: 378.85, value: 28414 },
        { symbol: 'TSLA', shares: 30, avgCost: 250.00, currentPrice: 248.42, value: 7453 },
        { symbol: 'AMZN', shares: 200, avgCost: 180.00, currentPrice: 183.25, value: 36650 }
      ]
    },
    {
      id: 2,
      name: 'Retirement Fund',
      totalValue: 85200.00,
      todayChange: -567.30,
      todayChangePercent: -0.66,
      holdings: [
        { symbol: 'VTI', shares: 500, avgCost: 160.00, currentPrice: 170.40, value: 85200 }
      ]
    }
  ];

  const assetAllocation = [
    { name: 'Technology', value: 45, color: '#0ea5e9' },
    { name: 'Healthcare', value: 20, color: '#10b981' },
    { name: 'Finance', value: 15, color: '#f59e0b' },
    { name: 'Consumer', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' }
  ];

  const performanceData = [
    { month: 'Jan', value: 100000 },
    { month: 'Feb', value: 105000 },
    { month: 'Mar', value: 102000 },
    { month: 'Apr', value: 112000 },
    { month: 'May', value: 118000 },
    { month: 'Jun', value: 125430 }
  ];

  useEffect(() => {
    setPortfolios(mockPortfolios);
    setSelectedPortfolio(mockPortfolios[0]);
  }, []);

  const handleAddHolding = () => {
    if (newHolding.symbol && newHolding.shares && newHolding.avgCost) {
      const currentPrice = 100 + Math.random() * 400; // Mock current price
      const shares = parseInt(newHolding.shares);
      const avgCost = parseFloat(newHolding.avgCost);
      
      const holding = {
        symbol: newHolding.symbol.toUpperCase(),
        shares: shares,
        avgCost: avgCost,
        currentPrice: currentPrice,
        value: shares * currentPrice
      };

      const updatedPortfolio = {
        ...selectedPortfolio,
        holdings: [...selectedPortfolio.holdings, holding]
      };

      const updatedPortfolios = portfolios.map(p => 
        p.id === selectedPortfolio.id ? updatedPortfolio : p
      );

      setPortfolios(updatedPortfolios);
      setSelectedPortfolio(updatedPortfolio);
      setNewHolding({ symbol: '', shares: '', avgCost: '' });
      setShowAddHolding(false);
    }
  };

  const handleRemoveHolding = (symbol) => {
    const updatedHoldings = selectedPortfolio.holdings.filter(h => h.symbol !== symbol);
    const updatedPortfolio = {
      ...selectedPortfolio,
      holdings: updatedHoldings
    };

    const updatedPortfolios = portfolios.map(p => 
      p.id === selectedPortfolio.id ? updatedPortfolio : p
    );

    setPortfolios(updatedPortfolios);
    setSelectedPortfolio(updatedPortfolio);
  };

  const calculateGainLoss = (holding) => {
    const gainLoss = (holding.currentPrice - holding.avgCost) * holding.shares;
    const gainLossPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;
    return { gainLoss, gainLossPercent };
  };

  if (!selectedPortfolio) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
              <p className="text-gray-600 mt-1">Track and manage your investment portfolios</p>
            </div>
            <button
              onClick={() => setShowAddHolding(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Holding
            </button>
          </div>
        </div>

        {/* Portfolio Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {portfolios.map((portfolio) => (
              <button
                key={portfolio.id}
                onClick={() => setSelectedPortfolio(portfolio)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPortfolio?.id === portfolio.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {portfolio.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${selectedPortfolio.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Change</p>
                <p className={`text-2xl font-bold ${selectedPortfolio.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedPortfolio.todayChange >= 0 ? '+' : ''}${Math.abs(selectedPortfolio.todayChange).toLocaleString()}
                </p>
              </div>
              {selectedPortfolio.todayChange >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Holdings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedPortfolio.holdings.length}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Percentage Change</p>
                <p className={`text-2xl font-bold ${selectedPortfolio.todayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedPortfolio.todayChangePercent >= 0 ? '+' : ''}{selectedPortfolio.todayChangePercent.toFixed(2)}%
                </p>
              </div>
              {selectedPortfolio.todayChangePercent >= 0 ? (
                <ArrowUpRight className="w-8 h-8 text-green-600" />
              ) : (
                <ArrowDownRight className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Allocation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {assetAllocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gain/Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedPortfolio.holdings.map((holding) => {
                  const { gainLoss, gainLossPercent } = calculateGainLoss(holding);
                  return (
                    <tr key={holding.symbol}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{holding.shares}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${holding.avgCost.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${holding.currentPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${holding.value.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                        </div>
                        <div className={`text-xs ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveHolding(holding.symbol)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Holding Modal */}
        {showAddHolding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Holding</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="AAPL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shares
                  </label>
                  <input
                    type="number"
                    value={newHolding.shares}
                    onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newHolding.avgCost}
                    onChange={(e) => setNewHolding({ ...newHolding, avgCost: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="150.00"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddHolding}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Add Holding
                </button>
                <button
                  onClick={() => setShowAddHolding(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;