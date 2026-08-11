import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

const formatDate = (ts) => {
  if (!ts) return 'RECENT';
  if (typeof ts === 'number') {
    return new Date(ts * 1000).toUTCString();
  }
  return String(ts).endsWith('UTC') ? String(ts) : `${ts} UTC`;
};

export default function AnnouncementsPage() {
  const { announcements } = useApp();
  const [search, setSearch] = useState('');

  const filteredAnnouncements = announcements.filter((ann) => {
    if (!search.trim()) return true;
    return ann.message.toLowerCase().includes(search.toLowerCase().trim());
  });

  return (
    <div className="flex flex-col gap-10 py-4 text-gray-300 min-h-[75vh]">
      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5F7057]/10 via-transparent to-[#D97706]/10 -z-10"></div>
        <div className="text-5xl text-[#D97706]">
          <i className="fa-solid fa-bullhorn animate-float"></i>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
          System Broadcast Dispatches
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          Historical feed of Vexta Bridge server announcements, security updates, protocol deployments, and maintenance dispatches.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0C0E0B]/60 p-4 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></span>
          <span className="font-bold text-white uppercase">BROADCAST PIPE ACTIVE</span>
          <span className="text-[#7C8775]">({announcements.length} Total Dispatches)</span>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C8775]">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BROADCASTS..."
            className="w-full bg-[#151813] border border-white/10 rounded-xl pl-9 pr-8 py-2 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706] placeholder:text-gray-600 uppercase tracking-wider"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Announcements Feed List */}
      <div className="flex flex-col gap-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann, idx) => (
            <div
              key={ann.id || idx}
              className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-5 relative overflow-hidden border border-white/10 hover:border-[#D97706]/40 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[#D97706] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-halved text-xs"></i> [DISPATCH #{announcements.length - idx}]
                  </span>
                  {idx === 0 && (
                    <span className="bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-bold animate-pulse">
                      LATEST RELEASE
                    </span>
                  )}
                </div>
                <span className="text-[#7C8775] font-bold">{formatDate(ann.created_at)}</span>
              </div>

              <div className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans markdown-body">
                <ReactMarkdown>{ann.message}</ReactMarkdown>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1.5 text-green-400 font-bold uppercase">
                  <i className="fa-solid fa-circle-check"></i> SIGNATURE AUTHENTICATED
                </span>
                <span className="text-[#5F7057] uppercase">RSA-OAEP-4096 SIGNED</span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center gap-4">
            <i className="fa-solid fa-bullhorn text-gray-500 text-3xl animate-pulse"></i>
            <div className="text-xs font-mono text-gray-400 uppercase">
              No dispatches found matching "{search}"
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Sync Diagnostics */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
          <span className="inline-block w-1.5 h-3.5 bg-[#D97706]"></span> Real-Time Sync Protocol & Verification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0C0E0B]/80 border border-white/10 p-5 rounded-2xl flex flex-col gap-2 font-mono">
            <span className="text-[9px] uppercase tracking-wider text-[#7C8775] font-bold">Sync Socket status</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase">ACTIVE // LISTENING</span>
            </div>
          </div>
          <div className="bg-[#0C0E0B]/80 border border-white/10 p-5 rounded-2xl flex flex-col gap-2 font-mono">
            <span className="text-[9px] uppercase tracking-wider text-[#7C8775] font-bold">Relay Encryption</span>
            <span className="text-xs font-bold text-[#D6C5B3] uppercase">Mutual signature auth</span>
          </div>
          <div className="bg-[#0C0E0B]/80 border border-white/10 p-5 rounded-2xl flex flex-col gap-2 font-mono">
            <span className="text-[9px] uppercase tracking-wider text-[#7C8775] font-bold">Audit Mode</span>
            <span className="text-xs font-bold text-[#D6C5B3] uppercase">Metadata-blind broadcast</span>
          </div>
        </div>

        <div className="p-4 border border-white/10 bg-[#0C0E0B]/60 text-gray-300 rounded-2xl flex gap-3 text-xs items-start leading-relaxed font-sans">
          <span className="text-base text-[#D97706] shrink-0 mt-0.5">
            <i className="fa-solid fa-circle-info"></i>
          </span>
          <div>
            <strong className="font-bold uppercase tracking-wide text-white block mb-0.5 font-mono">
              Cryptographic Signature Verification
            </strong>
            All system announcements are signed locally by the bridge's private identity key before broadcast transmission. Your Vexta client automatically validates this signature against the cached bridge fingerprint upon envelope arrival, neutralizing active interception/spoofing vectors.
          </div>
        </div>
      </div>
    </div>
  );
}
