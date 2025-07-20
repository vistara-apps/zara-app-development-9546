import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Clock, 
  Filter, 
  Search, 
  ExternalLink,
  TrendingUp,
  Globe
} from 'lucide-react';
import { fetchNews, fetchPersonalizedNews } from '../services/newsService';
import { format } from 'date-fns';

function News() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All News', icon: Globe },
    { id: 'technology', name: 'Technology', icon: TrendingUp },
    { id: 'monetary-policy', name: 'Monetary Policy', icon: Newspaper },
    { id: 'energy', name: 'Energy', icon: TrendingUp },
    { id: 'healthcare', name: 'Healthcare', icon: TrendingUp },
    { id: 'cryptocurrency', name: 'Crypto', icon: TrendingUp }
  ];

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await fetchNews(selectedCategory);
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    if (!searchTerm) {
      setFilteredNews(news);
      return;
    }

    const filtered = news.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'technology': 'bg-blue-100 text-blue-800',
      'monetary-policy': 'bg-green-100 text-green-800',
      'energy': 'bg-yellow-100 text-yellow-800',
      'healthcare': 'bg-purple-100 text-purple-800',
      'cryptocurrency': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial News</h1>
          <p className="text-gray-600">Stay informed with the latest market news and updates</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "Try adjusting your search terms or filters" 
                  : "No news available in this category at the moment"
                }
              </p>
            </div>
          ) : (
            filteredNews.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(article.timestamp, 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-primary-600 text-xs font-bold">
                              {article.source.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {article.source}
                          </span>
                        </div>
                        
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center transition-colors">
                          Read More
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Load More News
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;