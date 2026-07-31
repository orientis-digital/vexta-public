import React from 'react';
import { Link } from 'react-router-dom';

export default function Error500Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] py-12 relative select-none">
      <div className="container max-w-lg glass-panel p-10 rounded-3xl text-center flex flex-col items-center gap-4 relative z-10 border border-white/5 shadow-2xl">
        <div className="font-mono text-8xl font-extrabold text-red-500 tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
          500
        </div>
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-white">Server Critical Exception</h1>
        <p className="text-sm text-[#7C8775] font-sans leading-relaxed">
          An unexpected internal processing exception occurred in the relay buffer pipeline.
        </p>
        <p className="font-mono text-xs text-red-400 uppercase tracking-wider">
          &gt; RAM buffer watchdog triggered failure panic
        </p>

        <Link
          to="/"
          className="mt-4 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white bg-[#5F7057]/20 border border-[#5F7057]/40 hover:bg-[#5F7057] rounded-lg transition-all shadow-tech-sm hover:shadow-tech no-underline"
        >
          &lt; Return to safe space
        </Link>

        <div className="w-full pt-6 mt-4 border-t border-[#5F7057]/15 flex flex-col items-center">
          <div className="font-mono text-sm font-extrabold text-[#D97706] tracking-widest uppercase">Vexta Bridge</div>
          <div className="font-mono text-[9px] text-[#5F7057] tracking-widest uppercase mt-0.5">
            Zero-Knowledge Relay Server
          </div>
        </div>
      </div>
    </div>
  );
}
