import { Trash2 } from 'lucide-react';
import { Task } from '../core/statistics';

interface Props {
  task: Task;
  index: number;
  updateTask: (index: number, field: keyof Task, value: string | number) => void;
  removeTask: (id: string) => void;
}

export const TaskRow = ({ task, index, updateTask, removeTask }: Props) => {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          placeholder="Nome da Etapa (ex: Alvenaria)"
          className="bg-transparent font-bold text-slate-700 outline-none border-b border-transparent focus:border-blue-500 w-full mr-4"
          value={task.name}
          onChange={(e) => updateTask(index, 'name', e.target.value)}
        />
        <button 
          onClick={() => removeTask(task.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-black uppercase text-blue-500 mb-1">Otimista</label>
          <input
            type="number"
            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={task.min}
            onChange={(e) => updateTask(index, 'min', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-green-600 mb-1">Provável</label>
          <input
            type="number"
            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
            value={task.likely}
            onChange={(e) => updateTask(index, 'likely', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-red-500 mb-1">Pessimista</label>
          <input
            type="number"
            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-red-500 outline-none"
            value={task.max}
            onChange={(e) => updateTask(index, 'max', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
