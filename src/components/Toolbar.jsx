import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { ExportManager } from '../utils/ExportManager';

const { FiDownload, FiZap, FiEye, FiSmartphone, FiTablet, FiMonitor } = FiIcons;

const Toolbar = ({ canvasBlocks, gptEnabled, onToggleGpt }) => {
  const [viewMode, setViewMode] = React.useState('desktop');

  const handleExport = async () => {
    try {
      await ExportManager.exportPage(canvasBlocks);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const viewModes = [
    { id: 'desktop', icon: FiMonitor, label: 'Desktop' },
    { id: 'tablet', icon: FiTablet, label: 'Tablet' },
    { id: 'mobile', icon: FiSmartphone, label: 'Mobile' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - View modes */}
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-700 mr-3">Preview:</span>
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                viewMode === mode.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={mode.icon} className="w-4 h-4 mr-2" />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* GPT Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleGpt}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              gptEnabled
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" />
            GPT Assist
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Download Page
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;