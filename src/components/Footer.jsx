import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { bridgeName } = useApp();

  return (
    <footer id="contact" className="py-14 border-t border-[#243022] bg-[#0A0D09] z-20 relative overflow-hidden mt-auto">
      {/* Background ambient highlights */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#22C55E]/4 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#39FF14]/3 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="container mx-auto px-[5%] max-w-[1400px]">
        {/* Top Status Indicator Bar */}
        <div className="flex items-center justify-between border-b border-[#1C241B] pb-4 mb-8 flex-wrap gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39FF14]"></span>
            </span>
            <span className="font-mono text-xs md:text-sm tracking-widest uppercase text-[#4ADE80] font-bold">
              // SECURE RELAY CHANNEL ACTIVE
            </span>
          </div>
          <div className="font-mono text-[11px] md:text-xs text-[#7E927F] tracking-widest uppercase font-bold">
            HASH-VERIFIABLE FINGERPRINTS ENFORCED
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand & Details */}
          <div className="flex flex-col gap-4">
            <NavLink to="/" className="flex items-center gap-3.5 no-underline group cursor-pointer self-start">
              <div className="relative w-10 h-10 border border-[#22C55E]/30 rounded-xl flex items-center justify-center bg-[#22C55E]/10 shadow-[0_0_10px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_18px_rgba(57,255,20,0.35)] group-hover:border-[#39FF14] transition-all duration-300 p-1.5 overflow-hidden">
                <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <span className="font-sans text-sm md:text-base font-bold text-neon-gradient tracking-tight leading-none uppercase">
                    {bridgeName}
                  </span>
                  <span className="text-[#39FF14] animate-blink font-bold text-sm leading-none">_</span>
                </div>
                <span className="font-sans text-[10px] text-[#7E927F] tracking-[0.2em] uppercase mt-1 border-t border-[#1C241B] pt-0.5 inline-block w-full font-bold">
                  Developed by Orientis Digital
                </span>
              </div>
            </NavLink>
            <p className="text-xs md:text-sm text-[#7E927F] border-l-2 border-[#22C55E]/30 pl-3.5 leading-relaxed font-sans max-w-sm">
              Orientis Digital constructs metadata-blind WebSocket relay servers to route cryptographic envelopes end-to-end, neutralizing external monitoring.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest border-b border-[#1C241B] pb-2 font-mono text-[#4ADE80]">
              // Directory Registry
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs md:text-sm font-sans">
              <NavLink to="/" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                Home Gateway
              </NavLink>
              <NavLink to="/docs" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                Protocol Specs
              </NavLink>
              <NavLink to="/downloads" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                Client Releases
              </NavLink>
              <NavLink to="/announcements" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                Dispatches
              </NavLink>
              <NavLink to="/about" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                About Orientis
              </NavLink>
              <NavLink to="/faq" className="text-gray-300 hover:text-[#39FF14] transition-colors py-1">
                Security FAQ
              </NavLink>
            </div>
          </div>

          {/* Column 3: Cryptographic Specs */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest border-b border-[#1C241B] pb-2 font-mono text-[#4ADE80]">
              // Relay Guarantees
            </h4>
            <div className="flex flex-col gap-3 font-mono text-xs md:text-sm text-gray-200">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-shield-halved text-[#39FF14] text-sm"></i>
                <span>Zero Server Plaintext Storage</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-key text-[#22C55E] text-sm"></i>
                <span>RSA-4096 / AES-256-GCM Hybrid</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-bolt text-[#4ADE80] text-sm"></i>
                <span>Binary WebSocket Framing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-[#1C241B] flex flex-col md:flex-row items-center justify-between text-xs text-[#7E927F] font-sans gap-2 select-none">
          <div>
            &copy; {new Date().getFullYear()} Orientis Digital. All Rights Reserved.
          </div>
          <div className="font-mono text-xs text-gray-400">
            Vexta Messenger // High-Assurance Communications
          </div>
        </div>
      </div>
    </footer>
  );
}
