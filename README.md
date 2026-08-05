# Vexta Public Portal (`vexta-public`)

> **Official Web Landing Page, Documentation & Downloads Portal for Vexta Protocol** — Built with React 19, Vite, Tailwind CSS v4, and Lucide React. Designed & Maintained by **Orientis Digital**.

---

## 🌐 Overview

`vexta-public` is the public-facing web portal for **Vexta Protocol**, providing product showcases, technical documentation, announcement feeds, and live build download mirrors (`https://downloads.nexusec.space`).

---

## 🚀 Key Features & Pages

- 🏠 **Home Page (`HomePage.jsx`)**: Hero showcases, protocol feature cards, architecture overview, and interactive UI previews.
- 📦 **Downloads Portal (`DownloadsPage.jsx`)**: Multi-platform release mirrors (Windows `.exe`/`.zip`, Linux `.AppImage`/`.deb`/`.tar.gz`, Android `.apk`) with live SHA-256 hash checksum verification and historical release archives.
- 📚 **Documentation Hub (`DocsPage.jsx`)**: Developer & user guides detailing RSA-4096 / AES-256-GCM cryptographic specifications, Vexta V2 Rust Bridge WebSocket protocols, and WebRTC P2P signaling.
- 📢 **Announcements (`AnnouncementsPage.jsx`)**: Official release notes, protocol upgrades, and security advisory feed.
- ❓ **FAQ (`FaqPage.jsx`)**: Frequently asked questions about Zero-Knowledge privacy, E2EE key security, and self-hosting.
- 🛡️ **About & Trust (`AboutPage.jsx`)**: Orientis Digital brand principles and cryptographic verification guides.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + React Router DOM v7
- **Bundler**: Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI Components**: Lucide React icons, Canvas Confetti
- **Linter**: Oxlint (`oxlint`)

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview

# Run Oxlint code analysis
npm run lint
```

---

## 📄 License & Ownership

Copyright © 2026 **Orientis Digital**. All rights reserved.
