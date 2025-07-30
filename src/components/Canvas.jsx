import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasBlock from './CanvasBlock';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus } = FiIcons;

const Canvas = ({ 
  blocks, 
  selectedBlock, 
  onSelectBlock, 
  onUpdateBlock, 
  onDeleteBlock, 
  onMoveBlock,
  gptEnabled 
}) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        {/* Canvas Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Canvas</h1>
          <p className="text-gray-600">Drag blocks from the sidebar to build your landing page</p>
        </div>

        {/* Canvas Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
          {blocks.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiPlus} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your page</h3>
              <p className="text-gray-600 max-w-md">
                Select a block from the sidebar and add it to your canvas to get started.
              </p>
            </div>
          ) : (
            // Blocks List
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.instanceId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CanvasBlock
                      block={block}
                      index={index}
                      isSelected={selectedBlock?.instanceId === block.instanceId}
                      isFirst={index === 0}
                      isLast={index === blocks.length - 1}
                      onSelect={() => onSelectBlock(block)}
                      onUpdate={(updates) => onUpdateBlock(block.instanceId, updates)}
                      onDelete={() => onDeleteBlock(block.instanceId)}
                      onMove={(direction) => onMoveBlock(block.instanceId, direction)}
                      gptEnabled={gptEnabled}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;