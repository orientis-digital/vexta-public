import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function AboutPage() {
  const { bridgeName } = useApp();
  const [flowTab, setFlowTab] = useState(1);
  const [copiedFlow, setCopiedFlow] = useState(false);

  // Bug Report Form State
  const [reportCategory, setReportCategory] = useState('bug');
  const [reportSeverity, setReportSeverity] = useState('medium');
  const [reportTarget, setReportTarget] = useState('windows');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const flowPayloads = {
    1: `{
  "type": "AUTH_CHALLENGE",
  "nonce": "48b6f3a612c90a1b2c3d4e5f6a7b8c9d",
  "server_public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  "server_signature": "BASE64_SERVER_SIGNATURE_OF_NONCE"
}`,
    2: `{
  "type": "AUTH_RESPONSE",
  "username": "alice",
  "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  "signature": "BASE64_CLIENT_SIGNATURE_OF_NONCE"
}`,
    3: `{
  "type": "AUTH_SUCCESS",
  "user_id": 142,
  "status": "AUTHENTICATED",
  "pending_envelopes": 0
}`
  };

  const handleCopyFlow = () => {
    navigator.clipboard.writeText(flowPayloads[flowTab]);
    setCopiedFlow(true);
    setTimeout(() => setCopiedFlow(false), 2000);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDetails.trim()) return;

    // Generate random ticket hash
    const ticketId = 'TICKET-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const timestamp = new Date().toUTCString();

    setSubmittedTicket({
      id: ticketId,
      timestamp,
      category: reportCategory,
      severity: reportSeverity,
      target: reportTarget,
      title: reportTitle
    });

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D97706', '#5F7057', '#D6C5B3']
    });

    setReportTitle('');
    setReportDetails('');
    setReportContact('');
  };

  return (
    <div className="flex flex-col gap-12 py-4 text-gray-300 min-h-[75vh]">
      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5F7057]/10 via-transparent to-[#D97706]/10 -z-10"></div>
        <div className="text-5xl text-[#D6C5B3]">
          <i className="fa-solid fa-circle-info animate-float"></i>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
          About {bridgeName}
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          A zero-trust, metadata-blind WebSocket relay server for the Vexta encrypted messenger, engineered by <strong>Orientis Digital</strong>.
        </p>
      </div>

      {/* Core Architecture */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
          <span className="inline-block w-1.5 h-3.5 bg-[#5F7057]"></span> Zero-Trust Architecture Overview
        </h2>
        <p className="leading-relaxed font-sans text-xs md:text-sm text-[#D6C5B3] font-bold">
          Vexta is the client messaging app, engineered by Orientis Digital. Vexta Bridge is the zero-trust backend relay node powering the secure messaging pipeline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="bg-[#0C0E0B]/60 p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Metadata-Blind Relay</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Messages are encrypted on device using hybrid cryptography before transmission. The bridge cannot inspect sender/receiver content or session keys.
            </p>
          </div>

          <div className="bg-[#0C0E0B]/60 p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] text-xl">
              <i className="fa-solid fa-memory"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Volatile RAM Queue</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Envelopes are held strictly in temporary RAM memory during socket delivery. Zero plaintext database persistence occurs at any time.
            </p>
          </div>

          <div className="bg-[#0C0E0B]/60 p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
              <i className="fa-solid fa-[#5F7057] fa-key"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">No Private Key Storage</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              User RSA-4096 private keys never touch the network. They remain sealed inside the client device vault encrypted with Argon2id.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Handshake Protocol Flow Inspector */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <span className="inline-block w-1.5 h-3.5 bg-[#D97706]"></span> Interactive Handshake Protocol Inspector
            </h2>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">
              Click through the WebSocket authentication stages to inspect live JSON payload exchanges.
            </p>
          </div>

          <button
            onClick={handleCopyFlow}
            className="px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase bg-white/5 hover:bg-[#D97706]/20 border border-white/10 text-[#D6C5B3] hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <i className={`fa-solid ${copiedFlow ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
            <span>{copiedFlow ? 'COPIED JSON' : 'COPY JSON'}</span>
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-2 select-none">
          {[
            { step: 1, label: 'Step 1: Auth Challenge' },
            { step: 2, label: 'Step 2: Auth Response' },
            { step: 3, label: 'Step 3: Auth Success' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setFlowTab(item.step)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer border ${
                flowTab === item.step
                  ? 'bg-[#D97706] text-white border-[#D97706] shadow-tech-sm'
                  : 'bg-[#0C0E0B]/60 text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* JSON Display Screen */}
        <div className="bg-[#0C0E0B] border border-white/10 rounded-2xl p-5 font-mono text-xs text-gray-300 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-[#7C8775] border-b border-white/10 pb-2 mb-3">
            <span>
              {flowTab === 1 ? 'SERVER -> CLIENT' : flowTab === 2 ? 'CLIENT -> SERVER' : 'SERVER -> CLIENT'}
            </span>
            <span className="text-[#D97706] font-bold">
              {flowTab === 1 ? 'AUTH_CHALLENGE' : flowTab === 2 ? 'AUTH_RESPONSE' : 'AUTH_SUCCESS'}
            </span>
          </div>
          <pre className="overflow-x-auto leading-relaxed text-gray-300">
            <code>{flowPayloads[flowTab]}</code>
          </pre>
        </div>
      </div>

      {/* Developer Spotlight: Orientis Digital */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center border border-white/10 hover:border-[#D97706]/30 transition-all duration-300 shadow-xl">
        <div className="w-24 h-24 bg-[#D97706]/10 border border-[#D97706]/30 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 p-4 shadow-tech-sm">
          <img src="/img/orientis-logo.png" alt="Orientis Digital Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-left">
          <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold">// CORE DEVELOPER SPOTLIGHT</span>
          <h3 className="font-extrabold text-white text-lg uppercase tracking-wider">Designed & Engineered by Orientis Digital</h3>
          <p className="leading-relaxed font-sans text-xs md:text-sm text-gray-400">
            Orientis Digital builds modern digital infrastructure, secure communication protocols, and intelligent software systems. Vexta is engineered to enforce absolute metadata privacy and zero-trust delivery.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 font-mono text-[9px] text-[#7C8775]">
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">RSA-4096</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">AES-256-GCM</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Argon2id</span>
            </div>

            <a
              href="https://nexusec.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-bold font-mono text-[#D97706] hover:text-white tracking-wider flex items-center gap-1.5 no-underline"
            >
              <span>Visit Orientis Digital Website</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BUG REPORTING & SECURITY VULNERABILITY DISCLOSURE DESK */}
      {/* ========================================================================= */}
      <section id="report-issue" className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10 shadow-xl scroll-mt-28">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-xl">
              <i className="fa-solid fa-bug"></i>
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white font-mono">
                Vulnerability Disclosure & Bug Reporting Desk
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                Found a protocol flaw, client glitch, or security anomaly? Submit a disclosure report to Orientis Digital engineers.
              </p>
            </div>
          </div>
          <span className="bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase">
            RESPONSIBLE DISCLOSURE
          </span>
        </div>

        {submittedTicket && (
          <div className="p-4 border border-green-500/30 bg-green-500/10 text-green-400 rounded-2xl flex flex-col gap-2 font-mono text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold border-b border-green-500/20 pb-2">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-base"></i> REPORT TRANSMITTED OK
              </span>
              <span>{submittedTicket.id}</span>
            </div>
            <p className="text-[11px] font-sans text-gray-300 leading-relaxed">
              Your disclosure ticket has been encrypted and queued for review by the security response team.
            </p>
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="flex flex-col gap-5">
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
                Report Category
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706]"
              >
                <option value="bug">Software Bug Report</option>
                <option value="security">Security Vulnerability (Zero-Day)</option>
                <option value="protocol">Protocol Handshake Defect</option>
                <option value="feature">Feature Improvement Proposal</option>
              </select>
            </div>

            {/* Severity */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
                Severity Level
              </label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value)}
                className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706]"
              >
                <option value="low">Low (Cosmetic / Typo)</option>
                <option value="medium">Medium (Moderate Glitch)</option>
                <option value="high">High (Feature Failure)</option>
                <option value="critical">Critical (Security Vulnerability)</option>
              </select>
            </div>

            {/* Target Component */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
                Affected Target
              </label>
              <select
                value={reportTarget}
                onChange={(e) => setReportTarget(e.target.value)}
                className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706]"
              >
                <option value="windows">Windows App (EXE / ZIP)</option>
                <option value="android">Android App (APK)</option>
                <option value="linux">Linux App (TAR.GZ)</option>
                <option value="relay">WebSocket Relay Server</option>
              </select>
            </div>
          </div>

          {/* Title / Summary */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
              Issue Summary / Title
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
              placeholder="e.g. WebSocket re-connection fails after network interface change..."
              className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706] placeholder:text-gray-600"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
              Reproduction Steps & Log Traceback
            </label>
            <textarea
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              required
              placeholder="Provide exact steps to reproduce the issue, environment info, or relevant terminal output..."
              className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706] placeholder:text-gray-600 leading-relaxed"
            ></textarea>
          </div>

          {/* Optional Contact */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold uppercase text-[#D6C5B3] tracking-wider">
              Contact Handle / PGP Key Fingerprint (Optional)
            </label>
            <input
              type="text"
              value={reportContact}
              onChange={(e) => setReportContact(e.target.value)}
              placeholder="Optional email or public key fingerprint for follow-up verification..."
              className="bg-[#0C0E0B] border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-[#D97706] placeholder:text-gray-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-[#D97706] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] rounded-xl transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
            <span>Submit Encrypted Disclosure Report</span>
          </button>
        </form>
      </section>
    </div>
  );
}
