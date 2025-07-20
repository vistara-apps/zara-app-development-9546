import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock portfolios
    const mockPortfolios = [
      {
        id: 1,
        name: 'Growth Portfolio',
        holdings: [
          { symbol: 'AAPL', shares: 10, currentPrice: 175.43, totalValue: 1754.30 },
          { symbol: 'GOOGL', shares: 5, currentPrice: 125.30, totalValue: 626.50 },
          { symbol: 'MSFT', shares: 8, currentPrice: 378.85, totalValue: 3030.80 },
        ],
        performance: { totalValue: 5411.60, dayChange: 2.3, dayChangeValue: 121.45 }
      },
      {
        id: 2,
        name: 'Conservative Portfolio',
        holdings: [
          { symbol: 'BRK.B', shares: 15, currentPrice: 350.20, totalValue: 5253.00 },
          { symbol: 'JNJ', shares: 20, currentPrice: 158.75, totalValue: 3175.00 },
        ],
        performance: { totalValue: 8428.00, dayChange: -0.8, dayChangeValue: -68.12 }
      }
    ];

    // Mock market data
    const mockMarketData = [
      { asset: 'AAPL', price: 175.43, volume: 52840000, volatility: 1.8, change: 2.1 },
      { asset: 'GOOGL', price: 125.30, volume: 28450000, volatility: 2.3, change: -0.5 },
      { asset: 'MSFT', price: 378.85, volume: 31250000, volatility: 1.5, change: 1.2 },
      { asset: 'TSLA', price: 208.50, volume: 95680000, volatility: 4.2, change: -3.8 },
      { asset: 'AMZN', price: 144.25, volume: 41230000, volatility: 2.8, change: 1.8 }
    ];

    // Mock news data
    const mockNews = [
      {
        id: 1,
        title: 'Federal Reserve Signals Potential Rate Cut in Q2',
        description: 'Fed officials hint at monetary policy adjustments amid economic uncertainty.',
        source: 'Financial Times',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        category: 'monetary-policy'
      },
      {
        id: 2,
        title: 'Tech Giants Report Strong Q4 Earnings',
        description: 'Apple, Microsoft, and Google exceed analyst expectations for quarterly revenue.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        category: 'earnings'
      },
      {
        id: 3,
        title: 'Cryptocurrency Market Sees Mixed Performance',
        description: 'Bitcoin stabilizes while altcoins show varied movements in morning trading.',
        source: 'CoinDesk',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        category: 'crypto'
      }
    ];

    setPortfolios(mockPortfolios);
    setMarketData(mockMarketData);
    setNews(mockNews);
  };

  const addPortfolio = (portfolio) => {
    const newPortfolio = {
      ...portfolio,
      id: Date.now(),
      performance: { totalValue: 0, dayChange: 0, dayChangeValue: 0 }
    };
    setPortfolios(prev => [...prev, newPortfolio]);
  };

  const updatePortfolio = (portfolioId, updatedPortfolio) => {
    setPortfolios(prev => 
      prev.map(p => p.id === portfolioId ? { ...p, ...updatedPortfolio } : p)
    );
  };

  const deletePortfolio = (portfolioId) => {
    setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
  };

  const value = {
    portfolios,
    marketData,
    news,
    loading,
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    setLoading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};