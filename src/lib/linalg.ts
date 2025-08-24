/**
 * Linear algebra utilities for tiny transformer
 */

export function softmax(arr: number[], temperature: number = 1): number[] {
  const scaled = arr.map(x => x / temperature);
  const maxVal = Math.max(...scaled);
  const exp = scaled.map(x => Math.exp(x - maxVal));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(x => x / sum);
}

export function matmul(A: number[][], B: number[][]): number[][] {
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