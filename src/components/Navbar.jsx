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
      <header className="h-[76px] fixed top-4 inset-x-[5%] max-w-[1400px] mx-auto z-[999] solid-panel bg-[#141813] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-[#293226]">
        <div className="container flex justify-between items-center h-full relative mx-auto px-6">
          {/* Logo Branding */}
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3.5 no-underline group cursor-pointer">
            <div className="relative w-10 h-10 border border-[#D97706]/30 rounded-xl flex items-center justify-center bg-[#D97706]/10 shadow-[0_0_12px_rgba(217,119,6,0.15)] group-hover:shadow-[0_0_20px_rgba(217,119,6,0.35)] group-hover:border-[#D97706] transition-all duration-300 select-none p-1.5 overflow-hidden">
              <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
              {/* Live Status Dot */}
              <span className="absolute bottom-0.5 right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1">
                <span className="font-sans text-sm font-extrabold bg-gradient-to-r from-[#D6C5B3] via-[#D97706] to-[#5F7057] bg-clip-text text-transparent tracking-tight leading-none uppercase">
                  {bridgeName}
                </span>
                <span className="text-[#D97706] animate-blink font-bold text-sm leading-none">_</span>
              </div>
              <span className="font-sans text-[0.5rem] text-[#8E9A87] tracking-[0.2em] uppercase mt-0.5 border-t border-[#272D24]/50 pt-0.5 inline-block w-full">
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
                      className={`text-xs font-bold tracking-widest transition-colors relative py-1.5 uppercase cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#D6C5B3] after:to-[#D97706] hover:after:w-full after:transition-all after:duration-300 ${
                        isActive ? 'text-[#D97706] after:w-full' : 'text-gray-300 hover:text-[#D97706] after:w-0'
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
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider text-[#D6C5B3] bg-[#D97706]/15 border border-[#D97706]/40 hover:bg-[#D97706]/25 hover:border-[#D97706] hover:text-white shadow-[0_0_10px_rgba(217,119,6,0.15)] hover:shadow-[0_0_18px_rgba(217,119,6,0.35)] transition-all duration-300 no-underline"
            >
              <i className="fa-solid fa-download text-xs text-[#D97706]"></i>
              <span>Get Client</span>
            </NavLink>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-[#293226] rounded-xl bg-[#141813] text-[#D6C5B3] hover:text-white hover:border-[#D97706] transition-colors cursor-pointer"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark text-lg' : 'fa-bars text-sm'}`}></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#0C0E0B] z-[998] flex flex-col justify-center items-center p-6 md:hidden animate-in fade-in duration-200">
          <ul className="flex flex-col list-none gap-6 text-center w-full max-w-xs">
            {navLinks.map((link) => {
              const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-extrabold tracking-widest block py-2 uppercase no-underline transition-colors ${
                      isActive ? 'text-[#D97706]' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
            <li className="pt-4 border-t border-[#293226]">
              <NavLink
                to="/downloads"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5F7057] to-[#D97706] border border-[#D97706]/40 no-underline shadow-[0_0_15px_rgba(217,119,6,0.25)]"
              >
                <i className="fa-solid fa-download text-xs"></i>
                <span>Download Vexta Client</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
