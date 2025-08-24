/**
 * 2D embedding projection visualization
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pca2d } from '../lib/pca';
import { getTokenChar } from '../lib/tokenizer';

interface EmbeddingProjectorProps {
  embeddings: number[][];
  tokens: number[];
  width?: number;
  height?: number;
}

const EmbeddingProjector: React.FC<EmbeddingProjectorProps> = ({
  embeddings,
  tokens,
  width = 400,
  height = 300,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    token: string;
    id: number;
    index: number;
  } | null>(null);

  const projectedPoints = useMemo(() => {
    if (!embeddings.length) return [];
    
    const projected = pca2d(embeddings);
    
    // Normalize to canvas coordinates
    const xValues = projected.map(p => p[0]);
    const yValues = projected.map(p => p[1]);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const padding = 20;
    
    return projected.map(([x, y], i) => ({
      x: padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding),
      y: padding + ((y - yMin) / (yMax - yMin)) * (height - 2 * padding),
      token: getTokenChar(tokens[i]),
      id: tokens[i],
      index: i,
    }));
  }, [embeddings, tokens, width, height]);

  const getPointColor = (token: string) => {
    if (/[a-zA-Z]/.test(token)) return '#3B82F6'; // Blue for letters
    if (/[0-9]/.test(token)) return '#10B981'; // Green for digits
    if (/[.,!?;:]/.test(token)) return '#F59E0B'; // Orange for punctuation
    if (token === ' ') return '#8B5CF6'; // Purple for space
    return '#6B7280'; // Gray for special tokens
  };

  return (
    <div className="relative">
      <motion.svg
        width={width}
        height={height}
        className="border border-gray-200 rounded bg-white"
        onMouseLeave={() => setHoveredPoint(null)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {projectedPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={getPointColor(point.token)}
            className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ 
              delay: i * 0.05,
              duration: 0.3,
              type: "spring",
              damping: 25
            }}
            whileHover={{ scale: 1.5, opacity: 1 }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredPoint({
                x: rect.left + rect.width / 2,
                y: rect.top,
                token: point.token,
                id: point.id,
                index: point.index,
              });
            }}
          />
        ))}
      </motion.svg>
      
      {hoveredPoint && (
        <motion.div
          className="fixed bg-gray-900 text-white px-2 py-1 rounded text-xs pointer-events-none z-50"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 40,
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div>Token: "{hoveredPoint.token}"</div>
          <div>ID: {hoveredPoint.id}</div>
          <div>Position: {hoveredPoint.index}</div>
        </motion.div>
      )}
      
      <motion.div 
        className="mt-2 flex flex-wrap gap-2 text-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Letters</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Digits</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Punctuation</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Space</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Special</span>
        </div>
      </motion.div>
    </div>
  );
};

export default EmbeddingProjector;