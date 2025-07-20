import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (simulate checking localStorage)
    const savedUser = localStorage.getItem('finora_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate login
    const userData = {
      id: 1,
      name: 'John Doe',
      email: email,
      financialProfile: {
        riskTolerance: 'moderate',
        investmentGoals: ['growth', 'income'],
        timeHorizon: '10-years'
      }
    };
    setUser(userData);
    localStorage.setItem('finora_user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const register = (name, email, password) => {
    // Simulate registration
    const userData = {
      id: Date.now(),
      name: name,
      email: email,
      financialProfile: {
        riskTolerance: 'moderate',
        investmentGoals: [],
        timeHorizon: '5-years'
      }
    };
    setUser(userData);
    localStorage.setItem('finora_user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finora_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}