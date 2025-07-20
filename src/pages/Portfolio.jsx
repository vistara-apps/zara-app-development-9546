import React, { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';

const Portfolio = () => {
  const { portfolios, addPortfolio, updatePortfolio, deletePortfolio } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    holdings: [{ symbol: '', shares: 0, currentPrice: 0 }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const portfolioData = {
      ...formData,
      holdings: formData.holdings.map(holding => ({
        ...holding,
        totalValue: holding.shares * holding.currentPrice
      }))
    };

    if (editingPortfolio) {
      updatePortfolio(editingPortfolio.id, portfolioData);
    } else {
      addPortfolio(portfolioData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      holdings: [{ symbol: '', shares: 0, currentPrice: 0 }]
    });
    setShowAddForm(false);
    setEditingPortfolio(null);
  };

  const addHolding = () => {
    setFormData({
      ...formData,
      holdings: [...formData.holdings, { symbol: '', shares: 0, currentPrice: 0 }]
    });
  };

  const updateHolding = (index, field, value) => {
    const updatedHoldings = formData.holdings.map((holding, i) => 
      i === index ? { ...holding, [field]: value } : holding
    );
    setFormData({ ...formData, holdings: updatedHoldings });
  };

  const removeHolding = (index) => {
    if (formData.holdings.length > 1) {
      const updatedHoldings = formData.holdings.filter((_, i) => i !== index);
      setFormData({ ...formData, holdings: updatedHoldings });
    }
  };

  const startEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      name: portfolio.name,
      holdings: portfolio.holdings.map(({ symbol, shares, currentPrice }) => ({
        symbol, shares, currentPrice
      }))
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your investment portfolios</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Portfolio
        </button>
      </div>

      {/* Add/Edit Portfolio Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter portfolio name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holdings
              </label>
              {formData.holdings.map((holding, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Symbol (e.g., AAPL)"
                    value={holding.symbol}
                    onChange={(e) => updateHolding(index, 'symbol', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Shares"
                    value={holding.shares}
                    onChange={(e) => updateHolding(index, 'shares', parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={holding.currentPrice}
                    onChange={(e) => updateHolding(index, 'currentPrice', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                    required
                  />
                  {formData.holdings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHolding(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addHolding}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Another Holding
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio List */}
      <div className="grid gap-6">
        {portfolios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolios Yet</h3>
            <p className="text-gray-600 mb-4">Create your first portfolio to start tracking your investments.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Create Portfolio
            </button>
          </div>
        ) : (
          portfolios.map((portfolio) => (
            <div key={portfolio.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{portfolio.name}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${portfolio.performance.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <div className={`flex items-center ml-4 ${portfolio.performance.dayChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {portfolio.performance.dayChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {portfolio.performance.dayChange >= 0 ? '+' : ''}{portfolio.performance.dayChange}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(portfolio)}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePortfolio(portfolio.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Holdings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500 uppercase border-b">
                    <tr>
                      <th className="py-2 text-left">Symbol</th>
                      <th className="py-2 text-right">Shares</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((holding, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 font-medium">{holding.symbol}</td>
                        <td className="py-2 text-right">{holding.shares}</td>
                        <td className="py-2 text-right">${holding.currentPrice}</td>
                        <td className="py-2 text-right font-medium">
                          ${holding.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Portfolio;