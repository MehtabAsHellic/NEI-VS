/**
 * Attention heatmap visualization component
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTokenChar } from '../lib/tokenizer';

interface HeatmapProps {
  attention: number[][];
  tokens: number[];
  width?: number;
  height?: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ 
  attention, 
  tokens, 
  width = 400, 
  height = 400 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    queryIdx: number;
    keyIdx: number;
    value: number;
    visible: boolean;
  }>({ x: 0, y: 0, queryIdx: 0, keyIdx: 0, value: 0, visible: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !attention.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const seqLen = attention.length;
    const cellWidth = width / seqLen;
    const cellHeight = height / seqLen;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for normalization
    const maxVal = Math.max(...attention.flat());

    // Draw heatmap
    for (let i = 0; i < seqLen; i++) {
      for (let j = 0; j < seqLen; j++) {
        const value = attention[i][j];
        const intensity = value / maxVal;
        
        // Blue to white gradient
        const blue = Math.floor(255 * (1 - intensity));
        const color = `rgb(${blue}, ${blue}, 255)`;
        
        ctx.fillStyle = color;
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        
        // Add border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [attention, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !attention.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const seqLen = attention.length;
    const cellWidth = width / seqLen;
    const cellHeight = height / seqLen;

    const keyIdx = Math.floor(x / cellWidth);
    const queryIdx = Math.floor(y / cellHeight);

    if (keyIdx >= 0 && keyIdx < seqLen && queryIdx >= 0 && queryIdx < seqLen) {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        queryIdx,
        keyIdx,
        value: attention[queryIdx][keyIdx],
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="relative">
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {tooltip.visible && (
        <motion.div
          className="fixed bg-gray-900 text-white px-2 py-1 rounded text-xs pointer-events-none z-50"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 30,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div>Query: {tooltip.queryIdx} ({getTokenChar(tokens[tooltip.queryIdx])})</div>
          <div>Key: {tooltip.keyIdx} ({getTokenChar(tokens[tooltip.keyIdx])})</div>
          <div>Attention: {tooltip.value.toFixed(3)}</div>
        </motion.div>
      )}
    </div>
  );
};

export default Heatmap;