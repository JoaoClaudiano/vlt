export interface Task {
  id: string;
  name: string;
  min: number;
  likely: number;
  max: number;
}

// Gera valor aleatório baseado na Distribuição Triangular (comum em Civil)
export function getTriangular(min: number, likely: number, max: number): number {
  const u = Math.random();
  const f = (likely - min) / (max - min);
  if (u <= f) {
    return min + Math.sqrt(u * (max - min) * (likely - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - likely));
  }
}

// Executa a simulação completa
export function runMonteCarlo(tasks: Task[], iterations: number = 10000): number[] {
  const results: number[] = [];
  for (let i = 0; i < iterations; i++) {
    let totalDuration = 0;
    tasks.forEach(task => {
      totalDuration += getTriangular(Number(task.min), Number(task.likely), Number(task.max));
    });
    results.push(Math.round(totalDuration));
  }
  return results.sort((a, b) => a - b);
}
