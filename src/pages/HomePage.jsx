import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const {
    latestClientVersion,
    clientDownloads,
  } = useApp();

  // OS Detection State
  const [detectedOS, setDetectedOS] = useState('windows');
  useEffect(() => {
    const ua = (typeof window !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
    if (ua.includes('win')) setDetectedOS('windows');
    else if (ua.includes('android')) setDetectedOS('android');
    else if (ua.includes('linux')) setDetectedOS('linux');
    else if (ua.includes('mac') || ua.includes('darwin')) setDetectedOS('macos');
  }, []);

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
          } else {
            setTimeout(() => {
              setIsPlaying(true);
            }, 4000);
          }
        }, 3200);
      };
      runSteps();
    }, 1000);
  };

  const jumpToPhase = (p) => {
    setIsPlaying(false);
    setPhase(p);
    runPhaseEffects(p);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Helper labels for detected OS
  const getOsLabel = () => {
    if (detectedOS === 'windows') return { name: 'Windows', icon: 'fa-brands fa-windows', format: '.exe / .zip' };
    if (detectedOS === 'linux') return { name: 'Linux', icon: 'fa-brands fa-linux', format: '.AppImage / .deb' };
    if (detectedOS === 'macos') return { name: 'macOS', icon: 'fa-brands fa-apple', format: '.dmg' };
    if (detectedOS === 'android') return { name: 'Android', icon: 'fa-brands fa-android', format: '.apk' };
    return { name: 'Windows', icon: 'fa-brands fa-windows', format: '.exe' };
  };

  const osInfo = getOsLabel();

  return (
    <div className="flex flex-col gap-20 py-4">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center text-center gap-8 py-8 relative overflow-hidden">
        
        {/* Main Title */}
        <h1 className="text-[clamp(2.2rem,6vw,4.25rem)] font-extrabold tracking-tight leading-[1.05] text-white uppercase max-w-5xl">
          Zero-Knowledge.<br />
          <span className="bg-gradient-to-r from-[#D6C5B3] via-[#D97706] to-[#5F7057] bg-clip-text text-transparent">
            Blind Envelope Routing Server.
          </span>
        </h1>

        {/* Typewriter Line */}
        <div className="flex items-center justify-center gap-2 h-8 font-mono text-xs md:text-sm text-gray-300 font-bold bg-[#141813] border border-[#293226] px-5 py-1.5 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
          <span className="typewriter text-[#D6C5B3]">{typewriterText}</span>
        </div>

        {/* Hero Paragraph & Specs */}
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl font-sans">
          Vexta routes cryptographically sealed envelopes across a metadata-blind WebSocket relay network.
          Payloads are locked end-to-end with <strong>RSA-4096 + AES-256-GCM</strong> on device with <strong>zero server plaintext storage</strong>.
        </p>

        {/* Primary Smart CTA Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
          <Link
            to="/downloads"
            className="px-8 py-4 font-extrabold transition-all duration-300 text-xs bg-gradient-to-r from-[#5F7057] to-[#D97706] text-white hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:-translate-y-0.5 uppercase tracking-widest rounded-xl cursor-pointer select-none flex items-center gap-2.5 shadow-lg"
          >
            <i className={`${osInfo.icon} text-sm`}></i>
            <span>Download for {osInfo.name}</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono font-bold">v{latestClientVersion || '0.0.10'}</span>
          </Link>
          <a
            href="#demo-simulator"
            className="px-6 py-4 font-bold transition-all duration-300 text-xs bg-[#141813] text-white border border-[#D97706]/40 hover:border-[#D97706] hover:bg-[#D97706]/15 uppercase tracking-widest rounded-xl select-none flex items-center gap-2 shadow-tech-sm"
          >
            <i className="fa-solid fa-play text-xs text-[#D97706]"></i> Live Simulator
          </a>
          <Link
            to="/docs"
            className="px-6 py-4 font-bold transition-all duration-300 text-xs bg-transparent text-gray-300 border border-white/10 hover:border-[#5F7057] hover:bg-[#5F7057]/10 uppercase tracking-widest rounded-xl select-none flex items-center gap-2"
          >
            <i className="fa-solid fa-book-open text-xs text-[#D6C5B3]"></i> Protocol Specs
          </Link>
        </div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full text-left mt-4">
          <div className="solid-panel p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-[#D97706] font-mono text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-eye-slash"></i>
              <span>Zero Metadata</span>
            </div>
            <p className="text-[11px] text-[#8E9A87] leading-relaxed font-sans">
              Relays inspect zero message bodies, contact structures, or session keys. Blind envelope dispatch only.
            </p>
          </div>

          <div className="solid-panel p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-[#5F7057] font-mono text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-memory"></i>
              <span>Volatile RAM Buffer</span>
            </div>
            <p className="text-[11px] text-[#8E9A87] leading-relaxed font-sans">
              In-transit envelopes exist purely in volatile server memory. Zero disk persistence for messages.
            </p>
          </div>

          <div className="solid-panel p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-[#D6C5B3] font-mono text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Local Key Sovereignty</span>
            </div>
            <p className="text-[11px] text-[#8E9A87] leading-relaxed font-sans">
              RSA-4096 identity keys are generated and held exclusively on client end devices.
            </p>
          </div>
        </div>

        {/* Desktop Client Interactive UI Showcase Mockup */}
        <div className="max-w-4xl w-full mt-6 text-left">
          <div className="solid-panel rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[#293226]">
            {/* Window Titlebar */}
            <div className="bg-[#0C0E0B] px-4 py-3 border-b border-[#293226] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="font-mono text-xs text-[#8E9A87] ml-2 font-bold">Vexta Messenger // v{latestClientVersion || '0.0.10'}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] text-[#D97706] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span> E2E ENCRYPTED
                </span>
              </div>
            </div>

            {/* App UI Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[#111410] min-h-[300px]">
              {/* Sidebar */}
              <div className="border-r border-[#293226] p-4 flex flex-col gap-3 bg-[#0E110D]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E9A87] mb-1">
                  Active Cryptographic Roster
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-[#141813] border border-[#D97706]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] font-mono text-xs font-bold">
                    BOB
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white font-mono">bob_sec</span>
                    <span className="text-[10px] text-[#4ADE80] flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#4ADE80]"></span> Verified Key
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-transparent opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] font-mono text-xs font-bold">
                    ALICE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-300 font-mono">alice_node</span>
                    <span className="text-[10px] text-[#8E9A87]">Standby</span>
                  </div>
                </div>
              </div>

              {/* Chat View */}
              <div className="col-span-2 p-5 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  {/* Encrypted Envelope Indicator */}
                  <div className="self-center font-mono text-[9px] uppercase tracking-widest text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/30 px-3 py-1 rounded-full">
                    <i className="fa-solid fa-lock text-[8px] mr-1"></i> AES-256-GCM Session Established
                  </div>

                  {/* Bob Message */}
                  <div className="self-start max-w-sm p-3 rounded-2xl rounded-tl-sm bg-[#181D17] border border-[#293226] text-xs text-gray-200">
                    <div className="font-mono text-[9px] text-[#D6C5B3] mb-1 font-bold">bob_sec</div>
                    Key exchange complete. Transmitting sealed dispatch payload over blind socket.
                  </div>

                  {/* Alice Message */}
                  <div className="self-end max-w-sm p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#5F7057]/30 to-[#D97706]/30 border border-[#D97706]/40 text-xs text-white">
                    <div className="font-mono text-[9px] text-[#D97706] mb-1 font-bold">you (alice_node)</div>
                    Envelope received and verified locally. Zero relay metadata recorded.
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="border border-[#293226] rounded-xl bg-[#0C0E0B] p-2 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#8E9A87] px-2">Type message (auto-sealed on device)...</span>
                  <button className="px-3 py-1 bg-[#D97706] text-white rounded-lg font-mono text-[10px] font-bold uppercase">
                    Send
                  </button>
                </div>
              </div>
            </div>
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
        <div className="solid-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative overflow-hidden">
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
                className="px-4 py-2 border border-white/10 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                {isPlaying ? 'Pause Auto-Loop' : 'Resume Auto-Loop'}
              </button>
            </div>
          </div>

          {/* Graphical Topology Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch relative">
            {/* 1. Alice (Sender Node) */}
            <div className={`p-6 rounded-2xl flex flex-col gap-4 border transition-all duration-500 ${
              phase === 1 || phase === 2
                ? 'bg-[#181D17] border-[#D97706] shadow-[0_0_25px_rgba(217,119,6,0.25)]'
                : 'bg-[#0E110D] border-white/5'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] font-mono text-xs font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-white uppercase">Alice Node</h4>
                    <span className="text-[10px] text-[#8E9A87] font-mono">Origin Client</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-[#D6C5B3]">PORT :51820</span>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px] text-[#8E9A87]">
                <div className="flex justify-between">
                  <span>Payload:</span>
                  <span className="text-white font-bold">{phase >= 1 ? '"Hello Bob!"' : 'Idle'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cipher Key:</span>
                  <span className={phase >= 1 ? 'text-[#4ADE80] font-bold' : ''}>{phase >= 1 ? 'AES-256-GCM' : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envelope:</span>
                  <span className={phase >= 2 ? 'text-[#D97706] font-bold' : ''}>{phase >= 2 ? 'SEALED & SENT' : 'Standby'}</span>
                </div>
              </div>
            </div>

            {/* 2. Vexta Relay Bridge (Zero-Knowledge Broker) */}
            <div className={`p-6 rounded-2xl flex flex-col gap-4 border transition-all duration-500 ${
              phase === 3
                ? 'bg-[#181D17] border-[#5F7057] shadow-[0_0_25px_rgba(95,112,87,0.35)]'
                : 'bg-[#0E110D] border-white/5'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] font-mono text-xs font-bold">
                    R
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-white uppercase">Vexta Relay Node</h4>
                    <span className="text-[10px] text-[#8E9A87] font-mono">Blind Socket Broker</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px] text-[#8E9A87]">
                <div className="flex justify-between">
                  <span>Disk Storage:</span>
                  <span className="text-[#4ADE80] font-bold">0 BYTES (RAM ONLY)</span>
                </div>
                <div className="flex justify-between">
                  <span>Header Inspection:</span>
                  <span className="text-[#EF4444] font-bold">DISABLED (BLIND)</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Hash:</span>
                  <span className="text-[#D6C5B3]">{phase >= 3 ? 'SHA-256(BobPubKey)' : '--'}</span>
                </div>
              </div>
            </div>

            {/* 3. Bob (Receiver Node) */}
            <div className={`p-6 rounded-2xl flex flex-col gap-4 border transition-all duration-500 ${
              phase === 4 || phase === 5
                ? 'bg-[#181D17] border-[#D97706] shadow-[0_0_25px_rgba(217,119,6,0.25)]'
                : 'bg-[#0E110D] border-white/5'
            }`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] font-mono text-xs font-bold">
                    B
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-white uppercase">Bob Node</h4>
                    <span className="text-[10px] text-[#8E9A87] font-mono">Recipient Client</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-[#D6C5B3]">PORT :51821</span>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px] text-[#8E9A87]">
                <div className="flex justify-between">
                  <span>Session Key:</span>
                  <span className={phase === 5 ? 'text-[#4ADE80] font-bold' : ''}>{phase === 5 ? 'DECRYPTED (RSA)' : 'Encrypted'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Message Body:</span>
                  <span className={phase === 5 ? 'text-white font-bold' : 'text-[#8E9A87]'}>{phase === 5 ? '"Hello Bob!"' : 'Waiting...'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Integrity Check:</span>
                  <span className={phase === 5 ? 'text-[#4ADE80] font-bold' : ''}>{phase === 5 ? 'PASSED (GCM)' : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Console Log Stream */}
          <div className="flex flex-col gap-2 bg-[#0C0E0B] border border-white/10 rounded-2xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-[#8E9A87] font-bold uppercase tracking-wider">
              <span>// Live Execution Stream</span>
              <span>Buffer: {logs.length} events</span>
            </div>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pt-2">
              {logs.map((log) => {
                const color = log.type === 'success' ? 'text-[#4ADE80]' : log.type === 'danger' ? 'text-[#EF4444]' : log.type === 'warning' ? 'text-[#F59E0B]' : 'text-[#D6C5B3]';
                return (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-[#8E9A87] text-[10px]">{log.timestamp}</span>
                    <span className={color}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CRYPTOGRAPHIC PILLARS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[#D6C5B3] text-xs font-bold uppercase tracking-widest font-mono">// Cryptographic Pillars</span>
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white font-sans">
            Engineered For Absolute Privacy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="solid-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-2xl text-[#D6C5B3]">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Blind Message Relay</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              The server only handles E2E encrypted envelopes. Plaintexts, contact groups, chat files, and participant structures are invisible to relays.
            </p>
          </div>

          <div className="solid-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-2xl text-[#D97706]">
              <i className="fa-solid fa-key"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Zero-Knowledge Auth</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              No passwords are stored. Authentication is verified locally by signing server challenge nonces using the client's local RSA-4096 key pair.
            </p>
          </div>

          <div className="solid-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-2xl text-[#D6C5B3]">
              <i className="fa-solid fa-box"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Envelope Encryption</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              All payloads are wrapped under a unique AES-256-GCM symmetric key, which is encrypted with the recipient's RSA-OAEP public key.
            </p>
          </div>

          <div className="solid-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-2xl text-[#D97706]">
              <i className="fa-solid fa-vault"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider">Encrypted Vault Sync</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Configuration data, contact tags, and profiles are encrypted using an Argon2id key derived from your master password before backing up.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SYSTEM ANNOUNCEMENTS LINK BANNER */}
      {/* ========================================================================= */}
      <section className="solid-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#D97706]/40 transition-all duration-300">
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
      <section className="solid-panel rounded-3xl p-8 flex flex-col gap-8 border border-white/10">
        <div className="flex flex-col gap-2 text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="inline-block w-1.5 h-3 bg-[#5F7057]"></span> Getting Started Guide
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Follow these 3 steps to set up Vexta client and establish secure end-to-end messaging with your bridge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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
