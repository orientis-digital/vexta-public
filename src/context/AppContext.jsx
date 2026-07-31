import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

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
        // 1. Fetch System Info
        const infoRes = await fetch('/api/info/');
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

        // 2. Fetch Client Downloads Registry
        const dlRes = await fetch('/api/downloads/');
        if (dlRes.ok) {
          const dlData = await dlRes.json();
          setClientDownloads(dlData.downloads || []);
          setOlderDownloads(dlData.older_downloads || []);
          setLatestClientVersion(dlData.latest_version || null);
        }

        // 3. Fetch Announcements Feed
        const annRes = await fetch('/api/announcements/');
        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncements(annData.announcements || []);
        }
      } catch (err) {
        console.error('Error fetching data from Vexta Bridge API:', err);
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
        loading
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
