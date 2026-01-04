# CortexBridge

The Executive Control Plane for the ApexSigma Ecosystem.

CortexBridge is a React-based dashboard application that monitors and controls three API services: Omega, InGest, and Memos.

## Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite
- **Tailwind CSS**: Styled with a custom ApexSigma theme using CSS variables
- **API Management**: Monitors three APIs (Omega:8765, InGest:8766, Memos:8768)
- **Health Monitoring**: Real-time health polling for all connected APIs
- **State Management**: Zustand store for system state
- **Responsive Layout**: Dashboard layout with collapsible sidebar
- **UI Components**: Reusable Card and Badge components with Lucide icons

## Project Structure

```
CortexBridge/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx    # Main layout with sidebar
│   │   ├── ui/
│   │   │   ├── Card.tsx               # Card component
│   │   │   └── Badge.tsx              # Badge component
│   │   └── Dashboard.tsx              # Main dashboard view
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts              # API client
│   │   │   └── healthPoller.ts        # Health monitoring
│   │   └── store/
│   │       └── systemStore.ts         # Zustand state store
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                      # Tailwind + ApexSigma theme
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js
├── vite.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ApexSigma-Solutions/CortexBridge.git
cd CortexBridge
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
cp .env.example .env
```

Edit `.env` to configure API endpoints:
```env
VITE_API_OMEGA_URL=http://localhost:8765
VITE_API_INGEST_URL=http://localhost:8766
VITE_API_MEMOS_URL=http://localhost:8768
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Configuration

CortexBridge monitors three APIs:

- **Omega API** (Port 8765): Configure with `VITE_API_OMEGA_URL`
- **InGest API** (Port 8766): Configure with `VITE_API_INGEST_URL`
- **Memos API** (Port 8768): Configure with `VITE_API_MEMOS_URL`

Each API is expected to have a `/health` endpoint that returns health status.

## Theme

The application uses the ApexSigma theme with CSS variables for easy customization. Colors can be modified in `src/index.css`:

- Primary colors (Blue)
- Secondary colors (Slate)
- Accent colors (Cyan)
- Status colors (Success, Warning, Error, Info)

## License

See [LICENSE](LICENSE) file for details.
