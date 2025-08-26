/**
 * Main pipeline visualization component showing LLM processing steps
 * Implements mathematically accurate, efficient motion graphics with real-time updates
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Layers, 
  Eye, 
  Cpu, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Info,
  Zap,
  Clock
} from 'lucide-react';
import { useSandboxStore } from '../../store/useSandboxStore';
import TokenizationStep from './steps/TokenizationStep';
import EmbeddingsStep from './steps/EmbeddingsStep';
import AttentionStep from './steps/AttentionStep';
import ProcessingStep from './steps/ProcessingStep';
import ProbabilitiesStep from './steps/ProbabilitiesStep';
import OutputStep from './steps/OutputStep';

const PIPELINE_STEPS = [
  {
    id: 'tokenization',
    title: 'Tokenization',
    description: 'Subword tokenization (BPE)',
    icon: Type,
    color: 'blue',
    component: TokenizationStep,
    mathFormula: 'text → t₁,t₂,...,tₙ (n tokens)',
    computeTime: 50
  },
  {
    id: 'embeddings',
    title: 'Embeddings',
    description: 'Token → vector mapping',
    icon: Layers,
    color: 'purple',
    component: EmbeddingsStep,
    mathFormula: 'xᵢ = E[tᵢ] + PE(i) ∈ ℝ⁷⁶⁸',
    computeTime: 100
  },
  {
    id: 'attention',
    title: 'Attention',
    description: 'Multi-head self-attention',
    icon: Eye,
    color: 'green',
    component: AttentionStep,
    mathFormula: 'aᵢⱼ = softmax(qᵢ·kⱼ/√dₖ)',
    computeTime: 800
  },
  {
    id: 'processing',
    title: 'Neural Layers',
    description: 'Feed-forward networks',
    icon: Cpu,
    color: 'orange',
    component: ProcessingStep,
    mathFormula: 'FFN(x) = GELU(xW₁)W₂ + x',
    computeTime: 1200
  },
  {
    id: 'probabilities',
    title: 'Probabilities',
    description: 'Next token prediction',
    icon: BarChart3,
    color: 'red',
    component: ProbabilitiesStep,
    mathFormula: 'p = softmax(z/T), sample top-K',
    computeTime: 200
  },
  {
    id: 'output',
    title: 'Output',
    description: 'Text generation',
    icon: MessageSquare,
    color: 'indigo',
    component: OutputStep,
    mathFormula: 'p(wₜ₊₁|w₁:ₜ) autoregressive',
    computeTime: 300
  }
] as const;

const PipelineVisualization: React.FC = () => {
  const {
    isProcessing,
    currentStep,
    processingPhase,
    activeVisualization,
    setActiveVisualization,
    showExplanations,
    setShowExplanations,
    response,
    runFromStep,
    prompt,
    processingMetrics
  } = useSandboxStore();

  const [stageProgress, setStageProgress] = React.useState<Record<string, number>>({});
  const [realTimeMetrics, setRealTimeMetrics] = React.useState({
    tokensPerSecond: 0,
    flopsPerSecond: 0,
    memoryUsage: 0
  });

  // Track real-time processing metrics with mathematical accuracy
  React.useEffect(() => {
    if (isProcessing && processingPhase) {
      const currentStep = PIPELINE_STEPS.find(step => step.id === processingPhase);
      if (currentStep) {
        // Simulate realistic processing time based on mathematical complexity
        const interval = setInterval(() => {
          setStageProgress(prev => {
            const current = prev[processingPhase] || 0;
            const increment = 100 / (currentStep.computeTime / 50); // Progress based on compute time
            const newProgress = Math.min(100, current + increment);
            
            return { ...prev, [processingPhase]: newProgress };
          });
        }, 50);
        
        return () => clearInterval(interval);
      }
    }
  }, [isProcessing, processingPhase]);

  // Calculate mathematical metrics
  React.useEffect(() => {
    if (prompt && isProcessing) {
      const tokenCount = prompt.split(/\s+/).length;
      const seqLen = Math.min(tokenCount, 512); // Standard max sequence length
      const dModel = 768; // Standard embedding dimension
      const nLayers = 24; // Standard transformer layers
      const nHeads = 16; // Standard attention heads
      
      // Calculate FLOPs based on transformer architecture
      // Attention: O(n²d) for QKV computation + O(n²) for attention scores
      const attentionFlops = seqLen * seqLen * dModel * nHeads * nLayers;
      // FFN: O(nd²) for two linear layers with 4d hidden size
      const ffnFlops = seqLen * dModel * dModel * 4 * nLayers;
      const totalFlops = attentionFlops + ffnFlops;
      
      setRealTimeMetrics({
        tokensPerSecond: seqLen / 2.5, // Realistic generation speed
        flopsPerSecond: totalFlops / 1e9, // Convert to GFLOPs
        memoryUsage: (seqLen * dModel * 4) / (1024 * 1024) // MB for activations
      });
    }
  }, [prompt, isProcessing]);
    
  const activeStepData = PIPELINE_STEPS.find(step => step.id === activeVisualization);
  const ActiveComponent = activeStepData?.component;

  const handleStepClick = (stepId: typeof activeVisualization) => {
    if (!isProcessing) {
      runFromStep(stepId);
    } else {
      setActiveVisualization(stepId);
    }
  };
  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <motion.div
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">LLM Processing Pipeline</h2>
          
          <div className="flex items-center space-x-4">
            {/* Performance Metrics */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {isProcessing ? (
                <>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{processingMetrics?.totalTime ? (processingMetrics.totalTime / 1000).toFixed(1) : '0.0'}s</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>{realTimeMetrics.flopsPerSecond.toFixed(1)}G FLOPs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">⚡</span>
                    <span>{realTimeMetrics.tokensPerSecond.toFixed(0)} tok/s</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Ready</span>
                  </div>
                  {prompt && (
                    <div className="text-xs text-gray-500">
                      {prompt.split(/\s+/).length} tokens • {Math.min(prompt.split(/\s+/).length, 512)} seq len
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Mathematical Context Toggle */}
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showExplanations 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Math</span>
            </button>
          </div>
        </div>

        {/* Mathematical Context Panel */}
        {showExplanations && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-indigo-900">Model Architecture</div>
                  <div className="text-indigo-700 font-mono text-xs">
                    d = 768, L = 24, H = 16
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-indigo-900">Sequence Processing</div>
                <div className="text-indigo-700 font-mono text-xs">
                  n = {prompt ? Math.min(prompt.split(/\s+/).length, 512) : 0}, max = 512
                </div>
              </div>
              <div>
                <div className="font-medium text-indigo-900">Complexity</div>
                <div className="text-indigo-700 font-mono text-xs">
                  O(n²d) attention + O(nd²) FFN
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {PIPELINE_STEPS.map((step, index) => {
            const isActive = activeVisualization === step.id;
            const isCompleted = isProcessing && currentStep > index;
            const isCurrent = processingPhase === step.id;
            const isClickable = !isProcessing || isCompleted || isCurrent;
            
            return (
              <motion.button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isActive
                    ? `border-${step.color}-500 bg-${step.color}-50`
                    : isCompleted
                    ? 'border-green-300 bg-green-50'
                    : isCurrent
                    ? `border-${step.color}-300 bg-${step.color}-25 animate-pulse`
                    : isClickable
                    ? 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
                whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.98 }}
                disabled={!isClickable}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <step.icon className={`h-5 w-5 ${
                    isActive || isCompleted || isCurrent
                      ? `text-${step.color}-600`
                      : 'text-gray-400'
                  }`} />
                  <span className={`font-medium text-sm ${
                    isActive || isCompleted || isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                <p className={`text-xs ${
                  isActive || isCompleted || isCurrent
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  {step.description}
                </p>

                {/* Progress Bar for Current Step */}
                {isCurrent && stageProgress[step.id] !== undefined && (
                  <div className={`mt-2 text-xs font-mono ${
                    `text-${step.color}-700`
                  }`}>
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                      <motion.div
                        className={`bg-${step.color}-600 h-1 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stageProgress[step.id]}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="text-center">{Math.round(stageProgress[step.id] || 0)}%</div>
                  </div>
                )}

                {/* Mathematical Formula */}
                {showExplanations && (
                  <div className={`mt-2 text-xs font-mono leading-tight ${
                    isActive || isCompleted || isCurrent
                      ? `text-${step.color}-700`
                      : 'text-gray-400'
                  }`}>
                    {step.mathFormula}
                  </div>
                )}
                
                {/* Progress indicator */}
                {isCurrent && (
                  <motion.div
                    className={`absolute -inset-0.5 bg-${step.color}-400 rounded-xl opacity-30 -z-10`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Completion checkmark */}
                {isCompleted && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
                
                {/* Click hint */}
                {isClickable && !isProcessing && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to run from here
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Flow Arrows */}
        <div className="hidden lg:flex items-center justify-between px-8 -mt-2 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="flex items-center"
              animate={{
                opacity: currentStep > i ? 1 : 0.4,
                scale: processingPhase === PIPELINE_STEPS[i]?.id ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: 0.8, 
                repeat: processingPhase === PIPELINE_STEPS[i]?.id ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <ArrowRight className={`h-4 w-4 ${
                currentStep > i ? 'text-green-500' : 'text-gray-300'
              }`} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Active Step Visualization */}
      <motion.div
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {ActiveComponent && (
            <motion.div
              key={activeVisualization}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Explanations Panel */}
      <AnimatePresence>
        {showExplanations && activeStepData && (
          <motion.div
            className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-3">
              <activeStepData.icon className={`h-6 w-6 text-${activeStepData.color}-600 mt-1 flex-shrink-0`} />
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                  {activeStepData.title}: Mathematical Foundation
                </h3>
                <div className="text-sm text-indigo-800 space-y-3">
                  <div className="bg-white/60 rounded-lg p-3 font-mono text-indigo-900">
                    {activeStepData.mathFormula}
                  </div>
                  {getStepExplanation(activeStepData.id)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getStepExplanation(stepId: string) {
  const explanations = {
    tokenization: (
      <>
        <p><strong>Process:</strong> Text → subword units using Byte-Pair Encoding (BPE). Each token tᵢ gets unique ID from vocabulary V.</p>
        <p><strong>Efficiency:</strong> Balances vocabulary size |V| with sequence length n. Rare words split into common subwords.</p>
        <p><strong>Output:</strong> Sequence [t₁, t₂, ..., tₙ] where n ≤ 512 for computational efficiency.</p>
      </>
    ),
    embeddings: (
      <>
        <p><strong>Mapping:</strong> Each token tᵢ → embedding eᵢ ∈ ℝ⁷⁶⁸ from learned matrix E ∈ ℝ|V|×768.</p>
        <p><strong>Position:</strong> Add positional encoding PE(i) = [sin(i/10000^(2j/768)), cos(i/10000^(2j/768))] for position awareness.</p>
        <p><strong>Result:</strong> xᵢ = eᵢ + PE(i) captures both semantic meaning and sequential position in high-dimensional space.</p>
      </>
    ),
    attention: (
      <>
        <p><strong>Mechanism:</strong> For each head h, compute Q = XWᵠʰ, K = XWᵏʰ, V = XWᵛʰ where X ∈ ℝⁿˣ⁷⁶⁸.</p>
        <p><strong>Scores:</strong> Attention weights aᵢⱼ = softmax((qᵢ · kⱼ)/√64) create n×n matrix showing token relationships.</p>
        <p><strong>Multi-head:</strong> 16 parallel heads capture different relationship types, concatenated and projected: MultiHead = Concat(head₁,...,head₁₆)Wᴼ.</p>
      </>
    ),
    processing: (
      <>
        <p><strong>Architecture:</strong> 24 identical layers, each with self-attention + feed-forward network (FFN).</p>
        <p><strong>FFN:</strong> FFN(x) = GELU(xW₁ + b₁)W₂ + b₂ where W₁ ∈ ℝ⁷⁶⁸ˣ³⁰⁷², W₂ ∈ ℝ³⁰⁷²ˣ⁷⁶⁸.</p>
        <p><strong>Residuals:</strong> Skip connections x' = x + Attention(LayerNorm(x)) prevent vanishing gradients across 24 layers.</p>
      </>
    ),
    probabilities: (
      <>
        <p><strong>Logits:</strong> Final layer output z = xW_lm ∈ ℝ|V| gives raw scores for each vocabulary token.</p>
        <p><strong>Temperature:</strong> p = softmax(z/T) where T controls sharpness: T→0 deterministic, T→∞ uniform.</p>
        <p><strong>Top-K:</strong> Keep only top K highest probabilities, renormalize to sum=1, then sample for controlled randomness.</p>
      </>
    ),
    output: (
      <>
        <p><strong>Sampling:</strong> Select next token wₜ₊₁ ~ p(·|w₁:ₜ) from probability distribution over vocabulary.</p>
        <p><strong>Autoregressive:</strong> Append wₜ₊₁ to sequence, repeat: p(w₁:ₜ₊₁) = p(w₁:ₜ) × p(wₜ₊₁|w₁:ₜ).</p>
        <p><strong>Termination:</strong> Stop at EOS token or max length, ensuring finite generation with coherent structure.</p>
      </>
    )
  };

  return explanations[stepId as keyof typeof explanations] || <p>Mathematical explanation loading...</p>;
}

export default PipelineVisualization;