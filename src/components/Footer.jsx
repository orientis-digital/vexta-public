import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { bridgeName } = useApp();

  return (
    <footer id="contact" className="py-10 border-t border-[#293226] bg-[#121511] z-20 relative overflow-hidden mt-auto">
      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#D97706]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#5F7057]/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-[5%] max-w-[1400px]">
        {/* Top Status Indicator Bar */}
        <div className="flex items-center justify-between border-b border-[#272D24]/50 pb-4 mb-8 flex-wrap gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
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
            <NavLink to="/" className="flex items-center gap-3.5 no-underline group cursor-pointer self-start">
              <div className="relative w-9 h-9 border border-[#D97706]/30 rounded-xl flex items-center justify-center bg-[#D97706]/10 shadow-[0_0_10px_rgba(217,119,6,0.15)] group-hover:shadow-[0_0_18px_rgba(217,119,6,0.35)] group-hover:border-[#D97706] transition-all duration-300 p-1.5 overflow-hidden">
                <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <span className="font-sans text-xs font-bold bg-gradient-to-r from-[#D6C5B3] via-[#D97706] to-[#5F7057] bg-clip-text text-transparent tracking-tight leading-none uppercase">
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
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <NavLink to="/" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                Home Gateway
              </NavLink>
              <NavLink to="/docs" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                Protocol Specs
              </NavLink>
              <NavLink to="/downloads" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                Client Releases
              </NavLink>
              <NavLink to="/announcements" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                Dispatches
              </NavLink>
              <NavLink to="/about" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                About Orientis
              </NavLink>
              <NavLink to="/faq" className="text-[#8E9A87] hover:text-[#D97706] transition-colors py-1">
                Security FAQ
              </NavLink>
            </div>
          </div>

          {/* Column 3: Cryptographic Specs */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#272D24]/50 pb-2">
              // Relay Guarantees
            </h4>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-[#8E9A87]">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-[#D97706] text-xs"></i>
                <span>Zero Server Plaintext Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-key text-[#5F7057] text-xs"></i>
                <span>RSA-4096 / AES-256-GCM Hybrid</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-[#D6C5B3] text-xs"></i>
                <span>Binary WebSocket Framing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-[#272D24]/50 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#7C8775] font-sans gap-2 select-none">
          <div>
            &copy; {new Date().getFullYear()} Orientis Digital. All Rights Reserved.
          </div>
          <div className="font-mono text-[10px] text-[#8E9A87]">
            Vexta Messenger // High-Assurance Communications
          </div>
        </div>
      </div>
    </footer>
  );
}
