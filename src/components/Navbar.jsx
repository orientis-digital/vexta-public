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
      <header className="h-[76px] fixed top-4 inset-x-[5%] max-w-[1400px] mx-auto z-[999] glass-panel bg-[#0C0E0B]/80 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/5">
        <div className="container flex justify-between items-center h-full relative mx-auto px-6">
          {/* Logo Branding */}
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 no-underline group cursor-pointer">
            <div className="relative w-10 h-10 border border-[#5F7057]/30 rounded-xl flex items-center justify-center bg-[#5F7057]/5 shadow-[0_0_5px_rgba(95,112,87,0.3)] group-hover:shadow-[0_0_15px_rgba(95,112,87,0.4)] group-hover:border-[#D97706] transition-all duration-300 select-none p-1.5 overflow-hidden">
              <img src="/img/vexta-logo.png" alt="Vexta Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center">
                <span className="font-sans text-sm font-extrabold bg-gradient-to-r from-[#D6C5B3] to-[#D97706] bg-clip-text text-transparent tracking-tight leading-none uppercase">
                  {bridgeName}
                </span>
                <span className="text-[#D97706] animate-blink font-bold text-sm leading-none">_</span>
              </div>
              <span className="font-sans text-[0.5rem] text-[#7C8775] tracking-[0.2em] uppercase mt-0.5 border-t border-[#272D24]/50 pt-0.5 inline-block w-full">
                Zero-Knowledge Relay
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <ul className="flex list-none gap-8 hidden md:flex items-center transition-all duration-300">
              {navLinks.map((link) => {
                const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={`text-xs font-bold tracking-widest transition-colors relative py-1.5 uppercase cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#D97706] hover:after:w-full after:transition-all after:duration-300 ${
                        isActive ? 'text-[#D97706] after:w-full' : 'text-gray-300 hover:text-[#D97706] after:w-0'
                      }`}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-white/10 rounded-xl bg-white/5 text-[#D6C5B3] hover:text-white transition-colors cursor-pointer"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark text-lg' : 'fa-bars text-sm'}`}></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#0C0E0B]/95 backdrop-blur-xl z-[998] flex flex-col justify-center items-center p-6 md:hidden animate-in fade-in duration-200">
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
          </ul>
        </div>
      )}
    </>
  );
}
