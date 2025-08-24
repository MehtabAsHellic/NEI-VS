/**
 * Simple PCA implementation for 2D projection
 */

export function pca2d(data: number[][]): number[][] {
  if (data.length === 0) return [];
  
  const n = data.length;
  const d = data[0].length;
  
  // Mean center the data
  const means = Array(d).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      means[j] += data[i][j];
    }
  }
  for (let j = 0; j < d; j++) {
    means[j] /= n;
  }
  
  const centered = data.map(row => 
    row.map((val, j) => val - means[j])
  );
  
  // Compute covariance matrix (simplified for 2D projection)
  const cov = Array(d).fill(0).map(() => Array(d).fill(0));
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      for (let k = 0; k < n; k++) {
        cov[i][j] += centered[k][i] * centered[k][j];
      }
      cov[i][j] /= (n - 1);
    }
  }
  
  // Power iteration for first two eigenvectors (simplified)
  const v1 = Array(d).fill(0).map(() => Math.random() - 0.5);
  const v2 = Array(d).fill(0).map(() => Math.random() - 0.5);
  
  // Normalize
  const norm1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  
  for (let i = 0; i < d; i++) {
    v1[i] /= norm1;
    v2[i] /= norm2;
  }
  
  // Project data onto first two components
  return centered.map(row => [
    row.reduce((sum, val, i) => sum + val * v1[i], 0),
    row.reduce((sum, val, i) => sum + val * v2[i], 0)
  ]);
}