import { Search, Trash2 } from 'lucide-react';
import { RecentPathResponse } from '@/services/recentPath/type';

interface Props {
  paths: RecentPathResponse[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

export default function RecentPathList({ paths, onDelete, onClearAll }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <Search size={16} className="text-slate-500" />
          </span> 
          최근 검색 경로
        </h3>
        {paths.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-slate-400 hover:text-red-500 font-bold transition-colors">
            전체삭제
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {paths.length > 0 ? (
          paths.map((path) => (
            <div key={path.id} className="p-4 flex items-center justify-between border-b border-slate-50 last:border-none group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span className="truncate">{path.startPlaceName}</span>
                    <span className="text-sky-400">→</span>
                    <span className="truncate">{path.endPlaceName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(path.lastUsedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onDelete(path.id)}
                className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-300 font-medium">최근 검색한 경로가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}