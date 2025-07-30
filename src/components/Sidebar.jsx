import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiGrid, FiType, FiMail, FiStar, FiFootprints } = FiIcons;

const Sidebar = ({ blocks, onAddBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Blocks', icon: FiGrid },
    { id: 'hero', name: 'Hero', icon: FiStar },
    { id: 'content', name: 'Content', icon: FiType },
    { id: 'form', name: 'Forms', icon: FiMail },
    { id: 'footer', name: 'Footer', icon: FiFootprints }
  ];

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Block Library</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
          />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={category.icon} className="w-4 h-4 mr-3" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredBlocks.map((block) => (
            <motion.div
              key={block.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block-item"
            >
              <button
                onClick={() => onAddBlock(block)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                    {block.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {block.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{block.description}</p>
                
                {/* Preview */}
                <div className="bg-gray-50 rounded p-2 text-xs text-gray-500 border">
                  <div dangerouslySetInnerHTML={{ __html: block.previewHtml }} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No blocks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;