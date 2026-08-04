import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const API_BASE = (import.meta.env.VITE_API_URL || 'https://vexta-api.nexusec.space').replace(/\/$/, '');
const DOWNLOAD_API_BASE = (import.meta.env.VITE_DOWNLOAD_API_URL || 'https://downloads.nexusec.space').replace(/\/$/, '');

export function AppProvider({ children }) {
  const [bridgeName, setBridgeName] = useState('Vexta Bridge');
  const [bridgeDescription, setBridgeDescription] = useState('A privacy-first, zero-knowledge Vexta relay bridge.');
  const [fingerprint, setFingerprint] = useState(null);
  const [fingerprintFmt, setFingerprintFmt] = useState(null);
  const [keyGeneratedAt, setKeyGeneratedAt] = useState(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [uptime, setUptime] = useState('0h 0m 0s');

  const [announcements, setAnnouncements] = useState([]);
  const [clientDownloads, setClientDownloads] = useState([]);
  const [olderDownloads, setOlderDownloads] = useState([]);
  const [latestClientVersion, setLatestClientVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBridgeData() {
      try {
        // 1. Fetch System Info from Vexta API
        const infoRes = await fetch(`${API_BASE}/api/info/`);
        if (infoRes.ok) {
          const info = await infoRes.json();
          setBridgeName(info.bridge_name || 'Vexta Bridge');
          setBridgeDescription(info.bridge_description || '');
          setUptime(info.uptime || '0h 0m 0s');
          if (info.stats) {
            setTotalUsers(info.stats.total_users || 0);
            setOnlineUsers(info.stats.online_users || 0);
          }
          if (info.identity) {
            setHasIdentity(info.identity.has_identity || false);
            setFingerprint(info.identity.fingerprint || null);
            setFingerprintFmt(info.identity.fingerprint_fmt || null);
            setKeyGeneratedAt(info.identity.key_generated_at || null);
          }
        }

        // 2. Fetch Client Downloads using Centralized Standardized Downloads API
        try {
          const dlRes = await fetch(`${DOWNLOAD_API_BASE}/api/v1/vexta/latest`);
          if (dlRes.ok) {
            const dlData = await dlRes.json();
            setLatestClientVersion(dlData.latest_version || '2.0.0');

            if (dlData.artifacts && Object.keys(dlData.artifacts).length > 0) {
              const detectPlatform = (art) => {
                const name = (art.filename || '').toLowerCase();
                const key = (art.key || '').toLowerCase();
                const plat = (art.platform || '').toLowerCase();
                if (plat === 'windows' || key.includes('win') || name.includes('win') || name.endsWith('.exe') || name.endsWith('.zip')) {
                  return 'windows';
                }
                if (plat === 'linux' || key.includes('linux') || name.includes('linux') || name.endsWith('.appimage') || name.endsWith('.deb') || name.endsWith('.tar.gz') || name.endsWith('.tgz')) {
                  return 'linux';
                }
                if (plat === 'macos' || key.includes('mac') || name.includes('mac') || name.endsWith('.dmg') || name.endsWith('.pkg')) {
                  return 'macos';
                }
                if (plat === 'android' || key.includes('android') || name.endsWith('.apk')) {
                  return 'android';
                }
                return plat || 'windows';
              };

              const list = Object.values(dlData.artifacts).map((art) => ({
                filename: art.filename,
                version: dlData.latest_version || '0.0.1',
                platform_key: detectPlatform(art),
                key: art.key,
                size: art.size_human || '15 MB',
                sha256: art.sha256 || (dlData.checksums ? dlData.checksums.sha256 : ''),
                url: art.url,
                format: art.format || '',
                arch: art.arch || 'x64'
              }));
              setClientDownloads(list);
            } else if (dlData.downloads && Object.keys(dlData.downloads).length > 0) {
              const list = Object.entries(dlData.downloads).map(([key, url]) => ({
                filename: url.split('/').pop(),
                version: dlData.latest_version || '2.0.0',
                platform_key: key.startsWith('windows') ? 'windows' : key.startsWith('linux') ? 'linux' : key.startsWith('macos') ? 'macos' : 'windows',
                key: key,
                size: '15 MB',
                sha256: (dlData.checksums && (dlData.checksums[key + '_sha256'] || dlData.checksums.sha256)) || '',
                url: url,
                format: key,
                arch: 'x64'
              }));
              setClientDownloads(list);
            }
          } else {
            throw new Error('Downloads server response not OK');
          }
        } catch (dlErr) {
          console.warn('Centralized downloads server unreachable, falling back to bridge API:', dlErr);
          const dlRes = await fetch(`${API_BASE}/api/downloads/`);
          if (dlRes.ok) {
            const dlData = await dlRes.json();
            setClientDownloads(dlData.downloads || []);
            setOlderDownloads(dlData.older_downloads || []);
            setLatestClientVersion(dlData.latest_version || null);
          }
        }

        // 3. Fetch Announcements Feed
        const annRes = await fetch(`${API_BASE}/api/announcements/`);
        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncements(annData.announcements || []);
        }
      } catch (err) {
        console.error('Error fetching data from Vexta API:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBridgeData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        bridgeName,
        bridgeDescription,
        fingerprint,
        fingerprintFmt,
        keyGeneratedAt,
        hasIdentity,
        setHasIdentity,
        totalUsers,
        onlineUsers,
        uptime,
        announcements,
        clientDownloads,
        olderDownloads,
        latestClientVersion,
        loading,
        apiBaseUrl: API_BASE,
        downloadApiBaseUrl: DOWNLOAD_API_BASE
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
