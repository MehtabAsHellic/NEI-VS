/**
 * Linear algebra utilities for tiny transformer
 * Optimized for educational clarity and computational efficiency
 */

export function softmax(arr: number[], temperature: number = 1): number[] {
  if (arr.length === 0) return [];
  
  const scaled = arr.map(x => x / temperature);
  const maxVal = Math.max(...scaled);
  const exp = scaled.map(x => Math.exp(x - maxVal)); // Numerical stability
  const sum = exp.reduce((a, b) => a + b, 0);
  
  if (sum === 0) return arr.map(() => 1 / arr.length); // Uniform fallback
  return exp.map(x => x / sum);
}

export function scaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][],
  mask?: number[][],
  temperature: number = 1
): { attention: number[][], output: number[][] } {
  const seqLen = Q.length;
  const dK = K[0].length;
  const scale = 1 / Math.sqrt(dK);
  
  // Compute attention scores: QK^T / sqrt(d_k)
  const scores: number[][] = Array(seqLen).fill(0).map(() => Array(seqLen).fill(0));
  
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      let score = 0;
      for (let k = 0; k < dK; k++) {
        score += Q[i][k] * K[j][k];
      }
      scores[i][j] = score * scale / temperature;
      
      // Apply causal mask for autoregressive generation
      if (mask && mask[i][j] === 0) {
        scores[i][j] = -1e9;
      } else if (j > i) { // Default causal mask
        scores[i][j] = -1e9;
      }
    }
  }
  
  // Apply softmax to get attention weights
  const attention = scores.map(row => softmax(row));
  
  // Apply attention to values: Attention * V
  const output = attention.map(attnRow => {
    const outputRow = Array(V[0].length).fill(0);
    for (let j = 0; j < seqLen; j++) {
      for (let k = 0; k < V[0].length; k++) {
        outputRow[k] += attnRow[j] * V[j][k];
      }
    }
    return outputRow;
  });
  
  return { attention, output };
}

export function positionalEncoding(seqLen: number, dModel: number): number[][] {
  const pe: number[][] = Array(seqLen).fill(0).map(() => Array(dModel).fill(0));
  
  for (let pos = 0; pos < seqLen; pos++) {
    for (let i = 0; i < dModel; i++) {
      if (i % 2 === 0) {
        // PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
        pe[pos][i] = Math.sin(pos / Math.pow(10000, (2 * (i / 2)) / dModel));
      } else {
        // PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
        pe[pos][i] = Math.cos(pos / Math.pow(10000, (2 * ((i - 1) / 2)) / dModel));
      }
    }
  }
  
  return pe;
}
export function matmul(A: number[][], B: number[][]): number[][] {
  if (A.length === 0 || B.length === 0 || A[0].length !== B.length) {
    throw new Error('Invalid matrix dimensions for multiplication');
  }
  
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  const result: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < inner; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

export function transpose(A: number[][]): number[][] {
  return A[0].map((_, i) => A.map(row => row[i]));
}

export function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export function add(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

export function scale(a: number[], s: number): number[] {
  return a.map(val => val * s);
}

export function layerNorm(x: number[], eps: number = 1e-5): number[] {
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((sum, val) => sum + (val - mean) ** 2, 0) / x.length;
  const std = Math.sqrt(variance + eps);
  return x.map(val => (val - mean) / std);
}

export function gelu(x: number): number {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
}