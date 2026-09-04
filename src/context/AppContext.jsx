import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  return 'https://vexta-api.nexusec.space';
};

const API_BASE = getApiBase();
const DOWNLOAD_API_BASE = (import.meta.env.VITE_DOWNLOAD_API_URL || 'https://downloads.nexusec.space').replace(/\/$/, '');

const DEFAULT_ANNOUNCEMENT = {
  id: 'dispatch-v0.0.10',
  message: `### Vexta v0.0.10 Protocol & Desktop Client Release

We are excited to announce the release of **Vexta v0.0.10** across Linux (AppImage, .deb, .tar.gz) and Windows (.zip).

**Key Upgrades & Security Features:**
- 🎨 **Sleek Minimalist Dark UI**: Solid surface architecture with Inter and JetBrains Mono typography.
- ⚡ **Instant Roster Sync**: Zero-refresh sidebar contact list updates on friend actions.
- 🛡️ **Smart Contact Failsafe**: Self-add prevention and network account existence validation.
- 🔒 **Hardened Server Security**: Constant-time admin authentication, 1 MB WebSocket frame limits, and HTTP security headers.`,
  created_at: '2026-08-12'
};

const safeJsonParse = async (res) => {
  if (!res || !res.ok) return null;
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
    return null;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
};

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
  const [allReleases, setAllReleases] = useState([]);
  const [availableVersions, setAvailableVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [latestClientVersion, setLatestClientVersion] = useState(null);
  const [latestClientBuild, setLatestClientBuild] = useState(null);
  const [loading, setLoading] = useState(true);

  const detectPlatform = (art) => {
    const name = (art.filename || '').toLowerCase();
    const key = (art.key || '').toLowerCase();
    const plat = (art.platform || '').toLowerCase();
    if (plat === 'windows' || key.includes('win') || name.includes('win') || name.endsWith('.exe') || name.endsWith('.zip') || name.endsWith('.msi')) {
      return 'windows';
    }
    if (plat === 'linux' || key.includes('linux') || name.includes('linux') || name.endsWith('.appimage') || name.endsWith('.deb') || name.endsWith('.tar.gz') || name.endsWith('.tgz')) {
      return 'linux';
    }
    if (plat === 'macos' || key.includes('mac') || name.includes('mac') || name.endsWith('.dmg') || name.endsWith('.pkg')) {
      return 'macos';
    }
    if (plat === 'android' || key.includes('android') || key.includes('apk') || name.includes('android') || name.endsWith('.apk')) {
      return 'android';
    }
    return plat || 'windows';
  };

  const extractBuildNumber = (filename) => {
    const m = (filename || '').match(/(?:build|[-_]b)(\d+)/i);
    return m ? parseInt(m[1], 10) : null;
  };

  const parseReleaseArtifacts = (release) => {
    if (!release) return [];
    const version = release.latest_version || release.version || '0.0.1';
    const releaseBuild = release.latest_build || 0;
    if (release.artifacts && Object.keys(release.artifacts).length > 0) {
      const valid = Object.values(release.artifacts).filter((art) => {
        const fn = (art.filename || '').toLowerCase();
        return (
          !fn.endsWith('.yml') &&
          !fn.endsWith('.yaml') &&
          !fn.endsWith('.json') &&
          !fn.endsWith('.map') &&
          !fn.includes('builder-debug')
        );
      });
      return valid.map((art) => {
        const buildNum = art.build_number || extractBuildNumber(art.filename) || releaseBuild;
        return {
          filename: art.filename,
          version: version,
          build_number: buildNum,
          display_version: buildNum ? `${version} (Build ${buildNum})` : version,
          release_date: release.release_date || '',
          platform_key: detectPlatform(art),
          key: art.key,
          size: art.size_human || '15 MB',
          sha256: art.sha256 || (release.checksums ? (release.checksums[(art.key || '') + '_sha256'] || release.checksums.sha256) : ''),
          url: art.url,
          format: art.format || '',
          arch: art.arch || 'x64',
        };
      });
    } else if (release.downloads && Object.keys(release.downloads).length > 0) {
      return Object.entries(release.downloads).map(([key, url]) => {
        const filename = url.split('/').pop();
        const buildNum = extractBuildNumber(filename) || releaseBuild;
        return {
          filename,
          version: version,
          build_number: buildNum,
          display_version: buildNum ? `${version} (Build ${buildNum})` : version,
          release_date: release.release_date || '',
          platform_key: key.startsWith('windows') ? 'windows' : key.startsWith('linux') ? 'linux' : key.startsWith('macos') ? 'macos' : key.startsWith('android') ? 'android' : 'windows',
          key: key,
          size: '15 MB',
          sha256: (release.checksums && (release.checksums[key + '_sha256'] || release.checksums.sha256)) || '',
          url: url,
          format: key,
          arch: 'x64',
        };
      });
    }
    return [];
  };

  const selectReleaseByVersion = (versionStr) => {
    setSelectedVersion(versionStr);
    const found = allReleases.find(
      (r) => (r.latest_version || r.version || '').replace(/^v/i, '') === versionStr.replace(/^v/i, '')
    );
    if (found) {
      setClientDownloads(parseReleaseArtifacts(found));
    }
  };

  useEffect(() => {
    async function fetchBridgeData() {
      // 1. Fetch System Info from Vexta API
      try {
        let infoRes = await fetch(`${API_BASE}/api/info`);
        let info = await safeJsonParse(infoRes);
        if (!info && API_BASE !== 'http://localhost:8000') {
          try {
            infoRes = await fetch('http://localhost:8000/api/info');
            info = await safeJsonParse(infoRes);
          } catch {}
        }
        if (info) {
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
      } catch (infoErr) {
        console.warn('Vexta API info endpoint unreachable or Cloudflare challenge active:', infoErr);
      }

      // 2. Fetch Historical Releases & Latest Downloads
      try {
        let releasesRes = await fetch(`${DOWNLOAD_API_BASE}/api/v1/apps/vexta/releases`);
        let releasesData = await safeJsonParse(releasesRes);

        if (releasesData && releasesData.releases && releasesData.releases.length > 0) {
          const releases = releasesData.releases;
          setAllReleases(releases);
          const versions = releases.map((r) => r.latest_version || r.version);
          setAvailableVersions(versions);
          const latestVer = versions[0];
          const latestBld = releases[0]?.latest_build || 0;
          setLatestClientVersion(latestVer);
          setLatestClientBuild(latestBld);
          setSelectedVersion(latestVer);
          setClientDownloads(parseReleaseArtifacts(releases[0]));

          const older = releases.slice(1).flatMap((r) => parseReleaseArtifacts(r));
          setOlderDownloads(older);
        } else {
          // Fallback to /latest endpoint
          const dlRes = await fetch(`${DOWNLOAD_API_BASE}/api/v1/apps/vexta/releases/latest`);
          const dlData = await safeJsonParse(dlRes);
          if (dlData) {
            const ver = dlData.latest_version || '0.0.11';
            const bld = dlData.latest_build || 0;
            setLatestClientVersion(ver);
            setLatestClientBuild(bld);
            setSelectedVersion(ver);
            setAvailableVersions([ver]);
            setAllReleases([dlData]);
            setClientDownloads(parseReleaseArtifacts(dlData));
          }
        }
      } catch (dlErr) {
        console.warn('Centralized downloads server unreachable, falling back to bridge API:', dlErr);
        try {
          const dlRes = await fetch(`${API_BASE}/api/downloads`);
          const dlData = await safeJsonParse(dlRes);
          if (dlData) {
            setClientDownloads(dlData.downloads || []);
            setOlderDownloads(dlData.older_downloads || []);
            setLatestClientVersion(dlData.latest_version || null);
            if (dlData.latest_version) {
              setAvailableVersions([dlData.latest_version]);
              setSelectedVersion(dlData.latest_version);
            }
          }
        } catch {}
      }

      // 3. Fetch Announcements Feed
      try {
        let annRes = await fetch(`${API_BASE}/api/announcements`);
        let annData = await safeJsonParse(annRes);
        if (!annData && API_BASE !== 'http://localhost:8000') {
          try {
            annRes = await fetch('http://localhost:8000/api/announcements');
            annData = await safeJsonParse(annRes);
          } catch {}
        }
        if (annData) {
          const list = Array.isArray(annData) ? annData : (annData.announcements || []);
          setAnnouncements(list.length > 0 ? list : [DEFAULT_ANNOUNCEMENT]);
        } else {
          setAnnouncements([DEFAULT_ANNOUNCEMENT]);
        }
      } catch {
        setAnnouncements([DEFAULT_ANNOUNCEMENT]);
      }

      setLoading(false);
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
        allReleases,
        availableVersions,
        selectedVersion,
        setSelectedVersion,
        selectReleaseByVersion,
        latestClientVersion,
        latestClientBuild,
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
