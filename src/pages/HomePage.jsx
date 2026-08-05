import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const {
    totalUsers,
    onlineUsers
  } = useApp();

  // Typewriter effect state
  const phrases = [
    'RSA-4096 Asymmetric Identity Authentication',
    'Blind Envelope Routing Protocol (Zero Metadata Retention)',
    'Real-Time Peer-to-Peer WebRTC Voice & Video Calling',
    'Binary MessagePack WebSocket Framing',
    'Client-Side AES-256-GCM Payload Encryption',
    'Messenger-Style Real-Time Presence Engine'
  ];
  const [typewriterText, setTypewriterText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timer;

    if (!isDeleting && charIdx < currentPhrase.length) {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, 60);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2800);
    } else if (isDeleting && charIdx > 0) {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 25);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx]);

  // Simulator state
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('all');
  const simTimeoutRef = useRef(null);

  const addLog = (text, type) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Math.random(), timestamp, text, type }, ...prev.slice(0, 39)]);
  };

  const runPhaseEffects = (p) => {
    if (p === 0) {
      addLog('SYSTEM READY // STANDBY FOR ENVELOPE ROUTING DEMO', 'info');
    } else if (p === 1) {
      addLog('Alice: Drafted message plaintext = "Hello Bob! Key exchange complete."', 'info');
      addLog('Alice: Generated ephemeral session key (AES-256-GCM). Sealed payload locally.', 'success');
      addLog('Alice: Encrypted AES key using Bob\'s RSA-4096 public key (RSA-OAEP).', 'success');
    } else if (p === 2) {
      addLog('Alice: Transmitting 512-byte binary envelope payload to Vexta Bridge over WSS...', 'info');
      addLog('Network: Upload pipeline active. Zero server headers injected.', 'warning');
    } else if (p === 3) {
      addLog('Server: Envelope received. Target hash: SHA-256(Bob\'s PubKey).', 'info');
      addLog('Server: METADATA BLIND CHECK PASS - Payload is AES-GCM locked. Relay cannot inspect body.', 'danger');
      addLog('Server: Envelope buffered in volatile RAM memory (Zero Disk Storage).', 'success');
    } else if (p === 4) {
      addLog('Bob: Socket connected. Emitted challenge nonce to server.', 'info');
      addLog('Bob: Signed challenge locally with local RSA-4096 private key.', 'info');
      addLog('Server: Signature verified against Bob\'s public key identity. Session authenticated.', 'success');
    } else if (p === 5) {
      addLog('Server: Flushed RAM queue. Relaying blind envelope directly to Bob\'s socket.', 'info');
      addLog('Bob: Received envelope. Decrypted session key using private RSA key.', 'success');
      addLog('Bob: Decrypted payload. Plaintext = "Hello Bob! Key exchange complete."', 'success');
    }
  };

  useEffect(() => {
    addLog('SYSTEM INITIALIZED // BLIND WEBSOCKET RELAY OPERATIONAL', 'info');
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPhase((prev) => {
          const next = (prev + 1) % 6;
          runPhaseEffects(next);
          return next;
        });
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerSimulation = () => {
    setIsPlaying(false);
    setPhase(0);
    setLogs([]);
    addLog('MANUAL SIMULATION INITIATED // SYSTEM RESET', 'info');

    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);

    setTimeout(() => {
      setPhase(1);
      runPhaseEffects(1);

      let step = 2;
      const runSteps = () => {
        simTimeoutRef.current = setTimeout(() => {
          setPhase(step);
          runPhaseEffects(step);
          step++;
          if (step <= 5) {
            runSteps();
          }
        }, 3200);
      };
      runSteps();
    }, 400);
  };

  const jumpToPhase = (p) => {
    setIsPlaying(false);
    setPhase(p);
    runPhaseEffects(p);
  };

  const togglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    addLog(nextPlay ? 'RESUMED AUTOMATIC SIMULATION LOOP' : 'PAUSED SIMULATION LOOP', 'warning');
  };

  const resetSimulation = () => {
    setPhase(0);
    setLogs([]);
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    addLog('SYSTEM RESET // STANDBY', 'info');
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="flex flex-col gap-24 py-4">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center text-center gap-8 py-10 relative overflow-hidden">
        {/* Main Title */}
        <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] font-extrabold tracking-tight leading-[1.02] text-white uppercase max-w-5xl">
          Zero-Knowledge.<br />
          <span className="bg-gradient-to-r from-[#D6C5B3] via-[#D97706] to-[#5F7057] bg-clip-text text-transparent">
            Blind Envelope Routing Server.
          </span>
        </h1>

        {/* Typewriter Line */}
        <div className="flex items-center justify-center gap-2 h-8 font-mono text-sm md:text-base text-gray-300 font-bold bg-[#151813]/80 border border-white/5 px-6 py-1.5 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="typewriter text-[#D6C5B3]">{typewriterText}</span>
        </div>

        {/* Hero Paragraph & Specs */}
        <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-3xl font-sans border border-[#293226] p-6 bg-[#141813] rounded-2xl shadow-xl">
          &gt; Vexta is a metadata-blind WebSocket relay node engineered by <strong>Orientis Digital</strong>. Messages are sealed locally on end devices using hybrid cryptography (RSA-4096 + AES-GCM-256) before entering the network pipeline. The relay holds <strong>zero database storage for plaintexts</strong>, <strong>no private keys</strong>, and <strong>no metadata tracking</strong>.
        </p>

        {/* Primary CTA Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-2">
          <Link
            to="/downloads"
            className="px-8 py-4 font-extrabold transition-all duration-300 text-xs bg-gradient-to-r from-[#5F7057] to-[#D97706] text-white hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:-translate-y-1 uppercase tracking-widest rounded-xl cursor-pointer select-none flex items-center gap-2"
          >
            <i className="fa-solid fa-download text-sm"></i> Download Client Installer
          </Link>
          <a
            href="#demo-simulator"
            className="px-8 py-4 font-bold transition-all duration-300 text-xs bg-[#151813] text-white border border-[#D97706]/40 hover:border-[#D97706] hover:bg-[#D97706]/15 uppercase tracking-widest rounded-xl select-none flex items-center gap-2 shadow-tech-sm"
          >
            <i className="fa-solid fa-play text-sm text-[#D97706]"></i> Explore Live Simulator
          </a>
          <Link
            to="/docs"
            className="px-8 py-4 font-bold transition-all duration-300 text-xs bg-transparent text-gray-300 border border-white/10 hover:border-[#5F7057] hover:bg-[#5F7057]/10 uppercase tracking-widest rounded-xl select-none flex items-center gap-2"
          >
            <i className="fa-solid fa-book-open text-sm text-[#D6C5B3]"></i> Field Manual & Specs
          </Link>
        </div>

        {/* Top Telemetry Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-6 select-none">
          <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
            <span className="text-xl font-extrabold font-mono text-white tracking-tight">{onlineUsers} Pipes</span>
            <span className="text-[9px] uppercase tracking-widest text-[#7C8775] font-mono mt-0.5">Active WebSocket Sockets</span>
          </div>
          <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
            <span className="text-xl font-extrabold font-mono text-[#D6C5B3] tracking-tight">{totalUsers} Identities</span>
            <span className="text-[9px] uppercase tracking-widest text-[#7C8775] font-mono mt-0.5">RSA-4096 Public Profiles</span>
          </div>
          <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
            <span className="text-xl font-extrabold font-mono text-[#D97706] tracking-tight">100% Blind</span>
            <span className="text-[9px] uppercase tracking-widest text-[#7C8775] font-mono mt-0.5">Zero Plaintext Logging</span>
          </div>
          <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
            <span className="text-xl font-extrabold font-mono text-green-400 tracking-tight">0 Disk Payload</span>
            <span className="text-[9px] uppercase tracking-widest text-[#7C8775] font-mono mt-0.5">Volatile RAM Queue</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DEDICATED FULL-WIDTH DEMO SIMULATION SECTION */}
      {/* ========================================================================= */}
      <section id="demo-simulator" className="flex flex-col gap-8 scroll-mt-28">
        {/* Section Title Header */}
        <div className="flex flex-col gap-2 text-center max-w-3xl mx-auto">
          <span className="text-[#D97706] text-xs font-bold uppercase tracking-widest font-mono">
            // INTERACTIVE SHOWCASE & ARCHITECTURE DEMO
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white font-sans">
            Cryptographic Packet Routing Engine
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
            Observe in real-time how end-to-end encrypted envelopes travel across Vexta Relay Server without disclosing plaintexts, contact structures, or session keys.
          </p>
        </div>

        {/* Expanded Simulator Main Card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            {/* Phase Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0C0E0B]/60 p-1.5 rounded-xl border border-white/5">
              {[
                { p: 0, label: '0. Standby' },
                { p: 1, label: '1. Local Encrypt' },
                { p: 2, label: '2. Transmit Envelope' },
                { p: 3, label: '3. RAM Blind Check' },
                { p: 4, label: '4. Challenge Auth' },
                { p: 5, label: '5. Decrypt Payload' }
              ].map((item) => (
                <button
                  key={item.p}
                  onClick={() => jumpToPhase(item.p)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    phase === item.p
                      ? 'bg-[#D97706] text-white shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={triggerSimulation}
                className="px-4 py-2 border border-[#D97706] text-[#D97706] bg-[#D97706]/10 hover:bg-[#D97706]/25 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-tech-sm"
              >
                <i className="fa-solid fa-play text-xs"></i> Simulate Full Lifecycle
              </button>
              <button
                onClick={togglePlay}
                className={`px-4 py-2 border rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isPlaying
                    ? 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                    : 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20'
                }`}
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-circle-play'}`}></i>
                <span>{isPlaying ? 'Pause Auto-Loop' : 'Auto-Play Loop'}</span>
              </button>
              <button
                onClick={resetSimulation}
                className="px-3.5 py-2 border border-white/10 text-gray-400 bg-transparent hover:bg-white/5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Expanded 3-Node Topology Stage */}
          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-6 bg-[#0C0E0B]/80 rounded-2xl p-6 md:p-8 overflow-hidden border border-white/10 min-h-[380px]">
            <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none"></div>

            {/* Node 1: Client A (Alice - Sender) */}
            <div
              className={`w-full md:w-[30%] flex flex-col items-center border p-5 rounded-2xl relative z-10 transition-all duration-500 select-none ${
                phase === 1 || phase === 2 ? 'border-[#D97706] bg-[#D97706]/10 shadow-[0_0_20px_rgba(217,119,6,0.2)]' : 'border-white/10 bg-[#151813]/60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl border border-[#5F7057]/40 flex items-center justify-center text-xl mb-2 transition-all ${
                  phase === 1 || phase === 2 ? 'bg-[#D97706]/25 text-[#D97706] scale-105' : 'bg-[#5F7057]/10 text-[#D6C5B3]'
                }`}
              >
                <i className="fa-solid fa-desktop"></i>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D6C5B3] font-mono">Client A (Alice)</span>
              <span className="text-[9px] text-[#7C8775] font-mono uppercase mb-2">Sender Terminal</span>

              {/* Alice Outbox Box */}
              <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[9px] font-mono leading-relaxed flex flex-col gap-2 flex-1 justify-between">
                <div className="flex items-center justify-between text-[#7C8775] border-b border-white/10 pb-1">
                  <span>OUTBOX QUEUE</span>
                  <span
                    className={`text-[#D97706] uppercase tracking-wider text-[8px] font-bold ${
                      phase >= 1 ? 'animate-pulse' : ''
                    }`}
                  >
                    {phase === 0 ? 'IDLE' : phase === 1 ? 'ENCRYPTING' : 'TRANSMITTED'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#7C8775]">Plaintext:</span>
                  <span className="text-white font-bold bg-white/5 p-1 rounded">"Hello Bob! Key exchange complete."</span>
                </div>
                <div className="flex flex-col gap-0.5 border-t border-white/10 pt-1">
                  <span className="text-[#7C8775]">Sealed Envelope:</span>
                  <span className="text-[#D6C5B3] break-all font-bold">
                    {phase >= 1 ? '0x8f4b...aes_gcm_sealed_rsa_4096' : '[Waiting for payload]'}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between border-t border-white/10 pt-1.5 text-[8px] ${
                    phase >= 1 ? 'text-[#D97706] font-bold' : 'text-[#7C8775]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <i className={`fa-solid ${phase >= 1 ? 'fa-lock' : 'fa-lock-open'}`}></i>
                    <span>{phase >= 1 ? 'AES-GCM SECURE' : 'KEYS READY'}</span>
                  </span>
                  <span>RSA-OAEP-4096</span>
                </div>
              </div>
            </div>

            {/* Cable Left (Alice -> Server) */}
            <div className="hidden md:flex flex-1 items-center justify-center relative mx-2 z-10">
              <svg className="w-full h-12 overflow-visible" fill="none">
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={`transition-colors duration-500 ${
                    phase === 2 ? 'text-[#D97706] cable-active' : 'text-[#272D24]/40'
                  }`}
                />
              </svg>
              {phase === 2 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#D97706]/30 border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-packet-h-fw z-20">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
              )}
            </div>

            {/* Mobile Cable Left */}
            <div className="flex md:hidden w-full h-10 items-center justify-center relative my-1 z-10">
              <svg className="w-full h-full overflow-visible" fill="none">
                <line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={`transition-colors duration-500 ${
                    phase === 2 ? 'text-[#D97706] cable-active' : 'text-[#272D24]/40'
                  }`}
                />
              </svg>
              {phase === 2 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-[#D97706]/30 border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-packet-v-fw z-20">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
              )}
            </div>

            {/* Node 2: Vexta Relay Server (Center Node) */}
            <div
              className={`w-full md:w-[34%] flex flex-col items-center border p-5 rounded-2xl relative z-10 transition-all duration-500 select-none ${
                phase === 3 ? 'border-[#D97706] bg-[#D97706]/10 shadow-[0_0_25px_rgba(217,119,6,0.25)] scale-[1.02]' : 'border-white/10 bg-[#151813]/60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl border border-[#5F7057]/40 flex items-center justify-center text-xl mb-2 transition-all ${
                  phase === 3 ? 'bg-[#D97706]/30 text-[#D97706] scale-105' : 'bg-[#5F7057]/10 text-[#D6C5B3]'
                }`}
              >
                <i className="fa-solid fa-server"></i>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D97706] font-mono">Vexta Relay Server</span>
              <span className="text-[9px] text-[#7C8775] font-mono uppercase mb-2">Metadata-Blind Node</span>

              {/* Server RAM Buffer Box */}
              <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[9px] font-mono leading-relaxed flex flex-col gap-2 flex-1 justify-between">
                <div className="flex items-center justify-between text-[#7C8775] border-b border-white/10 pb-1">
                  <span>RAM VOLATILE BUFFER</span>
                  <span className="text-[#D97706] text-[8px] font-bold">
                    {phase >= 3 && phase < 5 ? '1 ENVELOPE IN QUEUE' : 'BUFFER EMPTY'}
                  </span>
                </div>

                <div
                  className={`flex flex-col gap-1 items-center justify-center p-3 border border-dashed rounded-xl transition-all ${
                    phase >= 3 && phase < 5 ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]' : 'border-white/10 text-[#7C8775]/40'
                  }`}
                >
                  {phase >= 3 && phase < 5 ? (
                    <div className="flex flex-col items-center gap-1 animate-pulse text-center">
                      <i className="fa-solid fa-shield-halved text-xl"></i>
                      <span className="text-[7px] uppercase tracking-wider font-extrabold">Envelope Locked in RAM</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center">
                      <i className="fa-solid fa-box-open text-xl"></i>
                      <span className="text-[7px] uppercase tracking-wider font-bold">Standby State</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 border-t border-white/10 pt-1.5 text-[8px]">
                  <div className="flex justify-between items-center text-[#7C8775]">
                    <span>Relay Policy:</span>
                    <span className="text-green-400 font-extrabold uppercase">BLIND FORWARDING</span>
                  </div>
                  <div className="flex justify-between items-center text-[#7C8775]">
                    <span>Payload Access:</span>
                    <span className="text-red-400 font-extrabold uppercase">
                      {phase >= 3 && phase < 5 ? 'UNREADABLE (NO PRIVATE KEY)' : 'NULL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cable Right (Server -> Bob) */}
            <div className="hidden md:flex flex-1 items-center justify-center relative mx-2 z-10">
              <svg className="w-full h-12 overflow-visible" fill="none">
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={`transition-colors duration-500 ${
                    phase === 4 || phase === 5 ? 'text-[#D97706] cable-active' : 'text-[#272D24]/40'
                  }`}
                />
              </svg>
              {phase === 4 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#D6C5B3]/30 border-2 border-[#D6C5B3] flex items-center justify-center text-[#D6C5B3] shadow-[0_0_15px_rgba(214,197,179,0.6)] animate-packet-h-bw z-20">
                  <i className="fa-solid fa-key text-xs"></i>
                </div>
              )}
              {phase === 5 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#D97706]/30 border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-packet-h-fw z-20">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
              )}
            </div>

            {/* Mobile Cable Right */}
            <div className="flex md:hidden w-full h-10 items-center justify-center relative my-1 z-10">
              <svg className="w-full h-full overflow-visible" fill="none">
                <line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={`transition-colors duration-500 ${
                    phase === 4 || phase === 5 ? 'text-[#D97706] cable-active' : 'text-[#272D24]/40'
                  }`}
                />
              </svg>
              {phase === 4 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-[#D6C5B3]/30 border-2 border-[#D6C5B3] flex items-center justify-center text-[#D6C5B3] shadow-[0_0_15px_rgba(214,197,179,0.6)] animate-packet-v-bw z-20">
                  <i className="fa-solid fa-key text-xs"></i>
                </div>
              )}
              {phase === 5 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-[#D97706]/30 border-2 border-[#D97706] flex items-center justify-center text-[#D97706] shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-packet-v-fw z-20">
                  <i className="fa-solid fa-lock text-xs"></i>
                </div>
              )}
            </div>

            {/* Node 3: Client B (Bob - Receiver) */}
            <div
              className={`w-full md:w-[30%] flex flex-col items-center border p-5 rounded-2xl relative z-10 transition-all duration-500 select-none ${
                phase === 5
                  ? 'border-green-500 bg-green-950/20 shadow-[0_0_25px_rgba(34,197,94,0.25)]'
                  : phase === 4
                  ? 'border-[#D97706] bg-[#D97706]/10'
                  : 'border-white/10 bg-[#151813]/60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl border border-[#5F7057]/40 flex items-center justify-center text-xl mb-2 transition-all ${
                  phase === 5 ? 'bg-green-500/30 text-green-400 scale-105' : phase === 4 ? 'bg-[#D97706]/25 text-[#D97706]' : 'bg-[#5F7057]/10 text-[#D6C5B3]'
                }`}
              >
                <i className="fa-solid fa-mobile-screen-button"></i>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D6C5B3] font-mono">Client B (Bob)</span>
              <span className="text-[9px] text-[#7C8775] font-mono uppercase mb-2">Receiver Terminal</span>

              {/* Bob Inbox Box */}
              <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[9px] font-mono leading-relaxed flex flex-col gap-2 flex-1 justify-between">
                <div className="flex items-center justify-between text-[#7C8775] border-b border-white/10 pb-1">
                  <span>INBOX STATE</span>
                  <span
                    className={`uppercase tracking-wider text-[8px] font-bold ${
                      phase === 5 ? 'text-green-400 animate-pulse' : phase === 4 ? 'text-[#D97706]' : 'text-[#7C8775]'
                    }`}
                  >
                    {phase === 5 ? 'DECRYPTED OK' : phase === 4 ? 'AUTHENTICATING' : 'IDLE'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#7C8775]">Plaintext Result:</span>
                  <span
                    className={`font-bold transition-all duration-300 p-1 rounded ${
                      phase === 5 ? 'text-green-400 bg-green-500/10 border border-green-500/30' : 'text-gray-600 bg-white/5'
                    }`}
                  >
                    {phase === 5 ? '"Hello Bob! Key exchange complete."' : '...'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border-t border-white/10 pt-1">
                  <span className="text-[#7C8775]">Decryption Status:</span>
                  <span className={`break-all font-bold transition-all duration-300 ${phase === 5 ? 'text-green-400' : 'text-gray-600'}`}>
                    {phase === 5 ? 'RSA Key Validated & Session Decrypted' : 'Waiting for envelope'}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between border-t border-white/10 pt-1.5 text-[8px] ${
                    phase === 5 ? 'text-green-400 font-bold' : 'text-[#7C8775]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <i className={`fa-solid ${phase === 5 ? 'fa-envelope-open-text' : 'fa-lock'}`}></i>
                    <span>{phase === 5 ? 'DECRYPTED' : 'KEYS ARMED'}</span>
                  </span>
                  <span>RSA-4096 PRIVATE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Real-Time Terminal Audit Log Console */}
          <div className="bg-[#0C0E0B] border border-white/10 p-5 rounded-2xl flex flex-col gap-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#7C8775] border-b border-white/10 pb-3">
              <span className="flex items-center gap-2 text-[#D97706] font-bold">
                <i className="fa-solid fa-terminal"></i> REAL-TIME CRYPTOGRAPHIC AUDIT CONSOLE
              </span>

              {/* Log Filters */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-widest text-[#7C8775]">Filter Log:</span>
                {['all', 'info', 'success', 'warning', 'danger'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold transition-colors cursor-pointer ${
                      logFilter === f ? 'bg-[#D97706] text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px] md:text-xs h-[160px] overflow-y-auto pr-2 scroll-smooth">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 leading-relaxed border-b border-white/5 pb-1">
                  <span className="text-[#7C8775] shrink-0 font-bold">{log.timestamp}</span>
                  <span
                    className={`${
                      log.type === 'success'
                        ? 'text-green-400 font-bold'
                        : log.type === 'danger'
                        ? 'text-red-400 font-bold'
                        : log.type === 'warning'
                        ? 'text-[#D97706] font-bold'
                        : 'text-gray-300'
                    }`}
                  >
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ZERO-TRUST PROTOCOL ENGINEERING PILLARS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[#D6C5B3] text-xs font-bold uppercase tracking-widest font-mono">// Cryptographic Pillars</span>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white font-sans">Zero-Trust Protocol Engineering</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-2xl text-[#D6C5B3]">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Blind Message Relay</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              The server only handles E2E encrypted envelopes. Plaintexts, contact groups, chat files, and participant structures are invisible to the database and relays.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-2xl text-[#D97706]">
              <i className="fa-solid fa-key"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Zero-Knowledge Auth</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              No passwords are stored. Authentication is verified locally by signing server challenge nonces using the client's local RSA-4096 key pair.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-2xl text-[#D6C5B3]">
              <i className="fa-solid fa-box"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Envelope Encryption</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              All payloads are wrapped under a unique AES-256-GCM symmetric key, which is encrypted with the recipient's RSA-OAEP public key.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-2xl text-[#D97706]">
              <i className="fa-solid fa-vault"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Encrypted Vault Sync</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Configuration data, contact tags, and profiles are encrypted using an Argon2id key derived from your master password before backing up to the server.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SYSTEM ANNOUNCEMENTS LINK BANNER */}
      {/* ========================================================================= */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 hover:border-[#D97706]/30 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706] text-2xl shrink-0">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">System Announcements & Security Dispatches</h3>
            <p className="text-xs text-gray-400 font-sans">View historical node broadcasts, maintenance schedules, and signed protocol updates.</p>
          </div>
        </div>
        <Link
          to="/announcements"
          className="px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-[#D6C5B3] hover:text-white border border-[#5F7057] hover:border-[#D97706] bg-[#0C0E0B]/60 hover:bg-[#D97706]/15 rounded-xl transition-all shrink-0 cursor-pointer no-underline flex items-center gap-2"
        >
          <span>View Announcements</span>
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      </section>

      {/* ========================================================================= */}
      {/* 5. GETTING STARTED GUIDE */}
      {/* ========================================================================= */}
      <section className="glass-panel rounded-3xl p-8 flex flex-col gap-8 border border-white/10">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="inline-block w-1.5 h-3 bg-[#5F7057]"></span> Getting Started Guide
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Follow these 3 steps to set up Vexta client and establish secure end-to-end messaging with your bridge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 p-6 bg-[#0C0E0B]/60 border border-white/10 rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-xl bg-[#5F7057] border border-white/20 text-white font-extrabold text-base flex items-center justify-center shadow-tech font-mono">
              1
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D6C5B3] mt-2">Download Client</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Obtain the binary installers or zip archive packages for your operating system from our downloads dashboard.
            </p>
            <Link to="/downloads" className="text-xs uppercase font-bold text-[#D6C5B3] hover:text-[#D97706] tracking-wider mt-auto pt-2 cursor-pointer font-mono inline-block">
              Get Installer &rarr;
            </Link>
          </div>

          <div className="flex flex-col gap-3 p-6 bg-[#0C0E0B]/60 border border-white/10 rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-xl bg-[#5F7057] border border-white/20 text-white font-extrabold text-base flex items-center justify-center shadow-tech font-mono">
              2
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D6C5B3] mt-2">Configure Address</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Open your Vexta application settings, input this server host address, and verify the server key fingerprint.
            </p>
            <a href="#demo-simulator" className="text-xs uppercase font-bold text-[#D6C5B3] hover:text-[#D97706] tracking-wider mt-auto pt-2 font-mono inline-block">
              Verify Fingerprint &rarr;
            </a>
          </div>

          <div className="flex flex-col gap-3 p-6 bg-[#0C0E0B]/60 border border-white/10 rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-xl bg-[#5F7057] border border-white/20 text-white font-extrabold text-base flex items-center justify-center shadow-tech font-mono">
              3
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#D6C5B3] mt-2">Connect Sockets</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Set up your username and encrypt your vault locally using Argon2id. Once auth is established, you are ready to chat!
            </p>
            <Link to="/about" className="text-xs uppercase font-bold text-[#D6C5B3] hover:text-[#D97706] tracking-wider mt-auto pt-2 cursor-pointer font-mono inline-block">
              Read Spec &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
