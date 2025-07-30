import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { GptAgent } from '../utils/GptAgent';
import supabase from '../lib/supabase';

const { FiKey, FiX, FiCheck, FiAlertCircle, FiInfo, FiExternalLink } = FiIcons;

const GptSetup = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if GPT is already initialized
    setIsInitialized(GptAgent.isReady());
  }, [isOpen]);

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize without API key - now handled by Edge Functions
      await GptAgent.initialize();
      
      setSuccess(true);
      setIsInitialized(true);
      
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to initialize GPT integration');
    } finally {
      setIsLoading(false);
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
                      Connect to our secure OpenAI integration to unlock powerful AI-powered content generation for your landing pages.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">Secure Server-Side Integration</h4>
                          <p className="text-sm text-blue-700">
                            Our system uses secure server-side processing to protect your data. No API keys are stored in your browser.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Enhanced Security</h4>
                        <p className="text-sm text-yellow-700">
                          Our secure implementation uses Supabase Edge Functions to handle all API requests server-side, ensuring your data remains protected.
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
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
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
                          Enable GPT
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