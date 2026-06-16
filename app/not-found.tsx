import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="terminal-panel max-w-lg w-full animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>404 — Not Found</span>
        </div>
        <div className="terminal-content space-y-4 py-8 text-center">
          <p className="text-5xl font-bold text-emerald-300 glow-text">404</p>
          <p className="text-sm text-emerald-500/80 font-mono">
            <span className="text-emerald-600">$</span> route not found
          </p>
          <p className="text-xs text-emerald-700">
            The requested resource does not exist on this server.
          </p>
          <div className="inline-block border border-emerald-800/30 bg-gray-900 px-4 py-2 text-xs text-emerald-500">
            Exit code: 1
          </div>
          <div className="pt-4">
            <Link
              href="/"
              className="terminal-btn-primary inline-flex"
            >
              <span className="text-emerald-500/70">&gt;</span>
              <span>return to dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
