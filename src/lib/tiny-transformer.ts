/**
 * Tiny Transformer implementation for educational purposes
 */

import { mulberry32, randn } from './prng';
import { softmax, matmul, layerNorm, gelu } from './linalg';
import { encode, VOCAB_SIZE, TOKENS, getTokenChar } from './tokenizer';

export interface Hyperparams {
  d_model: number;
  n_head: number;
  d_head: number;
  n_layer: number;
  seqLen: number;
  ffn_mult: number;
}

export interface ForwardArtifacts {
  tokens: number[];
  hiddenByLayer: number[][][];
  attnByLayerHead: number[][][][];
  lastLogits: number[];
  embeddings: number[][];
  qkv?: {Q: number[][][], K: number[][][], V: number[][][]};
}

export interface TransformerWeights {
  tokenEmbed: number[][];
  posEmbed: number[][];
  layers: Array<{
    attn: {
      wq: number[][][];
      wk: number[][][];
      wv: number[][][];
      wo: number[][];
    };
    ffn: {
      w1: number[][];
      b1: number[];
      w2: number[][];
      b2: number[];
    };
  }>;
  lmHead: number[][];
}

export function initWeights(hyper: Hyperparams, seed: number): TransformerWeights {
  const prng = mulberry32(seed);
  const scale = 0.02;
  
  const tokenEmbed = Array(VOCAB_SIZE).fill(0).map(() => 
    Array(hyper.d_model).fill(0).map(() => randn(prng) * scale)
  );
  
  const posEmbed = Array(hyper.seqLen).fill(0).map(() =>
    Array(hyper.d_model).fill(0).map(() => randn(prng) * scale)
  );
  
  const layers = Array(hyper.n_layer).fill(0).map(() => ({
    attn: {
      wq: Array(hyper.n_head).fill(0).map(() =>
        Array(hyper.d_model).fill(0).map(() =>
          Array(hyper.d_head).fill(0).map(() => randn(prng) * scale)
        )
      ),
      wk: Array(hyper.n_head).fill(0).map(() =>
        Array(hyper.d_model).fill(0).map(() =>
          Array(hyper.d_head).fill(0).map(() => randn(prng) * scale)
        )
      ),
      wv: Array(hyper.n_head).fill(0).map(() =>
        Array(hyper.d_model).fill(0).map(() =>
          Array(hyper.d_head).fill(0).map(() => randn(prng) * scale)
        )
      ),
      wo: Array(hyper.n_head * hyper.d_head).fill(0).map(() =>
        Array(hyper.d_model).fill(0).map(() => randn(prng) * scale)
      ),
    },
    ffn: {
      w1: Array(hyper.d_model).fill(0).map(() =>
        Array(hyper.d_model * hyper.ffn_mult).fill(0).map(() => randn(prng) * scale)
      ),
      b1: Array(hyper.d_model * hyper.ffn_mult).fill(0).map(() => randn(prng) * scale),
      w2: Array(hyper.d_model * hyper.ffn_mult).fill(0).map(() =>
        Array(hyper.d_model).fill(0).map(() => randn(prng) * scale)
      ),
      b2: Array(hyper.d_model).fill(0).map(() => randn(prng) * scale),
    },
  }));
  
  const lmHead = Array(hyper.d_model).fill(0).map(() =>
    Array(VOCAB_SIZE).fill(0).map(() => randn(prng) * scale)
  );
  
  return { tokenEmbed, posEmbed, layers, lmHead };
}

