export const mockNewsData = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Changes",
    description: "The Federal Reserve hints at upcoming monetary policy adjustments that could impact market dynamics significantly.",
    source: "Financial Times",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "monetary-policy"
  },
  {
    id: 2,
    title: "Tech Stocks Surge on AI Breakthrough",
    description: "Major technology companies see significant gains following announcements of breakthrough AI developments.",
    source: "TechCrunch",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: "technology"
  },
  {
    id: 3,
    title: "Energy Sector Outlook Remains Positive",
    description: "Analysts maintain optimistic projections for energy investments amid growing renewable adoption.",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: "energy"
  },
  {
    id: 4,
    title: "Crypto Market Shows Resilience",
    description: "Cryptocurrency markets demonstrate stability despite recent regulatory developments and market volatility.",
    source: "CoinDesk",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    category: "cryptocurrency"
  },
  {
    id: 5,
    title: "Healthcare Investments Gain Momentum",
    description: "Healthcare sector attracting increased investor interest due to aging demographics and innovation.",
    source: "Healthcare Finance",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    category: "healthcare"
  }
];

export const fetchNews = async (category = 'all') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (category === 'all') {
    return mockNewsData;
  }
  
  return mockNewsData.filter(news => news.category === category);
};

export const fetchPersonalizedNews = async (userInterests) => {
  // Simulate API call with personalization
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockNewsData.filter(news => 
    userInterests.some(interest => 
      news.category.toLowerCase().includes(interest.toLowerCase()) ||
      news.title.toLowerCase().includes(interest.toLowerCase())
    )
  );
};