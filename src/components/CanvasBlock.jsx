import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEdit3, FiTrash2, FiChevronUp, FiChevronDown, FiZap, FiCode } = FiIcons;

const CanvasBlock = ({ 
  block, 
  index, 
  isSelected, 
  isFirst, 
  isLast, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onMove,
  gptEnabled 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(block.content || {});

  const handleContentUpdate = (field, value) => {
    const newContent = { ...editableContent, [field]: value };
    setEditableContent(newContent);
    onUpdate({ content: newContent });
  };

  const handleGptAssist = (field) => {
    // GPT integration placeholder
    console.log('GPT assist for field:', field);
    // This will be implemented in gpt-agent.js
  };

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
      }`}
      onClick={onSelect}
    >
      {/* Block Toolbar */}
      <div className={`absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${
        isSelected ? 'opacity-100' : ''
      }`}>
        {gptEnabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGptAssist('content');
            }}
            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            title="GPT Assist"
          >
            <SafeIcon icon={FiZap} className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          title="Edit Block"
        >
          <SafeIcon icon={isEditing ? FiCode : FiEdit3} className="w-4 h-4" />
        </button>

        {!isFirst && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove('up');
            }}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Move Up"
          >
            <SafeIcon icon={FiChevronUp} className="w-4 h-4" />
          </button>
        )}

        {!isLast && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove('down');
            }}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Move Down"
          >
            <SafeIcon icon={FiChevronDown} className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          title="Delete Block"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
        </button>
      </div>

      {/* Block Content */}
      <div className="p-6">
        {isEditing ? (
          <BlockEditor 
            block={block}
            content={editableContent}
            onUpdate={handleContentUpdate}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none"
        />
      )}
    </div>
  );
};

// Simple block editor component
const BlockEditor = ({ block, content, onUpdate }) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900">Edit {block.name}</h4>
      
      {block.editableFields?.map((field) => (
        <div key={field.selector} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === 'text' ? (
            <input
              type="text"
              value={content[field.selector] || ''}
              onChange={(e) => onUpdate(field.selector, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ) : field.type === 'textarea' ? (
            <textarea
              value={content[field.selector] || ''}
              onChange={(e) => onUpdate(field.selector, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ) : (
            <input
              type="text"
              value={content[field.selector] || ''}
              onChange={(e) => onUpdate(field.selector, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CanvasBlock;