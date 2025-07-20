import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import MarketInsights from './pages/MarketInsights';
import News from './pages/News';
import Auth from './pages/Auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('finora_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {user ? (
              <>
                <Header user={user} setUser={setUser} />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/market-insights" element={<MarketInsights />} />
                    <Route path="/news" element={<News />} />
                  </Routes>
                </main>
              </>
            ) : (
              <Auth setUser={setUser} />
            )}
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;