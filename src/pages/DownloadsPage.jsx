import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function DownloadsPage() {
  const {
    clientDownloads,
    olderDownloads,
    availableVersions,
    selectedVersion,
    selectReleaseByVersion,
    latestClientVersion,
  } = useApp();

  const [detectedOS, setDetectedOS] = useState('windows');
  const [selectedWinFormat, setSelectedWinFormat] = useState('setup'); // 'setup' | 'portable' | 'msi'
  const [copiedHash, setCopiedHash] = useState(null);
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);

  // Auto-detect visitor operating system on mount
  useEffect(() => {
    const ua = (typeof window !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
    if (ua.includes('android')) setDetectedOS('android');
    else if (ua.includes('linux')) setDetectedOS('linux');
    else if (ua.includes('mac') || ua.includes('darwin')) setDetectedOS('macos');
    else setDetectedOS('windows');
  }, []);

  // Categorize specific release artifacts
  const winSetup = clientDownloads.find(
    (d) => d.key === 'windows_nsis' || d.filename?.endsWith('-setup.exe') || (d.platform_key === 'windows' && d.filename?.endsWith('.exe') && !d.filename?.toLowerCase().includes('portable'))
  );
  const winPortable = clientDownloads.find(
    (d) => d.key === 'windows_portable' || d.filename?.toLowerCase().includes('portable') || d.filename?.endsWith('.zip')
  );
  const winMsi = clientDownloads.find(
    (d) => d.key === 'windows_msi' || d.filename?.endsWith('.msi')
  );

  const latestAppImage = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename?.endsWith('.AppImage'));
  const latestDeb = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename?.endsWith('.deb'));
  const latestTarGz = clientDownloads.find((d) => d.platform_key === 'linux' && d.filename?.endsWith('.tar.gz'));
  const latestApk = clientDownloads.find((d) => d.platform_key === 'android' || d.filename?.endsWith('.apk'));

  const triggerDownload = (dl) => {
    if (!dl) return;
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#D97706', '#5F7057', '#D6C5B3']
    });
    if (dl.url) {
      window.open(dl.url, '_blank');
    } else if (dl.platform_key && dl.version) {
      window.open(`https://downloads.nexusec.space/api/v1/vexta/download/${dl.version}/${dl.platform_key}`, '_blank');
    } else if (dl.platform_key) {
      window.open(`https://downloads.nexusec.space/api/v1/vexta/download/${dl.platform_key}`, '_blank');
    }
  };

  const copyHashToClipboard = (hash, filename, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(filename);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Determine active Windows target based on user selection
  const getActiveWinTarget = () => {
    if (selectedWinFormat === 'portable') return winPortable || winSetup || winMsi;
    if (selectedWinFormat === 'msi') return winMsi || winSetup || winPortable;
    return winSetup || winPortable || winMsi;
  };

  // Determine Primary Recommended Download based on detected OS & chosen format
  const getPrimaryDownload = () => {
    if (detectedOS === 'linux') {
      return {
        target: latestAppImage || latestDeb || latestTarGz,
        osName: 'Linux',
        icon: 'fa-brands fa-linux',
        typeLabel: 'AppImage (x86_64)',
        altTarget: latestDeb,
        altLabel: 'Download .deb Package',
      };
    }
    if (detectedOS === 'android') {
      return {
        target: latestApk,
        osName: 'Android',
        icon: 'fa-brands fa-android',
        typeLabel: 'ARM64 APK Installer',
        altTarget: null,
        altLabel: '',
      };
    }

    const winTarget = getActiveWinTarget();
    const typeLabel = selectedWinFormat === 'portable' 
      ? 'Standalone Portable (.exe)' 
      : selectedWinFormat === 'msi' 
      ? 'Enterprise Package (.msi)' 
      : 'Setup Wizard (.exe)';

    return {
      target: winTarget,
      osName: 'Windows',
      icon: 'fa-brands fa-windows',
      typeLabel: typeLabel,
      altTarget: null,
      altLabel: '',
    };
  };

  const primary = getPrimaryDownload();

  // Check if entered hash matches any download
  const allDownloadsList = [...clientDownloads, ...olderDownloads];
  const matchingDownload = verifyHashInput.trim()
    ? allDownloadsList.find((d) => d.sha256 && d.sha256.toLowerCase() === verifyHashInput.trim().toLowerCase())
    : null;

  return (
    <div className="flex flex-col gap-10 py-4 max-w-5xl mx-auto w-full min-h-[75vh]">
      
      {/* 1. CLEAN HERO HEADER */}
      <div className="text-center flex flex-col gap-3">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D97706]">
          // OFFICIAL RELEASES
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
          Get Vexta Client
        </h1>
        <p className="text-xs md:text-sm text-[#8E9A87] max-w-lg mx-auto font-sans leading-relaxed">
          Zero-knowledge, end-to-end encrypted messaging. All cryptography and private keys remain strictly on your local device.
        </p>
      </div>

      {/* 2. PRIMARY SPOTLIGHT CARD (WITH FORMAT CHOOSER) */}
      <div className="solid-panel p-6 md:p-8 rounded-3xl border border-[#D97706]/40 bg-gradient-to-b from-[#D97706]/10 to-transparent shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706] text-3xl shrink-0 shadow-lg">
            <i className={primary.icon}></i>
          </div>
          <div className="flex flex-col text-left flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg md:text-xl font-extrabold text-white uppercase tracking-wider">
                Vexta for {primary.osName}
              </span>
              <span className="bg-[#D97706] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase shadow-sm">
                v{selectedVersion || latestClientVersion || '0.0.12'}
              </span>
            </div>
            <span className="text-xs text-[#8E9A87] font-mono mt-1">
              Recommended for your device • {primary.typeLabel} {primary.target?.size ? `(${primary.target.size})` : ''}
            </span>

            {/* Windows Interactive Format Switcher Tabs */}
            {detectedOS === 'windows' && (
              <div className="flex items-center gap-1.5 mt-3 bg-[#0C0E0B]/80 p-1 rounded-xl border border-white/10 w-fit">
                <button
                  onClick={() => setSelectedWinFormat('setup')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    selectedWinFormat === 'setup'
                      ? 'bg-[#D97706] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fa-solid fa-box mr-1"></i> Setup (.exe)
                </button>
                <button
                  onClick={() => setSelectedWinFormat('portable')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    selectedWinFormat === 'portable'
                      ? 'bg-[#D97706] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fa-solid fa-bolt mr-1"></i> Portable (.exe)
                </button>
                <button
                  onClick={() => setSelectedWinFormat('msi')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    selectedWinFormat === 'msi'
                      ? 'bg-[#D97706] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className="fa-solid fa-building mr-1"></i> MSI (.msi)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Hash Pill */}
        <div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => triggerDownload(primary.target)}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#5F7057] to-[#D97706] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg select-none"
          >
            <i className="fa-solid fa-download text-sm"></i>
            <span>Download {primary.typeLabel.split(' ')[0]}</span>
          </button>

          {primary.target?.sha256 && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E9A87] bg-[#0C0E0B]/80 border border-white/10 px-2.5 py-1 rounded-lg">
              <span className="truncate max-w-[140px]" title={primary.target.sha256}>
                SHA-256: {primary.target.sha256.slice(0, 10)}...
              </span>
              <button
                onClick={(e) => copyHashToClipboard(primary.target.sha256, primary.target.filename, e)}
                className="text-[#D6C5B3] hover:text-white font-bold uppercase transition-colors"
              >
                {copiedHash === primary.target.filename ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. ALL PLATFORMS GRID (CLEAR CHOICES FOR EVERY CLIENT) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#293226] pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6C5B3] flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#D97706]"></i> Available Platforms &amp; Formats
          </h2>
          <span className="text-[10px] font-mono text-[#8E9A87]">Direct Verified Packages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* WINDOWS CARD */}
          <div className="solid-panel p-5 rounded-2xl flex flex-col justify-between gap-4 border border-white/5 hover:border-[#D97706]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706] text-xl">
                  <i className="fa-brands fa-windows"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Windows</h3>
                  <span className="text-[10px] font-mono text-[#8E9A87]">x64 (Windows 10 / 11)</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#4ADE80] font-bold bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2 py-0.5 rounded">
                STABLE
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#293226]">
              {winSetup && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">Setup (.exe)</span>
                    <span className="text-[10px] text-[#8E9A87]">Standard Installer</span>
                  </div>
                  <button
                    onClick={() => triggerDownload(winSetup)}
                    className="px-3 py-1 bg-[#D97706]/15 text-[#D97706] hover:bg-[#D97706] hover:text-white border border-[#D97706]/40 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get .exe
                  </button>
                </div>
              )}
              {winPortable && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">Portable (.exe)</span>
                    <span className="text-[10px] text-[#8E9A87]">Zero-Install Standalone</span>
                  </div>
                  <button
                    onClick={() => triggerDownload(winPortable)}
                    className="px-3 py-1 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get .exe
                  </button>
                </div>
              )}
              {winMsi && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">Enterprise (.msi)</span>
                    <span className="text-[10px] text-[#8E9A87]">Windows Installer Package</span>
                  </div>
                  <button
                    onClick={() => triggerDownload(winMsi)}
                    className="px-3 py-1 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get .msi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ANDROID CARD */}
          <div className="solid-panel p-5 rounded-2xl flex flex-col justify-between gap-4 border border-white/5 hover:border-[#10B981]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] text-xl">
                  <i className="fa-brands fa-android"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Android</h3>
                  <span className="text-[10px] font-mono text-[#8E9A87]">ARM64 / APK Sideload</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#10B981] font-bold bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded">
                AVAILABLE
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#293226]">
              {latestApk ? (
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">Direct Package (.apk)</span>
                    <span className="text-[10px] text-[#8E9A87]">Android 8.0+ (ARM64)</span>
                  </div>
                  <button
                    onClick={() => triggerDownload(latestApk)}
                    className="px-3 py-1 bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981] hover:text-white border border-[#10B981]/40 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get .apk
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-[#8E9A87] py-1">
                  Build available in release directory
                </div>
              )}
            </div>
          </div>

          {/* LINUX CARD */}
          <div className="solid-panel p-5 rounded-2xl flex flex-col justify-between gap-4 border border-white/5 hover:border-[#5F7057]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5F7057]/20 border border-[#5F7057]/40 flex items-center justify-center text-[#D6C5B3] text-xl">
                  <i className="fa-brands fa-linux"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Linux</h3>
                  <span className="text-[10px] font-mono text-[#8E9A87]">x86_64 / Debian</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#4ADE80] font-bold bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2 py-0.5 rounded">
                STABLE
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#293226]">
              {latestAppImage && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300">AppImage</span>
                  <button
                    onClick={() => triggerDownload(latestAppImage)}
                    className="px-3 py-1 bg-[#5F7057]/20 text-[#D6C5B3] hover:bg-[#5F7057] hover:text-white border border-[#5F7057]/40 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get AppImage
                  </button>
                </div>
              )}
              {latestDeb && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Debian (.deb)</span>
                  <button
                    onClick={() => triggerDownload(latestDeb)}
                    className="px-3 py-1 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Get .deb
                  </button>
                </div>
              )}
              {!latestAppImage && !latestDeb && (
                <div className="text-[11px] font-mono text-[#8E9A87] py-1">
                  Build available on request
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 4. COLLAPSIBLE ADVANCED TOOLS (HASH VERIFICATION & ARCHIVES) */}
      <div className="flex flex-col gap-3">
        
        {/* Toggle 1: SHA-256 Verifier */}
        <div className="solid-panel rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setShowVerifier(!showVerifier)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono font-bold uppercase text-[#D6C5B3] hover:text-white bg-[#0E110D] transition-colors cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-fingerprint text-[#D97706]"></i>
              <span>Verify SHA-256 Checksum</span>
            </span>
            <i className={`fa-solid ${showVerifier ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs text-[#8E9A87]`}></i>
          </button>

          {showVerifier && (
            <div className="p-5 border-t border-[#293226] flex flex-col gap-3 bg-[#0C0E0B]">
              <input
                type="text"
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
                placeholder="Paste SHA-256 checksum to test match against official release..."
                className="w-full bg-[#111410] border border-[#293226] rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-[#D97706] transition-colors"
              />

              {verifyHashInput.trim() && (
                <div>
                  {matchingDownload ? (
                    <div className="p-3.5 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/40 flex items-center gap-2.5 text-xs font-mono text-[#4ADE80]">
                      <i className="fa-solid fa-circle-check"></i>
                      <span><strong>CHECKSUM VERIFIED:</strong> Matches official <strong>{matchingDownload.filename}</strong></span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center gap-2.5 text-xs font-mono text-[#EF4444]">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      <span><strong>NO MATCH FOUND:</strong> Checksum does not match official artifacts.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toggle 2: Historical Versions Archive */}
        <div className="solid-panel rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono font-bold uppercase text-[#D6C5B3] hover:text-white bg-[#0E110D] transition-colors cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[#5F7057]"></i>
              <span>Release Archive &amp; Older Versions</span>
            </span>
            <i className={`fa-solid ${showArchive ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs text-[#8E9A87]`}></i>
          </button>

          {showArchive && (
            <div className="p-5 border-t border-[#293226] flex flex-col gap-4 bg-[#0C0E0B]">
              {availableVersions && availableVersions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#8E9A87] mr-1">Filter by Version:</span>
                  {availableVersions.map((v) => (
                    <button
                      key={v}
                      onClick={() => selectReleaseByVersion(v)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs uppercase cursor-pointer ${
                        (selectedVersion || latestClientVersion) === v
                          ? 'bg-[#D97706] text-white font-bold'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      v{v}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {olderDownloads.length > 0 ? (
                  olderDownloads.map((dl) => (
                    <div
                      key={dl.filename}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#111410] border border-white/5 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-[#D6C5B3] font-bold">v{dl.version}</span>
                        <span className="text-gray-300 truncate">{dl.filename}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#8E9A87] text-[10px]">{dl.size}</span>
                        <button
                          onClick={() => triggerDownload(dl)}
                          className="px-2.5 py-0.5 border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          GET
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-[#8E9A87] text-center py-3">
                    No older releases archived.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
