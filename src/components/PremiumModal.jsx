import React, { useState } from 'react';
import { Star, Check, X, CreditCard } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PremiumModal = ({ isOpen, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await createSession();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Upgrade to Premium
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900">$9.99</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm">Advanced AI-powered market analysis</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm">Personalized investment recommendations</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm">Real-time portfolio alerts</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm">Unlimited news analysis</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm">Advanced portfolio management tools</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Upgrade Now
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;