import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { bridgeName } = useApp();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' }
  ];

  return (
    <>
      <header className="h-[80px] fixed top-4 inset-x-[5%] max-w-[1400px] mx-auto z-[999] solid-panel bg-[#0E120D]/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] border border-[#243022]">
        <div className="container flex justify-between items-center h-full relative mx-auto px-6">
          {/* Logo Branding */}
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3.5 no-underline group cursor-pointer">
            <div className="relative w-11 h-11 border border-[#22C55E]/40 rounded-xl flex items-center justify-center bg-[#22C55E]/10 shadow-[0_0_15px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_25px_rgba(57,255,20,0.45)] group-hover:border-[#39FF14] transition-all duration-300 select-none p-1.5 overflow-hidden">
              <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
              {/* Live Status Dot */}
              <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39FF14]"></span>
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1">
                <span className="font-sans text-base md:text-lg font-extrabold text-neon-gradient tracking-tight leading-none uppercase">
                  {bridgeName}
                </span>
                <span className="text-[#39FF14] animate-blink font-bold text-base leading-none">_</span>
              </div>
              <span className="font-sans text-[10px] md:text-[11px] text-[#7E927F] tracking-[0.2em] uppercase mt-1 border-t border-[#1C241B] pt-0.5 inline-block w-full font-bold">
                Zero-Knowledge Relay
              </span>
            </div>
          </NavLink>

          {/* Navigation Links & Action Button */}
          <nav className="flex items-center gap-6">
            <ul className="flex list-none gap-7 hidden md:flex items-center transition-all duration-300">
              {navLinks.map((link) => {
                const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={`text-sm font-bold tracking-wider transition-colors relative py-1.5 uppercase cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#4ADE80] after:to-[#22C55E] hover:after:w-full after:transition-all after:duration-300 ${
                        isActive ? 'text-[#39FF14] after:w-full font-extrabold' : 'text-gray-200 hover:text-[#4ADE80] after:w-0'
                      }`}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Quick Action CTA Button */}
            <NavLink
              to="/downloads"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-white bg-[#22C55E]/20 border border-[#22C55E]/40 hover:bg-[#22C55E] hover:border-[#39FF14] hover:text-black shadow-[0_0_12px_rgba(34,197,94,0.2)] hover:shadow-[0_0_22px_rgba(57,255,20,0.5)] transition-all duration-300 no-underline cursor-pointer"
            >
              <i className="fa-solid fa-download text-xs text-[#39FF14] group-hover:text-black"></i>
              <span>Get Client</span>
            </NavLink>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 border border-[#243022] rounded-xl bg-[#0E120D] text-[#4ADE80] hover:text-white hover:border-[#22C55E] transition-colors cursor-pointer"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark text-xl' : 'fa-bars text-base'}`}></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#08080A]/98 backdrop-blur-xl z-[998] flex flex-col justify-center items-center p-6 md:hidden animate-in fade-in duration-200">
          <ul className="flex flex-col list-none gap-6 text-center w-full max-w-xs">
            {navLinks.map((link) => {
              const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-extrabold tracking-widest block py-2 uppercase no-underline transition-colors ${
                      isActive ? 'text-[#39FF14]' : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
            <li className="pt-4 border-t border-[#243022]">
              <NavLink
                to="/downloads"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-wider text-black bg-[#22C55E] hover:bg-[#39FF14] border border-[#39FF14] no-underline shadow-[0_0_20px_rgba(34,197,94,0.35)]"
              >
                <i className="fa-solid fa-download text-sm"></i>
                <span>Download Vexta Client</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