export function forward(
  text: string,
  hyper: Hyperparams,
  weights: TransformerWeights,
  options: {
    temperature: number;
    topK: number;
    layerView: number;
    headView: number;
    maskIndex?: number | null;
  }
): ForwardArtifacts {
  let tokens = encode(text, hyper.seqLen);
  
  // Apply mask if specified
  if (options.maskIndex !== null && options.maskIndex !== undefined && 
      options.maskIndex >= 0 && options.maskIndex < tokens.length) {
    tokens[options.maskIndex] = TOKENS.MASK;
  }
  
  const seqLen = tokens.length;
  
  // Token + positional embeddings
  let hidden = tokens.map((tokenId, pos) => {
    const tokenEmb = weights.tokenEmbed[tokenId] || Array(hyper.d_model).fill(0);
    const posEmb = weights.posEmbed[pos] || Array(hyper.d_model).fill(0);
    return tokenEmb.map((val, i) => val + posEmb[i]);
  });
  
  const embeddings = hidden.map(h => [...h]);
  const hiddenByLayer: number[][][] = [hidden.map(h => [...h])];
  const attnByLayerHead: number[][][][] = [];
  
  // Process each layer
  for (let layerIdx = 0; layerIdx < hyper.n_layer; layerIdx++) {
    const layer = weights.layers[layerIdx];
    const layerAttn: number[][][] = [];
    
    // Multi-head attention
    const headOutputs: number[][][] = [];
    
    for (let headIdx = 0; headIdx < hyper.n_head; headIdx++) {
      // Compute Q, K, V
      const Q = hidden.map(h => 
        layer.attn.wq[headIdx].map(w => w.reduce((sum, wi, i) => sum + wi * h[i], 0))
      );
      const K = hidden.map(h =>
        layer.attn.wk[headIdx].map(w => w.reduce((sum, wi, i) => sum + wi * h[i], 0))
      );
      const V = hidden.map(h =>
        layer.attn.wv[headIdx].map(w => w.reduce((sum, wi, i) => sum + wi * h[i], 0))
      );
      
      // Attention scores with causal mask
      const attnScores: number[][] = Array(seqLen).fill(0).map(() => Array(seqLen).fill(0));
      const scale = 1 / Math.sqrt(hyper.d_head);
      
      for (let i = 0; i < seqLen; i++) {
        for (let j = 0; j < seqLen; j++) {
          if (j <= i) { // Causal mask
            const score = Q[i].reduce((sum, qi, k) => sum + qi * K[j][k], 0) * scale;
            attnScores[i][j] = score;
          } else {
            attnScores[i][j] = -1e9; // Masked positions
          }
        }
      }
      
      // Softmax attention weights
      const attnWeights = attnScores.map(row => softmax(row));
      layerAttn.push(attnWeights);
      
      // Apply attention to values
      const headOutput = attnWeights.map(weights =>
        Array(hyper.d_head).fill(0).map((_, k) =>
          weights.reduce((sum, w, j) => sum + w * V[j][k], 0)
        )
      );
      
      headOutputs.push(headOutput);
    }
    
    attnByLayerHead.push(layerAttn);
    
    // Concatenate heads and apply output projection
    const concatHeads = headOutputs[0].map((_, i) =>
      headOutputs.flatMap(head => head[i])
    );
    
    const attnOutput = concatHeads.map(concat =>
      layer.attn.wo.map(w => w.reduce((sum, wi, j) => sum + wi * concat[j], 0))
    );
    
    // Residual connection + layer norm
    hidden = hidden.map((h, i) =>
      layerNorm(h.map((hi, j) => hi + attnOutput[i][j]))
    );
    
    // FFN
    const ffnHidden = hidden.map(h => {
      const h1 = layer.ffn.w1.map(w => gelu(w.reduce((sum, wi, i) => sum + wi * h[i], 0) + layer.ffn.b1[0]));
      return layer.ffn.w2.map(w => w.reduce((sum, wi, i) => sum + wi * h1[i], 0) + layer.ffn.b2[0]);
    });
    
    // Residual connection + layer norm
    hidden = hidden.map((h, i) =>
      layerNorm(h.map((hi, j) => hi + ffnHidden[i][j]))
    );
    
    hiddenByLayer.push(hidden.map(h => [...h]));
  }
  
  // Language modeling head (last position only)
  const lastHidden = hidden[hidden.length - 1];
  const lastLogits = weights.lmHead.map(w => 
    w.reduce((sum, wi, i) => sum + wi * lastHidden[i], 0)
  );
  
  return {
    tokens,
    hiddenByLayer,
    attnByLayerHead,
    lastLogits,
    embeddings,
  };
}