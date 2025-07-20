import React, { useState } from 'react';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    financialGoals: '',
    riskTolerance: 'moderate'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would call an API
    const userData = {
      id: Date.now(),
      name: formData.name || 'Demo User',
      email: formData.email || 'demo@finora.com',
      isPremium: false,
      financialProfile: {
        goals: formData.financialGoals || 'Long-term growth',
        riskTolerance: formData.riskTolerance
      }
    };

    localStorage.setItem('finora_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@finora.com',
      isPremium: false,
      financialProfile: {
        goals: 'Long-term growth and retirement planning',
        riskTolerance: 'moderate'
      }
    };
    localStorage.setItem('finora_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Finora</h2>
          <p className="text-gray-600 mt-2">Your Personal Financial Optimizer</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-md transition-colors ${
                isLogin 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-md transition-colors ${
                !isLogin 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="financialGoals" className="block text-sm font-medium text-gray-700 mb-1">
                    Financial Goals
                  </label>
                  <textarea
                    id="financialGoals"
                    name="financialGoals"
                    value={formData.financialGoals}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your financial goals..."
                  />
                </div>

                <div>
                  <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Tolerance
                  </label>
                  <select
                    id="riskTolerance"
                    name="riskTolerance"
                    value={formData.riskTolerance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Try Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;