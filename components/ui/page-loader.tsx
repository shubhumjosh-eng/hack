import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <p className="text-[10px] text-emerald-700 font-mono">loading...</p>
      </div>
    </div>
  );
}
