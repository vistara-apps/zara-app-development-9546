export const mockMarketData = [
  { symbol: 'AAPL', price: 175.43, change: 2.14, changePercent: 1.24, volume: 45230000 },
  { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, volume: 28450000 },
  { symbol: 'MSFT', price: 378.85, change: 5.67, changePercent: 1.52, volume: 31240000 },
  { symbol: 'TSLA', price: 248.42, change: -3.45, changePercent: -1.37, volume: 67890000 },
  { symbol: 'AMZN', price: 183.25, change: 1.89, changePercent: 1.04, volume: 42560000 }
];

export const fetchMarketData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would call Finnhub API
  return mockMarketData.map(stock => ({
    ...stock,
    price: stock.price + (Math.random() - 0.5) * 2,
    change: (Math.random() - 0.5) * 5,
    changePercent: (Math.random() - 0.5) * 3
  }));
};

export const fetchStockQuote = async (symbol) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const baseStock = mockMarketData.find(s => s.symbol === symbol) || mockMarketData[0];
  return {
    ...baseStock,
    price: baseStock.price + (Math.random() - 0.5) * 5,
    high: baseStock.price * 1.05,
    low: baseStock.price * 0.95,
    open: baseStock.price * 0.98,
    previousClose: baseStock.price * 0.97
  };
};