import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const guideMarkdown = `# Vexta Messenger: Field Manual & Quick Start 🚀

Welcome to Vexta! Vexta is a private, zero-trust messaging client. Because all encryption is performed locally on your device, your private keys and chat messages remain invisible to the network relay bridge.

Here is how to get up and running in under 5 minutes.

---

## Part 1: Quick Start Guide

### Step 1: Download & Install Vexta 📦
Head over to the **Downloads** page on this site and grab the installer package for your device:
* 💻 **Windows User**: Run the installer (\`.exe\`) to install Vexta.
* 📦 **Windows Portable**: Grab the \`.zip\` archive, extract it anywhere, and double-click \`Vexta.exe\` to run it (no installation needed!).
* 🤖 **Android User**: Download the \`.apk\` package (ensure "Install from Unknown Sources" is active in your device settings).
* 🐧 **Linux User**: Extract the \`.tar.gz\` bundle and launch the binary.

> [!TIP]
> **Double-Check File Safety**: To make sure your download wasn't tampered with, check the SHA-256 checksum in your terminal:
> * *Windows (PowerShell)*: \`Get-FileHash -Algorithm SHA256 .\\Vexta_x64_1.2.0.exe\`
> * *Linux (Bash)*: \`sha256sum Vexta_1.2.0.tar.gz\`

---

### Step 2: Plug in the Server Address 🌉
Vexta needs a relay server (called a "Bridge") to route your messages.
1. Launch Vexta and paste the Bridge address: \`wss://[your-bridge-address]/ws/chat/\`
2. **Compare the Fingerprint**: A cryptographic key fingerprint (e.g. \`5f70:57d9:...\`) will pop up on your screen. 
3. Cross-reference this string with the card published by your Bridge Administrator. If they match, click **Approve Connection**.

---

### Step 3: Choose a Username (No Email Required!) 👤
Vexta does not require email addresses, phone numbers, or passwords to sign up.
1. Type a unique username.
2. Enter the signup passcode if your server administrator requires an invitation code.
3. Vexta will automatically generate your **RSA-4096 identity keys** locally. Your private keys never leave your machine!

---

### Step 4: Lock Your Backup Vault 🔐
Vexta backs up your contacts and key configuration onto the server in a sealed vault.
1. Pick a **Master Password** to lock your vault.
2. Vexta will encrypt all your keys and profile data locally *before* syncing it.
3. **Important**: Because the server can never read your password, it cannot unlock your vault. If you lose your Master Password, your backup cannot be recovered—so keep it safe!

---

### Step 5: Exchange Keys & Chat! 💬
1. Click **Add Friend** and type their username.
2. Vexta will automatically download their public key from the Bridge.
3. When you send a message, Vexta seals the packet using their public key. The Bridge routes it blindly, and only your friend's private key can open it.

---

## Part 2: Technical Protocol Specifications

For system administrators and developers looking to inspect or implement the connection lifecycle:

### 1. Connection Handshake (WebSocket)
Clients connect via secure WebSockets to \`/ws/chat/\`.

#### A. Auth Challenge
Upon connection, the server generates a random challenge nonce and emits:
\`\`\`json
{
    "type": "AUTH_CHALLENGE",
    "nonce": "48b6f3a612c90a1b2c3d4e5f6a7b8c9d"
}
\`\`\`

#### B. Auth Response
The client signs the nonce with its private identity key and returns:
\`\`\`json
{
    "type": "AUTH_RESPONSE",
    "username": "user_handle",
    "public_key": "BASE64_RSA_PUBLIC_KEY_PEM",
    "signature": "BASE64_SIGNATURE_OF_NONCE"
}
\`\`\`

#### C. Verification
The server validates the signature:
* **Success**: Socket enters the group \`user_{user.id}\` and the server returns \`{ "type": "AUTH_SUCCESS" }\`, then flushes offline messages.
* **Failure**: Socket is immediately disconnected.

---

### 2. Envelope Relay Format
Clients send E2E encrypted envelopes using:
\`\`\`json
{
    "type": "SEND_MESSAGE",
    "recipient": "recipient_user_id",
    "ciphertext": "BASE64_ENCRYPTED_AES_GCM_ENVELOPE"
}
\`\`\`
* **If Recipient is Online**: The server broadcasts to \`user_{recipient_id}\` immediately:
    \`\`\`json
    {
        "type": "BLIND_MESSAGE",
        "ciphertext": "BASE64_ENCRYPTED_AES_GCM_ENVELOPE",
        "timestamp": "2026-08-01T05:53:00Z",
        "id": "msg_9f83b1657f"
    }
    \`\`\`
* **If Recipient is Offline**: Saved in \`chat.BlindMessage\` database with \`delivered = False\`.

---

### 3. Database Abstractions

#### \`core.models.VextaUser\`
* \`username\` (CharField, Unique) - Routing handle.
* \`public_key\` (TextField) - Base64 RSA-4096 Public Key.
* \`encrypted_vault\` (TextField) - AES-GCM encrypted profile configuration backup.

#### \`chat.models.BlindMessage\`
* \`recipient\` (ForeignKey -> VextaUser) - Target node.
* \`ciphertext\` (TextField) - Encrypted message bundle.
* \`delivered\` (Boolean) - Set to True and cleared upon client retrieval.
`;

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
          <i className={`fa-solid ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
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
      <div className="glass-panel p-8 md:p-10 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden border border-white/10">
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
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 sticky top-28 select-none flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-[#D97706]"></i> Table of Contents
            </span>
            <span className="font-mono text-[9px] text-[#7C8775] uppercase">DOCS NAVIGATION</span>
          </div>

          <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
            {toc.map((item) => (
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
          <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col gap-8 shadow-2xl leading-relaxed text-gray-300 font-sans">
            {/* Custom Formatted Sections */}
            
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
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 1: Download & Install Vexta</h3>
              </div>
              <p className="text-xs text-gray-300">
                Grab the binary installer or zip archive for your operating system:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none text-xs font-mono">
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base">💻</span>
                  <div>
                    <strong className="text-white block">Windows EXE</strong>
                    <span className="text-[10px] text-[#7C8775]">Installer Package</span>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base">📦</span>
                  <div>
                    <strong className="text-white block">Windows ZIP</strong>
                    <span className="text-[10px] text-[#7C8775]">Portable Archive</span>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <div>
                    <strong className="text-white block">Android APK</strong>
                    <span className="text-[10px] text-[#7C8775]">Mobile App</span>
                  </div>
                </li>
                <li className="bg-[#151813] border border-white/5 p-3 rounded-xl flex items-center gap-2">
                  <span className="text-base">🐧</span>
                  <div>
                    <strong className="text-white block">Linux TAR.GZ</strong>
                    <span className="text-[10px] text-[#7C8775]">Linux Binary Bundle</span>
                  </div>
                </li>
              </ul>

              {/* Callout Alert */}
              <div className="bg-[#D97706]/10 border-l-4 border-[#D97706] p-4 rounded-r-xl text-xs text-gray-300 flex flex-col gap-2 mt-2">
                <span className="font-mono text-[#D97706] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation"></i> Security Tip: Verify File Safety
                </span>
                <p className="text-[11px]">To ensure your installer was not altered, verify the SHA-256 digest in your shell:</p>
                <div className="font-mono text-[10px] text-[#D6C5B3] bg-black/40 p-2 rounded border border-white/5">
                  Get-FileHash -Algorithm SHA256 .\Vexta_x64_1.2.0.exe
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div id="step-2" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 2: Plug in Server Address</h3>
              </div>
              <p className="text-xs text-gray-300">
                1. Launch Vexta and paste your target bridge address: <code className="text-[#D6C5B3] bg-black/50 px-2 py-0.5 rounded font-mono">wss://[your-bridge-address]/ws/chat/</code>
              </p>
              <p className="text-xs text-gray-300">
                2. <strong>Compare Fingerprint</strong>: A key fingerprint (e.g. <code className="text-[#D97706] bg-black/50 px-2 py-0.5 rounded font-mono">5f70:57d9:...</code>) will display. Confirm it matches your administrator's published digest.
              </p>
            </div>

            {/* Step 3 */}
            <div id="step-3" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 3: Choose Username</h3>
              </div>
              <p className="text-xs text-gray-300">
                No email or phone numbers required. Simply enter a unique handle. Vexta generates your <strong>RSA-4096 identity key pair</strong> locally on device.
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
                Select a Master Password. Vexta derives an Argon2id key to encrypt your profile vault locally before cloud sync.
              </p>
            </div>

            {/* Step 5 */}
            <div id="step-5" className="flex flex-col gap-4 bg-[#0C0E0B]/60 p-6 rounded-2xl border border-white/10 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5F7057] text-white font-mono font-bold flex items-center justify-center text-sm shadow-tech-sm">
                  5
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Step 5: Exchange Keys & Chat!</h3>
              </div>
              <p className="text-xs text-gray-300">
                Click <strong>Add Friend</strong> and enter their handle. Vexta automatically downloads their public key to seal outgoing envelopes.
              </p>
            </div>

            {/* Technical Protocol Specs Header */}
            <div id="tech-specs" className="flex flex-col gap-3 border-b border-white/10 pb-6 pt-6 scroll-mt-32">
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-widest font-bold">// PART 2</span>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight flex items-center gap-3">
                <i className="fa-solid fa-[#5F7057] fa-microchip text-[#D97706]"></i> Technical Protocol Specifications
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                For developers and network engineers implementing custom Vexta client bridges or auditing socket handshake specifications.
              </p>
            </div>

            {/* Spec 1: Connection Handshake */}
            <div id="handshake" className="flex flex-col gap-4 scroll-mt-32">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#D97706]"></span> 1. Connection Handshake (WebSocket)
              </h3>
              <p className="text-xs text-gray-300">
                Clients open WSS sockets to <code className="text-[#D6C5B3] bg-black/50 px-2 py-0.5 rounded font-mono">/ws/chat/</code> and initiate a 3-step challenge-response authentication.
              </p>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">A. Auth Challenge Nonce</h4>
              <CodeBlock>{`{
  "type": "AUTH_CHALLENGE",
  "nonce": "48b6f3a612c90a1b2c3d4e5f6a7b8c9d"
}`}</CodeBlock>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">B. Auth Response Signature</h4>
              <CodeBlock>{`{
  "type": "AUTH_RESPONSE",
  "username": "alice",
  "public_key": "BASE64_RSA_PUBLIC_KEY_PEM",
  "signature": "BASE64_SIGNATURE_OF_NONCE"
}`}</CodeBlock>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">C. Verification Response</h4>
              <p className="text-xs text-gray-400">
                The relay verifies the signature using Alice's public key. On success, the socket joins group <code className="text-[#D6C5B3] bg-black/50 px-2 py-0.5 rounded font-mono">user_142</code> and receives <code className="text-green-400 font-mono">&#123; "type": "AUTH_SUCCESS" &#125;</code>.
              </p>
            </div>

            {/* Spec 2: Envelope Relay Format */}
            <div id="envelope-relay" className="flex flex-col gap-4 scroll-mt-32 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#5F7057]"></span> 2. Envelope Relay Format
              </h3>
              <p className="text-xs text-gray-300">
                Clients dispatch E2E encrypted envelopes formatted as:
              </p>
              <CodeBlock>{`{
  "type": "SEND_MESSAGE",
  "recipient": "bob",
  "ciphertext": "BASE64_ENCRYPTED_AES_GCM_ENVELOPE",
  "wire_blob": "BASE64_ENCRYPTED_AES_GCM_ENVELOPE",
  "timestamp": 1720000000000
}`}</CodeBlock>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">A. Binary MessagePack Framing</h4>
              <p className="text-xs text-gray-400">
                High-throughput clients automatically frame blind envelopes using binary MessagePack payloads prefixed with <code className="text-[#D6C5B3] bg-black/50 px-2 py-0.5 rounded font-mono">BLIND_MESSAGE</code> headers for sub-millisecond parsing.
              </p>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">B. WebRTC Signaling Control Frames</h4>
              <p className="text-xs text-gray-400">
                Voice and video call negotiations exchange SDP offers, answers, and ICE candidates using internal control frames (<code className="text-[#D97706] bg-black/50 px-2 py-0.5 rounded font-mono">call_offer</code>, <code className="text-[#D97706] bg-black/50 px-2 py-0.5 rounded font-mono">call_answer</code>, <code className="text-[#D97706] bg-black/50 px-2 py-0.5 rounded font-mono">call_ice</code>, <code className="text-[#D97706] bg-black/50 px-2 py-0.5 rounded font-mono">call_end</code>) that run silently in the background without populating chat message histories.
              </p>
              <CodeBlock>{`{
  "type": "call_offer",
  "sdp": { "type": "offer", "sdp": "v=0..." },
  "is_video": true,
  "is_group": false
}`}</CodeBlock>

              <h4 className="text-xs font-bold text-[#D6C5B3] uppercase font-mono mt-2">C. Presence & Heartbeat Engine</h4>
              <p className="text-xs text-gray-400">
                Clients broadcast 5-minute presence heartbeats (<code className="text-green-400 bg-black/50 px-2 py-0.5 rounded font-mono">&#123; "type": "presence", "status": "online" &#125;</code>) over WebSocket to update contact status indicators (<code className="text-green-400 font-mono">● Active now</code> vs relative timestamps).
              </p>
            </div>

            {/* Spec 3: Database Abstractions */}
            <div id="database-models" className="flex flex-col gap-4 scroll-mt-32 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#D97706]"></span> 3. Database Abstractions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-[#0C0E0B]/80 border border-white/10 p-5 rounded-2xl font-mono text-xs flex flex-col gap-2">
                  <span className="text-[#D97706] font-bold text-sm uppercase">core.models.VextaUser</span>
                  <ul className="list-disc list-inside text-gray-400 text-[11px] flex flex-col gap-1">
                    <li><strong className="text-white">username</strong>: Unique handle string</li>
                    <li><strong className="text-white">public_key</strong>: RSA-4096 PEM string</li>
                    <li><strong className="text-white">encrypted_vault</strong>: Argon2id AES-GCM blob</li>
                  </ul>
                </div>

                <div className="bg-[#0C0E0B]/80 border border-white/10 p-5 rounded-2xl font-mono text-xs flex flex-col gap-2">
                  <span className="text-[#5F7057] font-bold text-sm uppercase">chat.models.BlindMessage</span>
                  <ul className="list-disc list-inside text-gray-400 text-[11px] flex flex-col gap-1">
                    <li><strong className="text-white">recipient</strong>: Target VextaUser node</li>
                    <li><strong className="text-white">ciphertext</strong>: Encrypted envelope</li>
                    <li><strong className="text-white">delivered</strong>: Boolean state flag</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
