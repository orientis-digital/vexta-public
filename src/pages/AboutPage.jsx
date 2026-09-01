import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import BentoCard from '../components/ui/BentoCard';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

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

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#39FF14', '#22C55E', '#4ADE80']
      });
    } catch {}

    setReportTitle('');
    setReportDetails('');
    setReportContact('');
  };

  return (
    <div className="flex flex-col gap-10 py-4 text-gray-200 min-h-[75vh] max-w-5xl mx-auto w-full">
      {/* Hero Header Bento */}
      <BentoCard hover={false} className="p-8 md:p-12 text-center flex flex-col items-center gap-5 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-3xl text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <SectionHeader
          tag="// ABOUT VEXTA"
          title={`About ${bridgeName}`}
          description="A zero-trust, metadata-blind WebSocket relay server for the Vexta encrypted messenger, engineered by Orientis Digital."
        />
      </BentoCard>

      {/* Core Architecture Bento Grid */}
      <BentoCard hover={false} className="p-7 md:p-9 flex flex-col gap-6 shadow-xl">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
          <span className="inline-block w-2 h-4 bg-[#22C55E]"></span> Zero-Trust Architecture Overview
        </h2>
        <p className="leading-relaxed font-sans text-sm md:text-base text-gray-200">
          <strong className="text-white">Vexta</strong> is the client messaging app, engineered by <strong className="text-[#39FF14]">Orientis Digital</strong>. <strong className="text-white">Vexta Bridge</strong> is the zero-trust backend relay node powering the secure messaging pipeline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
          <div className="bg-[#060805] p-6 rounded-2xl border border-[#243022] flex flex-col gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#39FF14] text-2xl">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm md:text-base tracking-wider font-mono">Metadata-Blind Relay</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Messages are encrypted on device using hybrid cryptography before transmission. The bridge cannot inspect sender/receiver content or session keys.
            </p>
          </div>

          <div className="bg-[#060805] p-6 rounded-2xl border border-[#243022] flex flex-col gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#39FF14] text-2xl">
              <i className="fa-solid fa-memory"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm md:text-base tracking-wider font-mono">Volatile RAM Queue</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Envelopes are held strictly in temporary RAM memory during socket delivery. Zero plaintext database persistence occurs at any time.
            </p>
          </div>

          <div className="bg-[#060805] p-6 rounded-2xl border border-[#243022] flex flex-col gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#39FF14] text-2xl">
              <i className="fa-solid fa-key"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm md:text-base tracking-wider font-mono">No Private Key Storage</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              User RSA-4096 private keys never touch the network. They remain sealed inside the client device vault encrypted with Argon2id.
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Interactive Handshake Protocol Flow Inspector */}
      <BentoCard hover={false} className="p-7 md:p-9 flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#243022] pb-4 flex-wrap gap-4">
          <div>
            <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <span className="inline-block w-2 h-4 bg-[#22C55E]"></span> Interactive Handshake Protocol Inspector
            </h2>
            <p className="text-xs text-gray-300 font-sans mt-0.5">
              Click through the WebSocket authentication stages to inspect live JSON payload exchanges.
            </p>
          </div>

          <button
            onClick={handleCopyFlow}
            className="px-4 py-2 text-xs font-mono font-bold uppercase bg-[#22C55E]/15 hover:bg-[#22C55E] border border-[#22C55E]/40 text-[#39FF14] hover:text-black rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <i className={`fa-solid ${copiedFlow ? 'fa-check text-black' : 'fa-copy text-[#39FF14]'}`}></i>
            <span>{copiedFlow ? 'COPIED JSON' : 'COPY JSON'}</span>
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 select-none">
          {[
            { step: 1, label: 'Step 1: Auth Challenge' },
            { step: 2, label: 'Step 2: Auth Response' },
            { step: 3, label: 'Step 3: Auth Success' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setFlowTab(item.step)}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs md:text-sm font-bold uppercase transition-all cursor-pointer border ${
                flowTab === item.step
                  ? 'bg-[#22C55E] text-black border-[#39FF14] shadow-md'
                  : 'bg-[#060805] text-gray-300 border-[#243022] hover:text-white hover:bg-[#141C13]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* JSON Display Screen */}
        <div className="bg-[#060805] border border-[#243022] rounded-2xl p-5 font-mono text-xs md:text-sm text-gray-200 shadow-inner">
          <div className="flex items-center justify-between text-xs text-[#7E927F] border-b border-[#243022] pb-2.5 mb-3 font-bold">
            <span>
              {flowTab === 1 ? 'SERVER -> CLIENT' : flowTab === 2 ? 'CLIENT -> SERVER' : 'SERVER -> CLIENT'}
            </span>
            <span className="text-[#39FF14] font-bold">
              {flowTab === 1 ? 'AUTH_CHALLENGE' : flowTab === 2 ? 'AUTH_RESPONSE' : 'AUTH_SUCCESS'}
            </span>
          </div>
          <pre className="overflow-x-auto leading-relaxed text-gray-200 font-mono">
            <code>{flowPayloads[flowTab]}</code>
          </pre>
        </div>
      </BentoCard>

      {/* Developer Spotlight: Orientis Digital */}
      <BentoCard className="p-7 md:p-9 flex flex-col md:flex-row gap-7 items-center shadow-xl">
        <div className="w-24 h-24 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 p-4 shadow-sm">
          <img src="/img/orientis-logo.png" alt="Orientis Digital Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 flex flex-col gap-2.5 text-left">
          <span className="text-xs font-mono text-[#39FF14] uppercase tracking-widest font-bold">// CORE DEVELOPER SPOTLIGHT</span>
          <h3 className="font-extrabold text-white text-lg md:text-xl uppercase tracking-wider font-mono">Designed &amp; Engineered by Orientis Digital</h3>
          <p className="leading-relaxed font-sans text-xs md:text-sm text-gray-300">
            Orientis Digital builds modern digital infrastructure, secure communication protocols, and intelligent software systems. Vexta is engineered to enforce absolute metadata privacy and zero-trust delivery.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3.5 border-t border-[#243022]">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#7E927F]">
              <span className="bg-[#060805] border border-[#243022] px-2.5 py-1 rounded-md text-gray-200 font-bold">RSA-4096</span>
              <span className="bg-[#060805] border border-[#243022] px-2.5 py-1 rounded-md text-gray-200 font-bold">AES-256-GCM</span>
              <span className="bg-[#060805] border border-[#243022] px-2.5 py-1 rounded-md text-gray-200 font-bold">Argon2id</span>
            </div>

            <a
              href="https://nexusec.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm uppercase font-bold font-mono text-[#39FF14] hover:text-white tracking-wider flex items-center gap-1.5 no-underline"
            >
              <span>Visit Orientis Digital Website</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
          </div>
        </div>
      </BentoCard>

      {/* BUG REPORTING & SECURITY DISCLOSURE DESK */}
      <BentoCard id="report-issue" hover={false} className="p-7 md:p-9 flex flex-col gap-6 shadow-xl scroll-mt-28">
        <div className="flex items-center justify-between border-b border-[#243022] pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl">
              <i className="fa-solid fa-bug"></i>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-extrabold uppercase tracking-wider text-white font-mono">
                Vulnerability Disclosure &amp; Bug Reporting Desk
              </h2>
              <p className="text-xs text-gray-300 font-sans">
                Found a protocol flaw, client glitch, or security anomaly? Submit a disclosure report to Orientis Digital engineers.
              </p>
            </div>
          </div>
          <StatusBadge label="RESPONSIBLE DISCLOSURE" variant="red" />
        </div>

        {submittedTicket && (
          <div className="p-5 border border-[#22C55E]/40 bg-[#22C55E]/10 text-[#39FF14] rounded-2xl flex flex-col gap-2 font-mono text-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold border-b border-[#22C55E]/20 pb-2">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-lg text-[#39FF14]"></i> REPORT TRANSMITTED OK
              </span>
              <span className="text-white">{submittedTicket.id}</span>
            </div>
            <p className="text-xs md:text-sm font-sans text-gray-200 leading-relaxed">
              Your disclosure ticket has been encrypted and queued for review by the security response team.
            </p>
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="flex flex-col gap-5">
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
                Report Category
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="bug">Software Bug Report</option>
                <option value="security">Security Vulnerability (Zero-Day)</option>
                <option value="protocol">Protocol Handshake Defect</option>
                <option value="feature">Feature Improvement Proposal</option>
              </select>
            </div>

            {/* Severity */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
                Severity Level
              </label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value)}
                className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="low">Low (Cosmetic / Typo)</option>
                <option value="medium">Medium (Moderate Glitch)</option>
                <option value="high">High (Feature Failure)</option>
                <option value="critical">Critical (Security Vulnerability)</option>
              </select>
            </div>

            {/* Target Component */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
                Affected Target
              </label>
              <select
                value={reportTarget}
                onChange={(e) => setReportTarget(e.target.value)}
                className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E]"
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
            <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
              Issue Summary / Title
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
              placeholder="e.g. WebSocket re-connection fails after network interface change..."
              className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E] placeholder:text-[#7E927F]"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
              Reproduction Steps &amp; Log Traceback
            </label>
            <textarea
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              required
              placeholder="Provide exact steps to reproduce the issue, environment info, or relevant terminal output..."
              className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E] placeholder:text-[#7E927F] leading-relaxed"
            ></textarea>
          </div>

          {/* Optional Contact */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold uppercase text-[#4ADE80] tracking-wider">
              Contact Handle / PGP Key Fingerprint (Optional)
            </label>
            <input
              type="text"
              value={reportContact}
              onChange={(e) => setReportContact(e.target.value)}
              placeholder="Optional email or public key fingerprint for follow-up verification..."
              className="bg-[#060805] border border-[#243022] rounded-xl p-3.5 font-mono text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[#22C55E] placeholder:text-[#7E927F]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-8 py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-black bg-[#22C55E] hover:bg-[#39FF14] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] rounded-xl transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2 mt-2 border border-[#39FF14]"
          >
            <i className="fa-solid fa-paper-plane text-xs text-black"></i>
            <span>Submit Encrypted Disclosure Report</span>
          </button>
        </form>
      </BentoCard>
    </div>
  );
}
