import React from 'react';
import { Link } from 'react-router-dom';
import BentoCard from '../components/ui/BentoCard';

export default function Error500Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] py-12 relative select-none">
      <BentoCard hover={false} className="container max-w-lg p-10 rounded-3xl text-center flex flex-col items-center gap-4 relative z-10 border-red-500/30 shadow-2xl">
        <div className="font-mono text-8xl font-extrabold text-red-500 tracking-tighter drop-shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse">
          500
        </div>
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-white font-mono">Server Critical Exception</h1>
        <p className="text-sm text-[#7E927F] font-sans leading-relaxed">
          An unexpected internal processing exception occurred in the relay buffer pipeline.
        </p>
        <p className="font-mono text-xs text-red-400 uppercase tracking-wider">
          &gt; RAM buffer watchdog triggered failure panic
        </p>

        <Link
          to="/"
          className="mt-4 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-black bg-[#22C55E] hover:bg-[#39FF14] border border-[#39FF14] rounded-xl transition-all shadow-md no-underline"
        >
          &lt; Return to safe space
        </Link>

        <div className="w-full pt-6 mt-4 border-t border-[#1C241B] flex flex-col items-center">
          <div className="font-mono text-sm font-extrabold text-[#39FF14] tracking-widest uppercase">Vexta Bridge</div>
          <div className="font-mono text-[9px] text-[#7E927F] tracking-widest uppercase mt-0.5">
            Zero-Knowledge Relay Server
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
