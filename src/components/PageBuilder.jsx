import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import { StateManager } from '../utils/StateManager';
import { BlockLoader } from '../utils/BlockLoader';
import * as FiIcons from 'react-icons/fi';

const { FiLayout, FiDownload, FiZap } = FiIcons;

const PageBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [gptEnabled, setGptEnabled] = useState(false);

  useEffect(() => {
    // Initialize blocks and load saved state
    const initializeApp = async () => {
      const defaultBlocks = BlockLoader.getDefaultBlocks();
      setBlocks(defaultBlocks);
      
      // Load saved canvas state
      const savedState = StateManager.loadState();
      if (savedState?.canvasBlocks) {
        setCanvasBlocks(savedState.canvasBlocks);
      }
    };

    initializeApp();
  }, []);

  // Auto-save canvas state
  useEffect(() => {
    StateManager.saveState({ canvasBlocks });
  }, [canvasBlocks]);

  const handleAddBlock = (blockTemplate) => {
    const newBlock = {
      ...blockTemplate,
      id: `block-${Date.now()}`,
      instanceId: `instance-${Date.now()}`
    };
    setCanvasBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlock = (blockId, updates) => {
    setCanvasBlocks(prev => 
      prev.map(block => 
        block.instanceId === blockId 
          ? { ...block, ...updates }
          : block
      )
    );
  };

  const handleDeleteBlock = (blockId) => {
    setCanvasBlocks(prev => prev.filter(block => block.instanceId !== blockId));
    if (selectedBlock?.instanceId === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleMoveBlock = (blockId, direction) => {
    setCanvasBlocks(prev => {
      const currentIndex = prev.findIndex(block => block.instanceId === blockId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newBlocks = [...prev];
      [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
      return newBlocks;
    });
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        blocks={blocks}
        onAddBlock={handleAddBlock}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar 
          canvasBlocks={canvasBlocks}
          gptEnabled={gptEnabled}
          onToggleGpt={() => setGptEnabled(!gptEnabled)}
        />

        {/* Canvas */}
        <Canvas
          blocks={canvasBlocks}
          selectedBlock={selectedBlock}
          onSelectBlock={setSelectedBlock}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
          gptEnabled={gptEnabled}
        />
      </div>
    </div>
  );
};

export default PageBuilder;