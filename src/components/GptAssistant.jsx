import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { GptAgent } from '../utils/GptAgent';

const { FiZap, FiX, FiSend, FiLoader, FiCheck, FiRefreshCw } = FiIcons;

const GptAssistant = ({ isOpen, onClose, blockType, onApplyContent, initialContent = '' }) => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('headline');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Set appropriate content type based on block type
    if (blockType) {
      if (blockType === 'hero') {
        setContentType('headline');
      } else if (blockType === 'features' || blockType === 'content') {
        setContentType('paragraph');
      } else if (blockType === 'cta') {
        setContentType('cta');
      }
    }
    
    // If there's initial content, show it
    if (initialContent) {
      setGeneratedContent(initialContent);
    }
  }, [blockType, initialContent]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const content = await GptAgent.generateContent(
        prompt, 
        contentType, 
        { blockType }
      );
      
      setGeneratedContent(content);
      
      // Add to history
      setHistory(prev => [
        ...prev, 
        { prompt, content, contentType, timestamp: new Date() }
      ]);
      
      // Clear prompt
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!generatedContent) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const improved = await GptAgent.improveContent(
        generatedContent,
        'Make this more persuasive and professional'
      );
      
      setGeneratedContent(improved);
    } catch (err) {
      setError(err.message || 'Failed to improve content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onApplyContent(generatedContent);
      onClose();
    }
  };

  const contentTypeOptions = [
    { id: 'headline', name: 'Headline', description: 'Attention-grabbing title' },
    { id: 'paragraph', name: 'Paragraph', description: 'Descriptive text block' },
    { id: 'cta', name: 'Call to Action', description: 'Button or action text' }
  ];

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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <SafeIcon icon={FiZap} className="w-5 h-5 text-purple-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">GPT Content Assistant</h3>
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
              {/* Content Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {contentTypeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setContentType(option.id)}
                      className={`px-4 py-3 border text-sm font-medium rounded-lg text-left transition-colors ${
                        contentType === option.id
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Prompt</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    className="block w-full pr-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <SafeIcon icon={isLoading ? FiLoader : FiSend} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Generated Content */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Generated Content</label>
                  {generatedContent && (
                    <button
                      onClick={handleImprove}
                      disabled={isLoading || !generatedContent}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-3 h-3 mr-1" />
                      Improve
                    </button>
                  )}
                </div>
                <div className="border border-gray-300 rounded-md p-3 min-h-24 bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <SafeIcon icon={FiLoader} className="w-6 h-6 text-purple-500 animate-spin" />
                      <span className="ml-2 text-gray-600">Generating...</span>
                    </div>
                  ) : generatedContent ? (
                    <div className="text-gray-800">{generatedContent}</div>
                  ) : (
                    <div className="text-gray-400 italic">Content will appear here</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!generatedContent || isLoading}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    !generatedContent || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Apply Content
                </button>
              </div>
            </div>

            {/* History Panel (collapsible) */}
            {history.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <details>
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Previous Generations ({history.length})
                  </summary>
                  <div className="mt-3 space-y-3 max-h-40 overflow-y-auto">
                    {history.map((item, index) => (
                      <div key={index} className="text-sm border-l-2 border-purple-200 pl-3 py-1">
                        <div className="font-medium text-gray-900">{item.contentType}: "{item.prompt}"</div>
                        <div className="text-gray-600 mt-1">{item.content}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GptAssistant;