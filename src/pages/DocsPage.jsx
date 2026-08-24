import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Copy Code Block component
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0C0E0B] shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-[#151813] border-b border-white/10 select-none text-[10px] text-[#7C8775]">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D6C5B3]">
          <i className="fa-solid fa-code text-[#D97706]"></i> Code Snippet / Payload
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[9px] uppercase font-bold text-[#D6C5B3] hover:text-white bg-white/5 hover:bg-[#D97706]/20 border border-white/10 px-2.5 py-1 rounded transition-all cursor-pointer"
        >
          <i className={`fa-solid ${copied ? 'fa-check text-[#4ADE80]' : 'fa-copy'}`}></i>
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-gray-300 leading-relaxed">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('quick-start');

  const toc = [
    { id: 'quick-start', title: 'Part 1: Quick Start Guide' },
    { id: 'step-1', title: 'Step 1: Download & Install', sub: true },
    { id: 'step-2', title: 'Step 2: Plug in Server Address', sub: true },
    { id: 'step-3', title: 'Step 3: Choose Username', sub: true },
    { id: 'step-4', title: 'Step 4: Lock Backup Vault', sub: true },
    { id: 'step-5', title: 'Step 5: Exchange Keys & Chat', sub: true },
    { id: 'tech-specs', title: 'Part 2: Technical Specifications' },
    { id: 'handshake', title: '1. WebSocket Handshake', sub: true },
    { id: 'envelope-relay', title: '2. Envelope Relay Format', sub: true },
    { id: 'database-models', title: '3. Database Abstractions', sub: true },
  ];

  const filteredToc = searchQuery.trim()
    ? toc.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : toc;

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col gap-10 py-4 min-h-[80vh]">
      {/* Header Hero */}
      <div className="solid-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5F7057]/10 via-transparent to-[#D97706]/10 -z-10"></div>
        <div className="text-4xl text-[#D6C5B3]">
          <i className="fa-solid fa-book-open animate-float"></i>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
          Relay Specification & Field Manual
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
          Technical architecture guidelines, cryptographic WebSocket handshake specs, envelope formats, and client deployment manual.
        </p>

        {/* Quick Nav Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Link
            to="/downloads"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-[#5F7057]/15 border border-[#5F7057]/40 text-[#D6C5B3] hover:text-white hover:bg-[#5F7057] transition-all no-underline flex items-center gap-1.5"
          >
            <i className="fa-solid fa-download"></i> Get Installers
          </Link>
          <Link
            to="/faq"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-[#D97706]/15 border border-[#D97706]/40 text-[#D97706] hover:text-white hover:bg-[#D97706] transition-all no-underline flex items-center gap-1.5"
          >
            <i className="fa-solid fa-circle-question"></i> View FAQs
          </Link>
        </div>
      </div>

      {/* Main 2-Column Documentation Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-4 solid-panel p-6 rounded-3xl border border-white/10 sticky top-28 select-none flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-[#D97706]"></i> Table of Contents
            </span>
            <span className="font-mono text-[9px] text-[#7C8775] uppercase">DOCS NAVIGATION</span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full bg-[#0C0E0B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-[#7C8775] focus:outline-none focus:border-[#D97706]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#7C8775] hover:text-white text-xs"
              >
                &times;
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
            {filteredToc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-xs font-mono transition-all py-2 px-3 rounded-xl cursor-pointer flex items-center justify-between ${
                  item.sub ? 'ml-3 text-[11px]' : 'font-bold uppercase'
                } ${
                  activeSection === item.id
                    ? 'bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] shadow-tech-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.title}</span>
                {activeSection === item.id && <span className="text-[#D97706] font-bold">&rarr;</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Documentation Reader Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Documentation Container */}
          <div className="solid-panel p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col gap-8 shadow-2xl leading-relaxed text-gray-300 font-sans">
            
            {/* Quick Start Header */}
            <div id="quick-start" className="flex flex-col gap-3 border-b border-white/10 pb-6 scroll-mt-32">
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-widest font-bold">// PART 1</span>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3">
                <i className="fa-solid fa-rocket text-[#D6C5B3]"></i> Quick Start Guide
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                Welcome to Vexta! Vexta is a private, zero-trust messaging client. All encryption is performed locally on your device—your private keys and chat messages remain completely invisible to the relay network.
              </p>
            </div>

            {/* Step 1 */}
            <div id="step-1" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 1: Download &amp; Install Vexta</h3>
              </div>
              <p className="text-xs text-gray-300">
                Grab the binary installer or zip archive for your operating system:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none text-xs font-mono">
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base"><i className="fa-brands fa-windows text-[#60A5FA]"></i></span>
                  <div>
                    <strong className="text-white">Windows Installer (.exe)</strong>
                    <div className="text-[10px] text-[#7C8775]">Standard NSIS desktop installer</div>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base"><i className="fa-solid fa-file-zipper text-[#F59E0B]"></i></span>
                  <div>
                    <strong className="text-white">Windows Portable (.zip)</strong>
                    <div className="text-[10px] text-[#7C8775]">Zero-installation portable executable</div>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base"><i className="fa-brands fa-linux text-[#4ADE80]"></i></span>
                  <div>
                    <strong className="text-white">Linux AppImage / .deb</strong>
                    <div className="text-[10px] text-[#7C8775]">Cross-distro packages</div>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base"><i className="fa-brands fa-android text-[#A7F3D0]"></i></span>
                  <div>
                    <strong className="text-white">Android APK</strong>
                    <div className="text-[10px] text-[#7C8775]">Direct sideload package</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div id="step-2" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 2: Connect to Relay Bridge</h3>
              </div>
              <p className="text-xs text-gray-300">
                In settings, enter your WebSocket Bridge gateway:
              </p>
              <CodeBlock>
                wss://vexta-api.nexusec.space/ws/chat/
              </CodeBlock>
              <p className="text-xs text-gray-400">
                Verify the cryptographic SHA-256 fingerprint displayed on screen before approving the connection.
              </p>
            </div>

            {/* Step 3 */}
            <div id="step-3" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 3: Identity Generation</h3>
              </div>
              <p className="text-xs text-gray-300">
                Select your unique handle. Vexta will automatically generate your <strong>RSA-4096 identity keys</strong> locally. Private keys never leave your machine.
              </p>
            </div>

            {/* Step 4 */}
            <div id="step-4" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  4
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 4: Lock Backup Vault</h3>
              </div>
              <p className="text-xs text-gray-300">
                Choose a master password to encrypt your contact roster using Argon2id before syncing to the backup relay.
              </p>
            </div>

            {/* Step 5 */}
            <div id="step-5" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  5
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 5: Exchange Keys &amp; Chat</h3>
              </div>
              <p className="text-xs text-gray-300">
                Add contacts by handle. Vexta automatically fetches their public key, and all messages are sealed with AES-256-GCM + RSA-4096.
              </p>
            </div>

            {/* Technical Specs Header */}
            <div id="tech-specs" className="flex flex-col gap-3 border-b border-white/10 pb-6 pt-6 scroll-mt-32">
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-widest font-bold">// PART 2</span>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3">
                <i className="fa-solid fa-code text-[#D6C5B3]"></i> Technical Protocol Specifications
              </h2>
            </div>

            {/* Protocol Spec 1: Handshake */}
            <div id="handshake" className="flex flex-col gap-4 scroll-mt-32">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#D97706]">1.</span> WebSocket Challenge Handshake
              </h3>
              <p className="text-xs text-gray-400">
                Upon WebSocket connection to <code className="text-[#D6C5B3]">/ws/chat/</code>, the relay server sends a cryptographic challenge:
              </p>
              <CodeBlock>
{`{
  "type": "AUTH_CHALLENGE",
  "nonce": "48b6f3a612c90a1b2c3d4e5f6a7b8c9d"
}`}
              </CodeBlock>
              <p className="text-xs text-gray-400">
                Client signs the nonce locally with its private RSA-4096 key:
              </p>
              <CodeBlock>
{`{
  "type": "AUTH_RESPONSE",
  "username": "alice",
  "public_key": "BASE64_RSA_PUBLIC_KEY_PEM",
  "signature": "BASE64_SIGNATURE_OF_NONCE"
}`}
              </CodeBlock>
            </div>

            {/* Protocol Spec 2: Envelope Relay */}
            <div id="envelope-relay" className="flex flex-col gap-4 scroll-mt-32">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#D97706]">2.</span> Blind Envelope Relay Format
              </h3>
              <CodeBlock>
{`{
  "type": "SEND_MESSAGE",
  "recipient": "bob_user_id",
  "ciphertext": "BASE64_ENCRYPTED_AES_GCM_ENVELOPE"
}`}
              </CodeBlock>
            </div>

            {/* Protocol Spec 3: Database Abstractions */}
            <div id="database-models" className="flex flex-col gap-4 scroll-mt-32">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#D97706]">3.</span> Database Abstractions
              </h3>
              <ul className="list-disc list-inside text-xs font-mono space-y-2 text-[#8E9A87]">
                <li><strong className="text-white">core.models.VextaUser</strong>: Routing handle, public key, encrypted vault backup.</li>
                <li><strong className="text-white">chat.models.BlindMessage</strong>: Temporary buffered envelopes (deleted upon delivery).</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
