import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BentoCard from '../components/ui/BentoCard';
import SectionHeader from '../components/ui/SectionHeader';

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqs, setOpenFaqs] = useState({ 1: true });

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is Vexta Bridge?',
      answer:
        'Vexta Bridge is a metadata-blind WebSocket relay server designed to route end-to-end encrypted envelopes. It does not store message history, log communication metadata, or hold user private keys. It is built to ensure absolute metadata privacy and zero-trust delivery.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Is user registration public or administrative?',
      answer:
        'User accounts are administratively provisioned by server operators. When a profile is created, a secure passcode is generated. Reach out to your systems administrator to obtain provisioning details for your Vexta client.'
    },
    {
      id: 3,
      category: 'security',
      question: 'Can the server read my private messages?',
      answer:
        'No. Payloads are sealed client-side using hybrid encryption (RSA-OAEP-4096 public key encryption and AES-GCM-256 symmetric session keys) before they leave your device. The bridge only processes blind envelope payloads and target public key hashes.'
    },
    {
      id: 4,
      category: 'security',
      question: 'How does the server store offline messages?',
      answer:
        'If a recipient client is offline, the envelope is buffered in volatile RAM or temporary queue buffers. The moment the recipient reconnects and completes the cryptographic challenge, the queued envelope is relayed and immediately flushed from server memory.'
    },
    {
      id: 5,
      category: 'security',
      question: 'How is mutual authentication enforced?',
      answer:
        "Vexta Bridge neutralizes Man-in-the-Middle (MITM) threats by signing challenge nonces using the server's private identity key. Your Vexta client validates this signature against its cached bridge fingerprint. Next, the client signs the challenge nonce with its local RSA private key to authorize the session."
    },
    {
      id: 6,
      category: 'client',
      question: 'Where can I find the server public key fingerprint?',
      answer:
        "The SHA-256 fingerprint of this bridge's public identity key is published in system settings and documentation. You should copy this value and import it into your Vexta mobile or desktop application to verify identity during vault synchronization."
    },
    {
      id: 7,
      category: 'client',
      question: 'What happens if I forget my passcode or lose my local profile?',
      answer:
        'Because of the zero-trust design, the server cannot reset your passcode, recover your keys, or unlock your profile. If you lose your keys or recovery seed, you will permanently lose access to your account and messages. Always keep an offline backup of your client vault.'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Questions', count: faqs.length },
    { key: 'general', label: 'General', count: faqs.filter((f) => f.category === 'general').length },
    { key: 'security', label: 'Security & Keys', count: faqs.filter((f) => f.category === 'security').length },
    { key: 'client', label: 'Client Setup', count: faqs.filter((f) => f.category === 'client').length }
  ];

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allState = {};
    faqs.forEach((f) => (allState[f.id] = true));
    setOpenFaqs(allState);
  };

  const collapseAll = () => {
    setOpenFaqs({});
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const query = search.toLowerCase().trim();
    const matchesQ = !query || faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
    return matchesCat && matchesQ;
  });

  return (
    <div className="flex flex-col gap-10 py-4 text-gray-200 min-h-[75vh] max-w-5xl mx-auto w-full">
      {/* Hero Header Bento */}
      <BentoCard hover={false} className="p-8 md:p-12 text-center flex flex-col items-center gap-5 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-3xl text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <i className="fa-solid fa-circle-question"></i>
        </div>
        <SectionHeader
          tag="// KNOWLEDGE BASE"
          title="Frequently Asked Questions"
          description="Find instant answers regarding zero-knowledge security models, cryptographic key pairs, mutual auth, and client setups."
        />
      </BentoCard>

      {/* Search & Category Filter Toolbar Bento */}
      <BentoCard hover={false} className="p-5 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2.5 font-mono text-xs md:text-sm font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2.5 border ${
                activeCategory === cat.key
                  ? 'bg-[#22C55E] text-black border-[#39FF14] shadow-md'
                  : 'bg-[#060805] text-gray-300 border-[#243022] hover:text-white hover:bg-[#141C13]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  activeCategory === cat.key ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-gray-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & Expand Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <div className="relative w-full lg:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E927F]">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH FAQS..."
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

          <button
            onClick={expandAll}
            className="px-3.5 py-2.5 font-mono text-xs font-bold uppercase border border-[#243022] text-gray-200 hover:text-white hover:bg-[#141C13] rounded-xl transition-all shrink-0 cursor-pointer hidden sm:block"
            title="Expand All Items"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3.5 py-2.5 font-mono text-xs font-bold uppercase border border-[#243022] text-[#7E927F] hover:text-white hover:bg-[#141C13] rounded-xl transition-all shrink-0 cursor-pointer hidden sm:block"
            title="Collapse All Items"
          >
            Collapse All
          </button>
        </div>
      </BentoCard>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openFaqs[faq.id];
            return (
              <div
                key={faq.id}
                className={`solid-panel rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? 'border-[#22C55E]/50 bg-[#101610] shadow-[0_4px_25px_rgba(34,197,94,0.15)]' : 'border-[#243022] hover:border-[#22C55E]/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer group select-none"
                >
                  <span className="text-sm md:text-base font-bold text-white group-hover:text-[#4ADE80] transition-colors flex items-center gap-3">
                    <span className="font-mono text-[#39FF14] font-bold text-xs md:text-sm uppercase shrink-0">
                      [{faq.category}]
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    className={`w-9 h-9 rounded-xl bg-[#060805] border border-[#243022] flex items-center justify-center text-[#22C55E] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#22C55E]/20 border-[#22C55E]/50 text-[#39FF14]' : ''
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[#243022] bg-[#060805] p-6 text-sm md:text-base text-gray-200 leading-relaxed font-sans animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <BentoCard hover={false} className="p-12 items-center justify-center text-center gap-4">
            <i className="fa-solid fa-magnifying-glass text-[#7E927F] text-3xl animate-pulse"></i>
            <div className="text-sm font-mono text-gray-400 uppercase">
              No matching questions found for "{search}"
            </div>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="px-5 py-2.5 font-mono text-xs md:text-sm font-bold uppercase bg-[#22C55E] text-black rounded-xl shadow-md cursor-pointer"
            >
              Reset Search Filter
            </button>
          </BentoCard>
        )}
      </div>

      {/* Direct Manual & Support Banner Bento */}
      <BentoCard className="p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#39FF14] text-2xl shrink-0">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <h3 className="text-lg font-extrabold uppercase tracking-wider text-white font-mono">Need Additional Protocol Details?</h3>
            <p className="text-xs md:text-sm text-gray-300 font-sans">
              Consult the complete technical specifications and client setup field manual in our documentation.
            </p>
          </div>
        </div>
        <Link
          to="/docs"
          className="px-6 py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-black bg-[#22C55E] hover:bg-[#39FF14] rounded-xl transition-all shrink-0 cursor-pointer no-underline flex items-center gap-2 shadow-lg border border-[#39FF14]"
        >
          <span>Open Field Manual</span>
          <i className="fa-solid fa-arrow-right text-xs text-black"></i>
        </Link>
      </BentoCard>
    </div>
  );
}
