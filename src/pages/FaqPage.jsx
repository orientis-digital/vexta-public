import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="flex flex-col gap-10 py-4 text-gray-300 min-h-[75vh]">
      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5F7057]/10 via-transparent to-[#D97706]/10 -z-10"></div>
        <div className="text-5xl text-[#D97706]">
          <i className="fa-solid fa-circle-question animate-float"></i>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          Find instant answers regarding zero-knowledge security models, cryptographic key pairs, mutual auth, and client setups.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#0C0E0B]/60 p-4 rounded-3xl border border-white/10 shadow-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === cat.key
                  ? 'bg-[#D97706] text-white shadow-tech-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] ${
                  activeCategory === cat.key ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
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
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C8775]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH FAQS..."
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

          <button
            onClick={expandAll}
            className="px-3 py-2 font-mono text-[10px] font-bold uppercase border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl transition-all shrink-0 cursor-pointer hidden sm:block"
            title="Expand All Items"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 font-mono text-[10px] font-bold uppercase border border-white/10 text-gray-400 hover:bg-white/5 rounded-xl transition-all shrink-0 cursor-pointer hidden sm:block"
            title="Collapse All Items"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openFaqs[faq.id];
            return (
              <div
                key={faq.id}
                className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? 'border-[#D97706]/40 bg-[#151813]/90 shadow-xl' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer group"
                >
                  <span className="text-xs md:text-sm font-bold text-white group-hover:text-[#D6C5B3] transition-colors flex items-center gap-3">
                    <span className="font-mono text-[#D97706] font-bold text-xs uppercase shrink-0">
                      [{faq.category}]
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D97706] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#D97706]/20 border-[#D97706]/40 text-white' : ''
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 bg-[#0C0E0B]/60 p-6 text-xs md:text-sm text-gray-300 leading-relaxed font-sans animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center gap-4">
            <i className="fa-solid fa-magnifying-glass text-gray-500 text-3xl animate-pulse"></i>
            <div className="text-xs font-mono text-gray-400 uppercase">
              No matching questions found for "{search}"
            </div>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 font-mono text-xs font-bold uppercase bg-[#D97706] text-white rounded-xl shadow-tech-sm cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Direct Manual & Support Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-2xl shrink-0">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Need Additional Protocol Details?</h3>
            <p className="text-xs text-gray-400 font-sans">
              Consult the complete technical specifications and client setup field manual in our documentation.
            </p>
          </div>
        </div>
        <Link
          to="/docs"
          className="px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white bg-[#5F7057] hover:bg-[#5F7057]/80 rounded-xl transition-all shrink-0 cursor-pointer no-underline flex items-center gap-2 shadow-tech-sm"
        >
          <span>Open Field Manual</span>
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      </div>
    </div>
  );
}
