import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { GptAgent } from '../utils/GptAgent';

const { FiKey, FiX, FiCheck, FiAlertCircle, FiEye, FiEyeOff, FiExternalLink } = FiIcons;

const GptSetup = ({ isOpen, onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if GPT is already initialized
    setIsInitialized(GptAgent.isReady());
  }, [isOpen]);

  const handleSetup = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('OpenAI API keys should start with "sk-"');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await GptAgent.initialize(apiKey);
      
      setSuccess(true);
      setIsInitialized(true);
      
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
        setSuccess(false);
        setApiKey('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to initialize OpenAI API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSetup();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <SafeIcon icon={FiKey} className="w-5 h-5 text-purple-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  {isInitialized ? 'OpenAI GPT Ready' : 'Setup OpenAI GPT'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isInitialized ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    GPT Integration Active
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Your OpenAI API is connected and ready to generate amazing content for your landing pages.
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Continue Building
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Connect your OpenAI API key to unlock powerful AI-powered content generation for your landing pages.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">How to get your API key:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center">platform.openai.com/api-keys <SafeIcon icon={FiExternalLink} className="w-3 h-3 ml-1" /></a></li>
                        <li>2. Click "Create new secret key"</li>
                        <li>3. Copy the key and paste it below</li>
                      </ol>
                    </div>
                  </div>

                  {/* API Key Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OpenAI API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showKey ? FiEyeOff : FiEye} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Security Notice</h4>
                        <p className="text-sm text-yellow-700">
                          Your API key is stored securely in your browser and encrypted in our database. We never share your key with third parties.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 mr-2" />
                        <p className="text-sm text-green-600">GPT integration initialized successfully!</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSetup}
                      disabled={isLoading || !apiKey.trim()}
                      className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center ${
                        isLoading || !apiKey.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      } transition-colors`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Setting up...
                        </>
                      ) : (
                        <>
                          <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                          Connect GPT
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GptSetup;