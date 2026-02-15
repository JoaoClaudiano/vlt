import { useState } from 'react';
import { Plus, Play, Info, HardHat } from 'lucide-react';
import { Task, runMonteCarlo } from './core/statistics';
import { ResultsChart } from './components/ResultsChart';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Fundação', min: 10, likely: 15, max: 25 }
  ]);
  const [results, setResults] = useState<number[]>([]);

  const handleRun = () => {
    const sim = runMonteCarlo(tasks, 10000);
    setResults(sim);
  };

  const p90 = results.length > 0 ? results[Math.floor(results.length * 0.9)] : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <HardHat size={32} className="text-orange-500" />
          <h1 className="text-2xl font-bold uppercase tracking-tight">Análise de Risco Civil</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna de Input */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Cronograma (Dias)</h2>
                <button 
                  onClick={() => setTasks([...tasks, { id: crypto.randomUUID(), name: '', min: 0, likely: 0, max: 0 }])}
                  className="p-1 hover:bg-slate-100 rounded text-blue-600"><Plus size={20} /></button>
              </div>
              
              {tasks.map((task, i) => (
                <div key={task.id} className="mb-4 p-3 bg-slate-50 rounded-lg space-y-2">
                  <input placeholder="Nome da Etapa" className="w-full bg-transparent font-medium outline-none" 
                         value={task.name} onChange={e => {
                           const n = [...tasks]; n[i].name = e.target.value; setTasks(n);
                         }} />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Min" className="border rounded p-1 text-sm" onChange={e => {const n = [...tasks]; n[i].min = +e.target.value; setTasks(n);}} />
                    <input type="number" placeholder="Prov" className="border rounded p-1 text-sm" onChange={e => {const n = [...tasks]; n[i].likely = +e.target.value; setTasks(n);}} />
                    <input type="number" placeholder="Max" className="border rounded p-1 text-sm" onChange={e => {const n = [...tasks]; n[i].max = +e.target.value; setTasks(n);}} />
                  </div>
                </div>
              ))}

              <button onClick={handleRun} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
                <Play size={18} /> SIMULAR
              </button>
            </div>
          </div>

          {/* Coluna de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold mb-6">Distribuição de Probabilidade</h2>
              {results.length > 0 ? (
                <>
                  <ResultsChart data={results} />
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="text-sm text-slate-500">Cenário P90 (Seguro)</p>
                      <p className="text-3xl font-black">{p90} dias</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-slate-500">Média Esperada</p>
                      <p className="text-3xl font-black">{(results.reduce((a,b)=>a+b,0)/results.length).toFixed(1)} dias</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Info size={48} strokeWidth={1} className="mb-2" />
                  <p>Insira os dados e clique em Simular para gerar o gráfico.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
