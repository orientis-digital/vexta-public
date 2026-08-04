import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { bridgeName } = useApp();

  return (
    <footer id="contact" className="py-10 border-t border-white/5 bg-[#151813]/60 backdrop-blur-lg z-20 relative overflow-hidden mt-auto">
      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#D97706]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#5F7057]/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-[5%] max-w-[1400px]">
        {/* Top Status Indicator Bar */}
        <div className="flex items-center justify-between border-b border-[#272D24]/50 pb-4 mb-8 flex-wrap gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706]"></span>
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#D6C5B3] font-bold">
              // SECURE COMMUNICATION CHANNEL ACTIVE
            </span>
          </div>
          <div className="font-mono text-[8px] text-[#7C8775] tracking-widest uppercase font-bold">
            HASH-VERIFIABLE FINGERPRINTS ENFORCED
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand & Details */}
          <div className="flex flex-col text-sm gap-4">
            <NavLink to="/" className="flex items-center gap-3 no-underline group cursor-pointer self-start">
              <div className="relative w-9 h-9 border border-[#5F7057]/30 rounded-xl flex items-center justify-center bg-[#5F7057]/5 shadow-tech-sm group-hover:shadow-tech group-hover:border-[#D97706] transition-all duration-300 p-1.5 overflow-hidden">
                <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <span className="font-sans text-xs font-bold bg-gradient-to-r from-[#D6C5B3] to-[#D97706] bg-clip-text text-transparent tracking-tight leading-none uppercase">
                    {bridgeName}
                  </span>
                  <span className="text-[#D97706] animate-blink font-bold text-xs leading-none">_</span>
                </div>
                <span className="font-sans text-[0.45rem] text-[#7C8775] tracking-[0.2em] uppercase mt-0.5 border-t border-[#272D24]/50 pt-0.5 inline-block w-full">
                  Developed by Orientis Digital
                </span>
              </div>
            </NavLink>
            <p className="text-xs text-[#7C8775] border-l-2 border-[#5F7057]/20 pl-3.5 leading-relaxed font-sans max-w-sm">
              Orientis Digital constructs metadata-blind WebSocket relay servers to route cryptographic envelopes end-to-end, neutralizing external monitoring.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#272D24]/50 pb-2">
              // Directory Registry
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 list-none">
              <li>
                <NavLink to="/" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/docs" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> Docs
                </NavLink>
              </li>
              <li>
                <NavLink to="/downloads" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> Downloads
                </NavLink>
              </li>
              <li>
                <NavLink to="/announcements" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> Broadcasts
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> About
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="group flex items-center gap-1.5 text-[#7C8775] no-underline transition-all hover:text-[#D6C5B3] cursor-pointer font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[#D97706] transition-transform group-hover:translate-x-1 font-bold">&gt;</span> FAQ
                </NavLink>
              </li>
              <li className="col-span-2 pt-1 border-t border-white/5">
                <a href="/about#report-issue" className="group flex items-center gap-1.5 text-[#D97706] hover:text-white no-underline transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wide font-bold">
                  <span className="text-red-400 transition-transform group-hover:translate-x-1 font-bold">&gt;</span> Report Bug / Vulnerability
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Live Protocol Status Widget */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#272D24]/50 pb-2">
              // Protocol Status Diagnostics
            </h4>
            <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px] border border-white/5">
              <div className="flex justify-between items-center text-[#7C8775]">
                <span>RELAY STATUS:</span>
                <span className="text-green-400 font-bold uppercase">100% OPERATIONAL</span>
              </div>
              <div className="flex justify-between items-center text-[#7C8775]">
                <span>CIPHER SUITE:</span>
                <span className="text-[#D6C5B3]">RSA-OAEP / AES-256</span>
              </div>
              <div className="flex justify-between items-center text-[#7C8775]">
                <span>RETENTION POLICY:</span>
                <span className="text-[#D97706]">ZERO PLAINTEXT LOGS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-[#272D24]/40 flex justify-between items-center text-[10px] font-mono text-[#7C8775] flex-wrap gap-2">
          <span>&copy; 2026 Orientis Digital. All Rights Reserved.</span>
          <span>Zero-Knowledge Relay Server Protocol v1.2.0</span>
        </div>
      </div>
    </footer>
  );
}
