import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BentoCard from '../components/ui/BentoCard';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

const PHRASES = [
  'RSA-4096 Asymmetric Identity Authentication',
  'Blind Envelope Routing Protocol (Zero Metadata Retention)',
  'Real-Time Peer-to-Peer WebRTC Voice & Video Calling',
  'Binary MessagePack WebSocket Framing',
  'Client-Side AES-256-GCM Payload Encryption',
  'Messenger-Style Real-Time Presence Engine'
];

export default function HomePage() {
  const {
    latestClientVersion,
    latestClientBuild,
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
  const [typewriterText, setTypewriterText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PHRASES[phraseIdx];
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
      setPhraseIdx((phraseIdx + 1) % PHRASES.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx]);

  // Simplified 3-Step Simulator State
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const stepTimerRef = useRef(null);

  const steps = [
    {
      id: 1,
      title: '1. Local Encryption (Alice)',
      node: 'alice',
      actionBadge: 'AES-256-GCM + RSA SEALED',
      badgeVariant: 'neon',
      description: 'Alice types "Hello Bob!". The client generates an ephemeral AES-256 key, seals the payload locally, and encrypts the key with Bob\'s RSA-4096 public key.',
      status: 'Payload sealed on device before reaching network.'
    },
    {
      id: 2,
      title: '2. Blind Relay Routing (Server)',
      node: 'relay',
      actionBadge: 'ZERO-KNOWLEDGE RAM BUFFER',
      badgeVariant: 'mint',
      description: 'The relay inspects only the recipient target hash SHA-256(BobPubKey). The encrypted envelope is buffered strictly in volatile RAM memory with zero disk persistence.',
      status: 'Relay is blind to message plaintext and session keys.'
    },
    {
      id: 3,
      title: '3. Local Decryption (Bob)',
      node: 'bob',
      actionBadge: 'RSA-4096 UNLOCKED',
      badgeVariant: 'green',
      description: 'Bob authenticates with a signed challenge. The server relays the envelope to Bob\'s socket. Bob decrypts the AES key with his private RSA key and reads the plaintext.',
      status: 'Decryption succeeded on recipient device.'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      stepTimerRef.current = setInterval(() => {
        setStep((prev) => (prev % 3) + 1);
      }, 4000);
    }
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isPlaying]);

  const currentStepInfo = steps.find((s) => s.id === step) || steps[0];

  const getOsLabel = () => {
    if (detectedOS === 'windows') return { name: 'Windows', icon: 'fa-brands fa-windows' };
    if (detectedOS === 'linux') return { name: 'Linux', icon: 'fa-brands fa-linux' };
    if (detectedOS === 'macos') return { name: 'macOS', icon: 'fa-brands fa-apple' };
    if (detectedOS === 'android') return { name: 'Android', icon: 'fa-brands fa-android' };
    return { name: 'Windows', icon: 'fa-brands fa-windows' };
  };

  const osInfo = getOsLabel();

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-4">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center text-center gap-8 py-6 relative overflow-hidden">
        
        {/* Main Title */}
        <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold tracking-tight leading-[1.05] text-white uppercase max-w-5xl">
          Zero-Knowledge.<br />
          <span className="text-neon-gradient glow-neon">
            Blind Envelope Relay Server.
          </span>
        </h1>

        {/* Typewriter Line */}
        <div className="flex items-center justify-center gap-3 h-11 font-mono text-sm md:text-base text-gray-200 font-bold bg-[#0E120D] border border-[#243022] px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.6)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping"></span>
          <span className="typewriter text-[#4ADE80]">{typewriterText}</span>
        </div>

        {/* Hero Paragraph & Specs */}
        <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl font-sans">
          Vexta routes cryptographically sealed envelopes across a metadata-blind WebSocket relay network.
          Payloads are locked end-to-end with <strong className="text-white">RSA-4096 + AES-256-GCM</strong> on device with <strong className="text-[#39FF14]">zero server plaintext storage</strong>.
        </p>

        {/* Primary Smart CTA Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            to="/downloads"
            className="px-8 py-4 font-extrabold transition-all duration-300 text-sm md:text-base bg-[#22C55E] hover:bg-[#39FF14] text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:-translate-y-0.5 uppercase tracking-widest rounded-xl cursor-pointer select-none flex items-center gap-3 shadow-lg border border-[#39FF14]"
          >
            <i className={`${osInfo.icon} text-base text-black`}></i>
            <span>Download for {osInfo.name}</span>
            {latestClientVersion && (
              <span className="text-xs bg-black/25 text-black px-2 py-0.5 rounded font-mono font-extrabold">
                v{latestClientVersion}{latestClientBuild ? ` (b${latestClientBuild})` : ''}
              </span>
            )}
          </Link>
          <a
            href="#demo-simulator"
            className="px-7 py-4 font-bold transition-all duration-300 text-sm bg-[#0E120D] text-white border border-[#243022] hover:border-[#22C55E] hover:bg-[#141C13] uppercase tracking-widest rounded-xl select-none flex items-center gap-2.5 shadow-sm"
          >
            <i className="fa-solid fa-play text-xs text-[#39FF14]"></i> Live Demo
          </a>
          <Link
            to="/docs"
            className="px-7 py-4 font-bold transition-all duration-300 text-sm bg-transparent text-gray-300 border border-white/15 hover:border-[#22C55E]/60 hover:bg-[#22C55E]/10 uppercase tracking-widest rounded-xl select-none flex items-center gap-2.5"
          >
            <i className="fa-solid fa-book-open text-sm text-[#4ADE80]"></i> Protocol Specs
          </Link>
        </div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full text-left mt-4">
          <BentoCard span="col-span-1" className="p-6 gap-3">
            <div className="flex items-center gap-2.5 text-[#39FF14] font-mono text-sm md:text-base font-bold uppercase tracking-wider">
              <i className="fa-solid fa-eye-slash text-base"></i>
              <span>Zero Metadata</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Relays inspect zero message bodies, contact structures, or session keys. Blind envelope dispatch only.
            </p>
          </BentoCard>

          <BentoCard span="col-span-1" className="p-6 gap-3">
            <div className="flex items-center gap-2.5 text-[#22C55E] font-mono text-sm md:text-base font-bold uppercase tracking-wider">
              <i className="fa-solid fa-memory text-base"></i>
              <span>Volatile RAM Buffer</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              In-transit envelopes exist purely in volatile server memory. Zero disk persistence for messages.
            </p>
          </BentoCard>

          <BentoCard span="col-span-1" className="p-6 gap-3">
            <div className="flex items-center gap-2.5 text-[#4ADE80] font-mono text-sm md:text-base font-bold uppercase tracking-wider">
              <i className="fa-solid fa-shield-halved text-base"></i>
              <span>Local Key Sovereignty</span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              RSA-4096 identity keys are generated and held exclusively on client end devices.
            </p>
          </BentoCard>
        </div>

        {/* Desktop Client Interactive UI Showcase Mockup */}
        <div className="max-w-4xl w-full mt-6 text-left">
          <BentoCard hover={false} className="p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-[#243022]">
            {/* Window Titlebar */}
            <div className="bg-[#08080A] px-5 py-3.5 border-b border-[#243022] flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-green-500/80 inline-block"></span>
                <span className="font-mono text-xs md:text-sm text-[#7E927F] ml-2 font-bold">
                  Vexta Messenger{latestClientVersion ? ` // v${latestClientVersion}${latestClientBuild ? ` (Build ${latestClientBuild})` : ''}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#39FF14] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span> E2E ENCRYPTED
                </span>
              </div>
            </div>

            {/* App UI Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[#0A0D09] min-h-[320px]">
              {/* Sidebar */}
              <div className="border-r border-[#243022] p-4 flex flex-col gap-3.5 bg-[#080B07]">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#7E927F] mb-1">
                  Active Cryptographic Roster
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E120D] border border-[#22C55E]/40">
                  <div className="w-9 h-9 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#39FF14] font-mono text-sm font-bold">
                    BOB
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white font-mono">bob_sec</span>
                    <span className="text-xs text-[#39FF14] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]"></span> Verified Key
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-transparent opacity-60">
                  <div className="w-9 h-9 rounded-lg bg-[#243022] border border-white/10 flex items-center justify-center text-gray-400 font-mono text-sm font-bold">
                    ALICE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-300 font-mono">alice_node</span>
                    <span className="text-xs text-[#7E927F]">Standby</span>
                  </div>
                </div>
              </div>

              {/* Chat View */}
              <div className="col-span-2 p-6 flex flex-col justify-between gap-5 bg-[#0A0D09]">
                <div className="flex flex-col gap-3.5">
                  {/* Encrypted Envelope Indicator */}
                  <div className="self-center font-mono text-xs uppercase tracking-widest text-[#39FF14] bg-[#22C55E]/10 border border-[#22C55E]/30 px-3.5 py-1 rounded-full">
                    <i className="fa-solid fa-lock text-[10px] mr-1.5 text-[#39FF14]"></i> AES-256-GCM Session Established
                  </div>

                  {/* Bob Message */}
                  <div className="self-start max-w-sm p-3.5 rounded-2xl rounded-tl-sm bg-[#0E120D] border border-[#243022] text-xs md:text-sm text-gray-200">
                    <div className="font-mono text-xs text-[#4ADE80] mb-1 font-bold">bob_sec</div>
                    Key exchange complete. Transmitting sealed dispatch payload over blind socket.
                  </div>

                  {/* Alice Message */}
                  <div className="self-end max-w-sm p-3.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#22C55E]/20 to-[#39FF14]/20 border border-[#22C55E]/40 text-xs md:text-sm text-white">
                    <div className="font-mono text-xs text-[#39FF14] mb-1 font-bold">you (alice_node)</div>
                    Envelope received and verified locally. Zero relay metadata recorded.
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="border border-[#243022] rounded-xl bg-[#060805] p-2.5 flex items-center justify-between">
                  <span className="font-mono text-xs md:text-sm text-[#7E927F] px-2">Type message (auto-sealed on device)...</span>
                  <button className="px-4 py-1.5 bg-[#22C55E] text-black rounded-lg font-mono text-xs font-bold uppercase cursor-pointer">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. SIMPLIFIED & STREAMLINED 3-STEP PACKET ROUTING ANIMATION */}
      {/* ========================================================================= */}
      <section id="demo-simulator" className="flex flex-col gap-6 scroll-mt-28">
        
        {/* Section Header */}
        <SectionHeader
          tag="// HOW VEXTA WORKS"
          title="End-to-End Cryptographic Lifecycle"
          description="See how messages flow from sender to recipient with zero server-side plaintext exposure."
        />

        {/* Streamlined Visual Simulator Card */}
        <BentoCard hover={false} className="p-6 md:p-8 flex flex-col gap-6">
          
          {/* Top Step Selector & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#243022] pb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setIsPlaying(false);
                    setStep(s);
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs md:text-sm uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    step === s
                      ? 'bg-[#22C55E] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                      : 'bg-[#141C13] text-gray-300 hover:text-white hover:bg-[#1A2419] border border-[#243022]'
                  }`}
                >
                  <span>Step {s}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl font-mono text-xs md:text-sm text-gray-200 hover:text-white bg-[#141C13] hover:bg-[#1A2419] border border-[#243022] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs text-[#39FF14]`}></i>
              <span>{isPlaying ? 'Pause Loop' : 'Auto Play'}</span>
            </button>
          </div>

          {/* 3-Node Interactive Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative items-center">
            
            {/* NODE 1: ALICE */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 ${
              step === 1
                ? 'bg-[#141C13] border-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.25)]'
                : 'bg-[#0A0D09] border-[#1C241B] opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#39FF14] font-mono text-sm font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase font-mono">Alice</h4>
                    <span className="text-xs text-[#7E927F] font-mono">Origin Client</span>
                  </div>
                </div>
                {step === 1 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping"></span>
                )}
              </div>
              <div className="text-xs md:text-sm font-mono text-gray-300 bg-[#060805] p-3 rounded-xl border border-[#1C241B]">
                <div className="text-[10px] text-[#7E927F] uppercase font-bold mb-0.5">Payload Status:</div>
                <div className="text-white">{step === 1 ? '🔒 Sealing with Bob\'s RSA key' : '✓ Message Dispatched'}</div>
              </div>
            </div>

            {/* NODE 2: RELAY BRIDGE */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 ${
              step === 2
                ? 'bg-[#141C13] border-[#22C55E] shadow-[0_0_25px_rgba(34,197,94,0.3)]'
                : 'bg-[#0A0D09] border-[#1C241B] opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#4ADE80] font-mono text-sm font-bold">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase font-mono">Vexta Relay</h4>
                    <span className="text-xs text-[#7E927F] font-mono">Blind RAM Broker</span>
                  </div>
                </div>
                {step === 2 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping"></span>
                )}
              </div>
              <div className="text-xs md:text-sm font-mono text-gray-300 bg-[#060805] p-3 rounded-xl border border-[#1C241B]">
                <div className="text-[10px] text-[#7E927F] uppercase font-bold mb-0.5">Relay Status:</div>
                <div className="text-[#4ADE80]">{step === 2 ? '⚡ Routing blind envelope in RAM' : 'Standby / Idle'}</div>
              </div>
            </div>

            {/* NODE 3: BOB */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 ${
              step === 3
                ? 'bg-[#141C13] border-[#4ADE80] shadow-[0_0_25px_rgba(74,222,128,0.25)]'
                : 'bg-[#0A0D09] border-[#1C241B] opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#4ADE80]/20 border border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80] font-mono text-sm font-bold">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase font-mono">Bob</h4>
                    <span className="text-xs text-[#7E927F] font-mono">Recipient Client</span>
                  </div>
                </div>
                {step === 3 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping"></span>
                )}
              </div>
              <div className="text-xs md:text-sm font-mono text-gray-300 bg-[#060805] p-3 rounded-xl border border-[#1C241B]">
                <div className="text-[10px] text-[#7E927F] uppercase font-bold mb-0.5">Recipient Status:</div>
                <div className="text-[#39FF14]">{step === 3 ? '🔓 Decrypted with Private Key' : 'Waiting for envelope'}</div>
              </div>
            </div>

          </div>

          {/* Crisp Step Explainer Box */}
          <div className="bg-[#060805] border border-[#243022] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {currentStepInfo.title}
                </span>
                <StatusBadge label={currentStepInfo.actionBadge} variant={currentStepInfo.badgeVariant} />
              </div>
              <p className="text-xs md:text-sm text-gray-300 font-sans leading-relaxed mt-1">
                {currentStepInfo.description}
              </p>
            </div>
            <div className="text-xs md:text-sm font-mono text-[#4ADE80] bg-[#0E120D] border border-[#243022] px-4 py-2 rounded-xl shrink-0 flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-[#39FF14]"></i>
              <span>{currentStepInfo.status}</span>
            </div>
          </div>

        </BentoCard>
      </section>

      {/* ========================================================================= */}
      {/* 3. CRYPTOGRAPHIC PILLARS BENTO */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-8">
        <SectionHeader
          tag="// RELAY GUARANTEES"
          title="Engineered For Absolute Privacy"
          description="High-assurance cryptographic architecture eliminating plaintext interception and metadata retention."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <BentoCard span="col-span-1" className="p-6 gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-2xl text-[#39FF14]">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-base tracking-wider font-mono">Blind Message Relay</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              The server only handles E2E encrypted envelopes. Plaintexts, contact groups, chat files, and participant structures are invisible to relays.
            </p>
          </BentoCard>

          <BentoCard span="col-span-1" className="p-6 gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-2xl text-[#39FF14]">
              <i className="fa-solid fa-key"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-base tracking-wider font-mono">Zero-Knowledge Auth</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              No passwords are stored. Authentication is verified locally by signing server challenge nonces using the client's local RSA-4096 key pair.
            </p>
          </BentoCard>

          <BentoCard span="col-span-1" className="p-6 gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-2xl text-[#39FF14]">
              <i className="fa-solid fa-box"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-base tracking-wider font-mono">Envelope Encryption</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              All payloads are wrapped under a unique AES-256-GCM symmetric key, which is encrypted with the recipient's RSA-OAEP public key.
            </p>
          </BentoCard>

          <BentoCard span="col-span-1" className="p-6 gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-2xl text-[#39FF14]">
              <i className="fa-solid fa-vault"></i>
            </div>
            <h3 className="font-bold text-white uppercase text-base tracking-wider font-mono">Encrypted Vault Sync</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Configuration data, contact tags, and profiles are encrypted using an Argon2id key derived from your master password before backing up.
            </p>
          </BentoCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SYSTEM ANNOUNCEMENTS LINK BANNER */}
      {/* ========================================================================= */}
      <BentoCard className="p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#39FF14] text-2xl shrink-0">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <h3 className="text-lg font-extrabold uppercase tracking-wider text-white">System Announcements &amp; Security Dispatches</h3>
            <p className="text-xs md:text-sm text-gray-300 font-sans">View historical node broadcasts, maintenance schedules, and signed protocol updates.</p>
          </div>
        </div>
        <Link
          to="/announcements"
          className="px-6 py-3.5 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-[#4ADE80] hover:text-white border border-[#243022] hover:border-[#22C55E] bg-[#060805] hover:bg-[#141C13] rounded-xl transition-all shrink-0 cursor-pointer no-underline flex items-center gap-2"
        >
          <span>View Announcements</span>
          <i className="fa-solid fa-arrow-right text-xs text-[#39FF14]"></i>
        </Link>
      </BentoCard>

      {/* ========================================================================= */}
      {/* 5. GETTING STARTED BENTO */}
      {/* ========================================================================= */}
      <BentoCard hover={false} className="p-8 md:p-10 flex flex-col gap-8">
        <SectionHeader
          tag="// QUICK START"
          title="Connect Your Client in 3 Steps"
          description="Follow these 3 steps to set up Vexta client and establish secure end-to-end messaging with your bridge."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex flex-col gap-3.5 p-6 bg-[#060805] border border-[#243022] rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-10 h-10 rounded-xl bg-[#22C55E] text-black font-extrabold text-lg flex items-center justify-center shadow-lg font-mono">
              1
            </div>
            <h4 className="font-bold text-base uppercase tracking-wider text-white mt-2 font-mono">Download Client</h4>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Obtain the binary installers or zip archive packages for your operating system from our downloads dashboard.
            </p>
            <Link to="/downloads" className="text-xs md:text-sm uppercase font-bold text-[#4ADE80] hover:text-[#39FF14] tracking-wider mt-auto pt-2 cursor-pointer font-mono inline-block">
              Get Installer &rarr;
            </Link>
          </div>

          <div className="flex flex-col gap-3.5 p-6 bg-[#060805] border border-[#243022] rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-10 h-10 rounded-xl bg-[#22C55E] text-black font-extrabold text-lg flex items-center justify-center shadow-lg font-mono">
              2
            </div>
            <h4 className="font-bold text-base uppercase tracking-wider text-white mt-2 font-mono">Configure Address</h4>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Open your Vexta application settings, input this server host address, and verify the server key fingerprint.
            </p>
            <a href="#demo-simulator" className="text-xs md:text-sm uppercase font-bold text-[#4ADE80] hover:text-[#39FF14] tracking-wider mt-auto pt-2 font-mono inline-block">
              Verify Fingerprint &rarr;
            </a>
          </div>

          <div className="flex flex-col gap-3.5 p-6 bg-[#060805] border border-[#243022] rounded-2xl relative group">
            <div className="absolute -top-4 -left-3 w-10 h-10 rounded-xl bg-[#22C55E] text-black font-extrabold text-lg flex items-center justify-center shadow-lg font-mono">
              3
            </div>
            <h4 className="font-bold text-base uppercase tracking-wider text-white mt-2 font-mono">Connect Sockets</h4>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
              Set up your username and encrypt your vault locally using Argon2id. Once auth is established, you are ready to chat!
            </p>
            <Link to="/about" className="text-xs md:text-sm uppercase font-bold text-[#4ADE80] hover:text-[#39FF14] tracking-wider mt-auto pt-2 cursor-pointer font-mono inline-block">
              Read Spec &rarr;
            </Link>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
