import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import BentoCard from '../components/ui/BentoCard';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

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
    <div className="flex flex-col gap-10 py-4 text-gray-200 min-h-[75vh] max-w-5xl mx-auto w-full">
      {/* Hero Header Bento */}
      <BentoCard hover={false} className="p-8 md:p-12 text-center flex flex-col items-center gap-5 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-3xl text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <i className="fa-solid fa-bullhorn"></i>
        </div>
        <SectionHeader
          tag="// SYSTEM FEED"
          title="System Broadcast Dispatches"
          description="Historical feed of Vexta Bridge server announcements, security updates, protocol deployments, and maintenance dispatches."
        />
      </BentoCard>

      {/* Filter Toolbar Bento */}
      <BentoCard hover={false} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs md:text-sm text-gray-300">
          <StatusBadge label="BROADCAST PIPE ACTIVE" variant="neon" pulse={true} />
          <span className="text-[#7E927F] font-bold">({announcements.length} Total Dispatches)</span>
        </div>

        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E927F]">
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BROADCASTS..."
            className="w-full bg-[#060805] border border-[#243022] rounded-xl pl-9 pr-8 py-2.5 font-mono text-xs md:text-sm text-gray-100 focus:outline-none focus:border-[#22C55E] placeholder:text-[#7E927F] uppercase tracking-wider"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E927F] hover:text-white cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          )}
        </div>
      </BentoCard>

      {/* Announcements Feed List */}
      <div className="flex flex-col gap-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann, idx) => (
            <BentoCard
              key={ann.id || idx}
              className="p-7 md:p-9 flex flex-col gap-5 relative overflow-hidden shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-mono border-b border-[#243022] pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-[#39FF14] font-extrabold tracking-wider uppercase flex items-center gap-2 font-mono">
                    <i className="fa-solid fa-shield-halved text-sm"></i> [DISPATCH #{announcements.length - idx}]
                  </span>
                  {idx === 0 && (
                    <StatusBadge label="LATEST RELEASE" variant="neon" />
                  )}
                </div>
                <span className="text-[#7E927F] font-bold">{formatDate(ann.created_at)}</span>
              </div>

              <div className="text-sm md:text-base text-gray-200 leading-relaxed font-sans markdown-body">
                <ReactMarkdown>{ann.message}</ReactMarkdown>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-t border-[#243022] pt-3.5">
                <span className="flex items-center gap-1.5 text-[#39FF14] font-bold uppercase">
                  <i className="fa-solid fa-circle-check"></i> SIGNATURE AUTHENTICATED
                </span>
                <span className="text-[#4ADE80] uppercase font-bold">RSA-OAEP-4096 SIGNED</span>
              </div>
            </BentoCard>
          ))
        ) : (
          <BentoCard hover={false} className="p-12 items-center justify-center text-center gap-4">
            <i className="fa-solid fa-bullhorn text-[#7E927F] text-3xl animate-pulse"></i>
            <div className="text-sm font-mono text-gray-400 uppercase">
              No dispatches found matching "{search}"
            </div>
          </BentoCard>
        )}
      </div>

      {/* Broadcast Sync Diagnostics Bento */}
      <BentoCard hover={false} className="p-7 md:p-9 flex flex-col gap-6 shadow-xl">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
          <span className="inline-block w-2 h-4 bg-[#22C55E]"></span> Real-Time Sync Protocol &amp; Verification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#060805] border border-[#243022] p-5 rounded-2xl flex flex-col gap-2.5 font-mono">
            <span className="text-xs uppercase tracking-wider text-[#7E927F] font-bold">Sync Socket status</span>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39FF14]"></span>
              </span>
              <span className="text-xs md:text-sm font-bold text-white uppercase">ACTIVE // LISTENING</span>
            </div>
          </div>
          <div className="bg-[#060805] border border-[#243022] p-5 rounded-2xl flex flex-col gap-2.5 font-mono">
            <span className="text-xs uppercase tracking-wider text-[#7E927F] font-bold">Relay Encryption</span>
            <span className="text-xs md:text-sm font-bold text-[#4ADE80] uppercase">Mutual signature auth</span>
          </div>
          <div className="bg-[#060805] border border-[#243022] p-5 rounded-2xl flex flex-col gap-2.5 font-mono">
            <span className="text-xs uppercase tracking-wider text-[#7E927F] font-bold">Audit Mode</span>
            <span className="text-xs md:text-sm font-bold text-[#4ADE80] uppercase">Metadata-blind broadcast</span>
          </div>
        </div>

        <div className="p-5 border border-[#243022] bg-[#060805] text-gray-300 rounded-2xl flex gap-4 text-xs md:text-sm items-start leading-relaxed font-sans">
          <span className="text-lg text-[#39FF14] shrink-0 mt-0.5">
            <i className="fa-solid fa-circle-info"></i>
          </span>
          <div>
            <strong className="font-bold uppercase tracking-wide text-white block mb-1 font-mono text-sm">
              Cryptographic Signature Verification
            </strong>
            All system announcements are signed locally by the bridge's private identity key before broadcast transmission. Your Vexta client automatically validates this signature against the cached bridge fingerprint upon envelope arrival, neutralizing active interception/spoofing vectors.
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
