/**
 * Token trace visualization component
 */

import React from 'react';
import { getTokenChar } from '../lib/tokenizer';

interface TokenTraceProps {
  tokens: number[];
  currentStep?: number;
  onTokenHover?: (tokenIndex: number | null) => void;
}

const TokenTrace: React.FC<TokenTraceProps> = ({ 
  tokens, 
  currentStep,
  onTokenHover 
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Token Sequence</h4>
      
      <div className="flex flex-wrap gap-2">
        {tokens.map((tokenId, index) => {
          const char = getTokenChar(tokenId);
          const isSpecial = ['<pad>', '<bos>', '<eos>', '<mask>'].includes(char);
          const isCurrent = currentStep !== undefined && index === currentStep;
          const isPast = currentStep !== undefined && index < currentStep;
          
          return (
            <div
              key={index}
              className={`
                px-2 py-1 rounded text-sm font-mono border transition-all cursor-pointer
                ${isCurrent ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300' :
                  isPast ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  isSpecial ? 'bg-gray-100 text-gray-600 border-gray-200' :
                  'bg-white text-gray-800 border-gray-200 hover:border-gray-300'}
              `}
              onMouseEnter={() => onTokenHover?.(index)}
              onMouseLeave={() => onTokenHover?.(null)}
              title={`Token ${index}: "${char}" (ID: ${tokenId})`}
            >
              <div className="text-xs text-center mb-1 opacity-60">
                {index}
              </div>
              <div className="text-center">
                {isSpecial ? (
                  <span className="text-xs">{char.replace(/[<>]/g, '')}</span>
                ) : (
                  char === ' ' ? '␣' : char
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {currentStep !== undefined && (
        <div className="text-xs text-gray-600">
          Step {currentStep + 1} of {tokens.length}
        </div>
      )}
    </div>
  );
};

export default TokenTrace;