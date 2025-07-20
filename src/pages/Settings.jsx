import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Save,
  Crown,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePaymentContext } from '../hooks/usePaymentContext';

function Settings() {
  const { user, logout } = useAuth();
  const { createSession } = usePaymentContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [isPremium, setIsPremium] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    riskTolerance: user?.financialProfile?.riskTolerance || 'moderate',
    investmentGoals: user?.financialProfile?.investmentGoals || [],
    timeHorizon: user?.financialProfile?.timeHorizon || '5-years'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    marketAlerts: true,
    portfolioUpdates: true,
    newsAlerts: true,
    weeklyReports: false,
    emailNotifications: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', description: 'Lower risk, steady returns' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return' },
    { value: 'aggressive', label: 'Aggressive', description: 'Higher risk, higher potential returns' }
  ];

  const investmentGoalOptions = [
    'retirement',
    'growth',
    'income',
    'education',
    'home-purchase',
    'emergency-fund'
  ];

  const timeHorizonOptions = [
    { value: '1-year', label: '1 Year' },
    { value: '3-years', label: '3 Years' },
    { value: '5-years', label: '5 Years' },
    { value: '10-years', label: '10+ Years' }
  ];

  const handleSaveProfile = () => {
    // Simulate saving profile data
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  const handleUpgradeToPremium = async () => {
    try {
      await createSession('$9.99');
      setIsPremium(true);
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  const handleInvestmentGoalToggle = (goal) => {
    const updatedGoals = profileData.investmentGoals.includes(goal)
      ? profileData.investmentGoals.filter(g => g !== goal)
      : [...profileData.investmentGoals, goal];
    
    setProfileData({ ...profileData, investmentGoals: updatedGoals });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Profile</h3>
                  
                  {/* Risk Tolerance */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Risk Tolerance
                    </label>
                    <div className="space-y-3">
                      {riskToleranceOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="riskTolerance"
                            value={option.value}
                            checked={profileData.riskTolerance === option.value}
                            onChange={(e) => setProfileData({ ...profileData, riskTolerance: e.target.value })}
                            className="mr-3 text-primary-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Investment Goals */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Investment Goals (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {investmentGoalOptions.map((goal) => (
                        <label key={goal} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.investmentGoals.includes(goal)}
                            onChange={() => handleInvestmentGoalToggle(goal)}
                            className="mr-2 text-primary-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {goal.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Investment Time Horizon
                    </label>
                    <select
                      value={profileData.timeHorizon}
                      onChange={(e) => setProfileData({ ...profileData, timeHorizon: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {timeHorizonOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {key === 'marketAlerts' && 'Get notified about significant market movements'}
                            {key === 'portfolioUpdates' && 'Receive updates about your portfolio performance'}
                            {key === 'newsAlerts' && 'Stay informed with relevant financial news'}
                            {key === 'weeklyReports' && 'Weekly summary of your financial activity'}
                            {key === 'emailNotifications' && 'Enable email notifications'}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  disabled={saveStatus === 'saving'}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Plan</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Plan */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {isPremium ? 'Premium Plan' : 'Basic Plan'}
                        </h4>
                        {isPremium && <Crown className="w-5 h-5 text-yellow-500 ml-2" />}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        {isPremium ? '$9.99/month' : 'Free'}
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          Basic portfolio tracking
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          Market data access
                        </li>
                        {isPremium && (
                          <>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Advanced AI insights
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Personalized recommendations
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Priority support
                            </li>
                          </>
                        )}
                      </ul>
                      {isPremium ? (
                        <div className="text-sm text-gray-600">
                          Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                      ) : (
                        <button
                          onClick={handleUpgradeToPremium}
                          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Upgrade to Premium
                        </button>
                      )}
                    </div>

                    {/* Premium Features */}
                    {!isPremium && (
                      <div className="border-2 border-primary-200 rounded-lg p-6 bg-primary-50">
                        <div className="flex items-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Premium Features</h4>
                          <Crown className="w-5 h-5 text-yellow-500 ml-2" />
                        </div>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start">
                            <Crown className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">AI-Powered Insights</div>
                              <div className="text-sm text-gray-600">Advanced market analysis and predictions</div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Crown className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">Personalized Recommendations</div>
                              <div className="text-sm text-gray-600">Tailored investment advice based on your profile</div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Crown className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">Advanced Analytics</div>
                              <div className="text-sm text-gray-600">Detailed portfolio analysis and reporting</div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Password</h4>
                          <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Login Activity</h4>
                          <p className="text-sm text-gray-600">View recent login attempts</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          View Activity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;