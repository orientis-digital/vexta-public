import React from 'react';
import { Link } from 'react-router-dom';

export default function Error404Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] py-12 relative select-none">
      <div className="container max-w-lg glass-panel p-10 rounded-3xl text-center flex flex-col items-center gap-4 relative z-10 border border-white/5 shadow-2xl">
        <div className="font-mono text-8xl font-extrabold text-[#D97706] tracking-tighter drop-shadow-[0_0_20px_rgba(217,119,6,0.3)] animate-pulse">
          404
        </div>
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-white">Resource Not Found</h1>
        <p className="text-sm text-[#7C8775] font-sans leading-relaxed">
          This page is more lost than your crypto wallet seed phrase.
        </p>
        <p className="font-mono text-xs text-[#5F7057] uppercase tracking-wider">
          &gt; and you're not even supposed to be here
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
