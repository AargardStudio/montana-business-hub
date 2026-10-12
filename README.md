# Bozeman Business Hub

Comprehensive local business discovery, digital catalog, intelligence platform, and verified directory for Bozeman, Montana and the Gallatin Valley.

## Features

- **Local Business Directory**: Discover verified businesses across Bozeman, filter by category, neighborhood, credentials, and open hours.
- **Trust & Verification Badges**: Verified profiles, state licenses, insurance verification, and craftsmanship credentials.
- **Digital Shop & Catalogs**: Browse local products, book services, and request quotes without middleman commissions.
- **Interactive Map**: Geolocation-aware local business map with custom Gallatin County markers.
- **Community Events & Deals**: Local happenings, seasonal offers, and spotlights.
- **Vendor & Admin Portals**: Role-based portals for business owners and platform administrators.
- **AI Business Assistant & Natural Language Search**: Powered by Gemini API with offline heuristic fallback.
- **Export & Project Archive**: One-click download of the complete codebase and project data.

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
# Build Vite client and bundle Express server
npm run build

# Start production server
npm run start
```

### Environment Variables

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
*(Optional: Gemini API key enables AI search interpretation and business assistants. If omitted, the app automatically runs in deterministic fallback mode.)*
