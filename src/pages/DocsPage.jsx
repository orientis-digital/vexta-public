import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BentoCard from '../components/ui/BentoCard';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

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
    <div className="relative my-4 rounded-xl overflow-hidden border border-[#243022] bg-[#060805] shadow-2xl font-mono text-xs md:text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0E120D] border-b border-[#243022] select-none text-xs text-[#7E927F]">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#4ADE80]">
          <i className="fa-solid fa-code text-[#39FF14]"></i> Payload / Spec
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs uppercase font-bold text-[#39FF14] hover:text-black bg-[#22C55E]/15 hover:bg-[#22C55E] border border-[#22C55E]/40 px-3 py-1 rounded-lg transition-all cursor-pointer"
        >
          <i className={`fa-solid ${copied ? 'fa-check text-black' : 'fa-copy'}`}></i>
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-gray-200 leading-relaxed font-mono">
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
      {/* Header Hero Bento */}
      <BentoCard hover={false} className="p-8 md:p-12 text-center flex flex-col items-center gap-5 relative overflow-hidden border-[#243022]">
        <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-3xl text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <i className="fa-solid fa-book-open"></i>
        </div>
        <SectionHeader
          tag="// SYSTEM DOCUMENTATION"
          title="Relay Specification & Field Manual"
          description="Technical architecture guidelines, cryptographic WebSocket handshake specs, envelope formats, and client deployment manual."
        />

        {/* Quick Nav Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Link
            to="/downloads"
            className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-mono font-bold uppercase bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#39FF14] hover:text-black hover:bg-[#22C55E] transition-all no-underline flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i> Get Installers
          </Link>
          <Link
            to="/faq"
            className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-mono font-bold uppercase bg-[#141C13] border border-[#243022] text-gray-300 hover:text-white hover:border-[#22C55E] transition-all no-underline flex items-center gap-2"
          >
            <i className="fa-solid fa-circle-question text-[#4ADE80]"></i> View FAQs
          </Link>
        </div>
      </BentoCard>

      {/* Main 2-Column Documentation Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-4 solid-panel p-6 rounded-2xl md:rounded-3xl border border-[#243022] sticky top-28 select-none flex flex-col gap-4 bg-[#0E120D]">
          <div className="flex items-center justify-between border-b border-[#243022] pb-3">
            <span className="font-mono text-xs md:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-[#39FF14]"></i> Table of Contents
            </span>
            <span className="font-mono text-[10px] text-[#7E927F] uppercase">DOCS NAVIGATION</span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full bg-[#060805] border border-[#243022] rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-mono text-white placeholder:text-[#7E927F] focus:outline-none focus:border-[#22C55E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#7E927F] hover:text-white text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredToc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-xs md:text-sm font-mono transition-all py-2.5 px-3.5 rounded-xl cursor-pointer flex items-center justify-between ${
                  item.sub ? 'ml-3 text-xs' : 'font-bold uppercase'
                } ${
                  activeSection === item.id
                    ? 'bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#39FF14] font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.title}</span>
                {activeSection === item.id && <span className="text-[#39FF14] font-bold">&rarr;</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Documentation Reader Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <BentoCard hover={false} className="p-8 md:p-10 flex flex-col gap-8 shadow-2xl leading-relaxed text-gray-200 font-sans">
            
            {/* Quick Start Header */}
            <div id="quick-start" className="flex flex-col gap-3 border-b border-[#243022] pb-6 scroll-mt-32">
              <StatusBadge label="// PART 1" variant="green" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3 font-mono">
                <i className="fa-solid fa-rocket text-[#39FF14]"></i> Quick Start Guide
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                Welcome to Vexta! Vexta is a private, zero-trust messaging client. All encryption is performed locally on your device—your private keys and chat messages remain completely invisible to the relay network.
              </p>
            </div>

            {/* Step 1 */}
            <div id="step-1" className="flex flex-col gap-4 bg-[#060805] p-6 rounded-2xl border border-[#243022] scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-black font-mono font-bold flex items-center justify-center text-base shadow-md">
                  1
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider font-mono">Step 1: Download &amp; Install Vexta</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                Grab the binary installer or zip archive for your operating system:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 list-none text-xs md:text-sm font-mono">
                <li className="bg-[#0E120D] border border-[#243022] p-3.5 rounded-xl flex items-center gap-3">
                  <span className="text-lg"><i className="fa-brands fa-windows text-[#60A5FA]"></i></span>
                  <div>
                    <strong className="text-white text-sm">Windows Installer (.exe)</strong>
                    <div className="text-xs text-[#7E927F]">Standard NSIS desktop installer</div>
                  </div>
                </li>
                <li className="bg-[#0E120D] border border-[#243022] p-3.5 rounded-xl flex items-center gap-3">
                  <span className="text-lg"><i className="fa-solid fa-file-zipper text-[#39FF14]"></i></span>
                  <div>
                    <strong className="text-white text-sm">Windows Portable (.zip)</strong>
                    <div className="text-xs text-[#7E927F]">Zero-installation standalone</div>
                  </div>
                </li>
                <li className="bg-[#0E120D] border border-[#243022] p-3.5 rounded-xl flex items-center gap-3">
                  <span className="text-lg"><i className="fa-brands fa-linux text-[#4ADE80]"></i></span>
                  <div>
                    <strong className="text-white text-sm">Linux AppImage / .deb</strong>
                    <div className="text-xs text-[#7E927F]">Cross-distro packages</div>
                  </div>
                </li>
                <li className="bg-[#0E120D] border border-[#243022] p-3.5 rounded-xl flex items-center gap-3">
                  <span className="text-lg"><i className="fa-brands fa-android text-[#A7F3D0]"></i></span>
                  <div>
                    <strong className="text-white text-sm">Android APK</strong>
                    <div className="text-xs text-[#7E927F]">Direct sideload package</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div id="step-2" className="flex flex-col gap-4 bg-[#060805] p-6 rounded-2xl border border-[#243022] scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-black font-mono font-bold flex items-center justify-center text-base shadow-md">
                  2
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider font-mono">Step 2: Connect to Relay Bridge</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                In settings, enter your WebSocket Bridge gateway:
              </p>
              <CodeBlock>
                wss://vexta-api.nexusec.space/ws/chat/
              </CodeBlock>
              <p className="text-xs md:text-sm text-gray-400">
                Verify the cryptographic SHA-256 fingerprint displayed on screen before approving the connection.
              </p>
            </div>

            {/* Step 3 */}
            <div id="step-3" className="flex flex-col gap-4 bg-[#060805] p-6 rounded-2xl border border-[#243022] scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-black font-mono font-bold flex items-center justify-center text-base shadow-md">
                  3
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider font-mono">Step 3: Identity Generation</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                Select your unique handle. Vexta will automatically generate your <strong>RSA-4096 identity keys</strong> locally. Private keys never leave your machine.
              </p>
            </div>

            {/* Step 4 */}
            <div id="step-4" className="flex flex-col gap-4 bg-[#060805] p-6 rounded-2xl border border-[#243022] scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-black font-mono font-bold flex items-center justify-center text-base shadow-md">
                  4
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider font-mono">Step 4: Lock Backup Vault</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                Choose a master password to encrypt your contact roster using Argon2id before syncing to the backup relay.
              </p>
            </div>

            {/* Step 5 */}
            <div id="step-5" className="flex flex-col gap-4 bg-[#060805] p-6 rounded-2xl border border-[#243022] scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-black font-mono font-bold flex items-center justify-center text-base shadow-md">
                  5
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider font-mono">Step 5: Exchange Keys &amp; Chat</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-300">
                Add contacts by handle. Vexta automatically fetches their public key, and all messages are sealed with AES-256-GCM + RSA-4096.
              </p>
            </div>

            {/* Technical Specs Header */}
            <div id="tech-specs" className="flex flex-col gap-3 border-b border-[#243022] pb-6 pt-6 scroll-mt-32">
              <StatusBadge label="// PART 2" variant="green" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3 font-mono">
                <i className="fa-solid fa-code text-[#39FF14]"></i> Technical Protocol Specifications
              </h2>
            </div>

            {/* Protocol Spec 1: Handshake */}
            <div id="handshake" className="flex flex-col gap-4 scroll-mt-32">
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <span className="text-[#39FF14]">1.</span> WebSocket Challenge Handshake
              </h3>
              <p className="text-xs md:text-sm text-gray-300">
                Upon WebSocket connection to <code className="text-[#4ADE80]">/ws/chat/</code>, the relay server sends a cryptographic challenge:
              </p>
              <CodeBlock>
{`{
  "type": "AUTH_CHALLENGE",
  "nonce": "48b6f3a612c90a1b2c3d4e5f6a7b8c9d"
}`}
              </CodeBlock>
              <p className="text-xs md:text-sm text-gray-300">
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
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <span className="text-[#39FF14]">2.</span> Blind Envelope Relay Format
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
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <span className="text-[#39FF14]">3.</span> Database Abstractions
              </h3>
              <ul className="list-disc list-inside text-xs md:text-sm font-mono space-y-2 text-gray-300">
                <li><strong className="text-white">core.models.VextaUser</strong>: Routing handle, public key, encrypted vault backup.</li>
                <li><strong className="text-white">chat.models.BlindMessage</strong>: Temporary buffered envelopes (deleted upon delivery).</li>
              </ul>
            </div>

          </BentoCard>
        </div>
      </div>
    </div>
  );
}
