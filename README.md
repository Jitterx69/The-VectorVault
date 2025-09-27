<div align="center">

# VectorVault — The Future of SOC

</div>
---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quickstart](#quickstart)
- [Environment](#environment)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [API](#api)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- 🔍 Vector similarity search across historical incidents
- 🧠 JS cosine fallback when DB vector functions are unavailable
- 🗃️ Automatic table/index creation (TiDB Serverless)
- ⚙️ Database Management UI: test connection, refresh, seed
- 📊 Search stats (total incidents, indexed vectors, etc.)
- 🧪 Mock Mode (no database required) for fast local demos
- 🧭 Modern UI with shadcn/ui + Tailwind, responsive layout

---

## Architecture

```
┌───────────┐     REST      ┌──────────────┐     SQL / Vector      ┌───────────────┐
│  React    │  ───────────▶ │  Express API │  ───────────────────▶ │ TiDB Serverless│
│ (Vite)    │ ◀───────────  │ (server.cjs) │  ◀─────────────────── │ (optional)     │
└───────────┘  JSON / HTTP  └──────────────┘  Fallback: JS Cosine  └───────────────┘
```

---

## Tech Stack
- Frontend: React 18, TypeScript, Vite, shadcn/ui, Tailwind
- Backend: Node.js (Express)
- Database: TiDB Serverless (MySQL‑compatible, vector index optional)
- Fallback: In‑process cosine similarity (no external dependencies)

---

## Quickstart

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd incident-guard-ai
npm install
```

Start both servers (API + Frontend):
```bash
npm run dev:full
# Frontend: http://localhost:8080 (Vite auto-uses 8081 if 8080 is busy)
# API:      http://localhost:3001/api/health
```

> Tip: If you see a blank page, open the printed port (often 8081) and hard refresh (Cmd+Shift+R).

---

## Environment

Create `.env` (or copy `.env.example`):

```env
# TiDB Serverless (leave placeholders for Mock Mode)
VITE_TIDB_HOST=your-tidb-host.tidbcloud.com
VITE_TIDB_PORT=4000
VITE_TIDB_USER=your-username
VITE_TIDB_PASSWORD=your-password
VITE_TIDB_DATABASE=test

# App
VITE_APP_ENV=development
```

- Real DB mode: set valid TiDB credentials. The API will auto‑create tables/indexes and use SQL vector search where supported.
- Mock mode: keep placeholders. The API returns mock stats/seed behavior and computes similarity in JS.

---

## Database Schema

Created automatically by the API on startup (when real DB is configured):

```sql
CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity ENUM('Critical','High','Medium','Low') NOT NULL,
  status ENUM('Active','Investigating','Contained','Resolved','Scheduled') NOT NULL,
  timestamp DATETIME NOT NULL,
  resolution TEXT,
  tags JSON,
  sources JSON,
  embedding JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional vector index (depends on cluster capabilities)
CREATE VECTOR INDEX IF NOT EXISTS idx_incident_embedding
ON incidents(embedding)
DIMENSION 1536
METRIC_TYPE COSINE;
```

---

## Usage

1. Open the app → Settings → Database Management
2. Click "Test Connection"
3. If connected, click "Seed Sample Data"
4. Go to Vector Search → enter a natural language query (e.g., "DDoS attack on web infrastructure")
5. Use Advanced Filters to refine (categories, severity, status, date window, similarity threshold)

---

## API

Base URL (local): `http://localhost:3001/api`

- `GET /health`  
  Returns `{ status: 'ok', mode: 'real' | 'mock' }`.

- `GET /test-connection`  
  Tests DB connectivity or returns mock info.  
  Example: `{ success, incidents, vectorized, embeddingDimensions, mock }`.

- `GET /search-stats`  
  `{ totalIncidents, indexedVectors, searchAccuracy, avgResponseTime, mock }`.

- `POST /vector-search`  
  Body:
  ```json
  {
    "query": "DDoS attack on web infrastructure",
    "filters": {
      "categories": ["Network Security"],
      "severity": ["High", "Critical"],
      "status": ["Resolved"],
      "includeResolved": true,
      "dateRange": "30days",
      "similarityThreshold": 75
    },
    "limit": 10
  }
  ```
  Returns: `Incident[]` with `similarity` score.  
  Notes:
  - Uses SQL vector function when available.
  - Falls back to JS cosine similarity otherwise.

- `POST /seed-data`  
  Seeds 2 sample incidents in real DB mode or confirms mock data readiness.

---

## Project Structure

```
src/
├── components/
│   ├── DatabaseManager.tsx    # DB controls: test/refresh/seed
│   └── ui/                    # shadcn/ui components
├── hooks/
│   └── use-tidb.ts            # connection/search/stats hooks (API client)
├── lib/
│   ├── api.ts                 # typed API client for the backend
│   └── utils.ts               # helpers
├── pages/
│   ├── VectorSearch.tsx       # main search UI
│   └── Settings.tsx           # settings + database management
└── main.tsx                   # app bootstrap

server.cjs                     # Express API (auto-reconnect, JS cosine fallback)
```

---

## Scripts

```bash
npm run dev        # Frontend only (Vite)
npm run server     # API only (Express on 3001)
npm run dev:full   # Run API + Frontend together
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Troubleshooting

- White screen: use the printed port (8081 if 8080 busy) and hard refresh (Cmd+Shift+R).
- "Disconnected from TiDB": verify `.env` values, then restart the API (`npm run server`).
- "FUNCTION ... vector_dot_product does not exist": your cluster lacks vector SQL; the API automatically falls back to JS cosine (no action required).
- Port in use: Vite automatically selects the next port (8081, 8082, …).
- Filters error: the app now guards against `null` filters; refresh and try again.

---

## Security

- Do not commit `.env`. Commit `.env.example` only.
- Use strong DB credentials and rotate regularly.
- Enforce HTTPS and secure cookies in production.
- Restrict CORS origins in production.

---

## Contributing

1. Fork the repo
2. Create a feature branch (`feat/...`)
3. Commit with conventional messages (`feat: ...`, `fix: ...`)
4. Open a PR with context and screenshots

---

## License

MIT

## Features

- 🔍 **AI-Powered Vector Search**: Semantic search across security incidents using hash-based embeddings
- 🚨 **Real-time Incident Management**: Track and manage security incidents with full lifecycle support
- 📊 **Advanced Analytics**: AI analysis and threat intelligence dashboard
- 🔐 **Secure Authentication**: Multi-factor authentication and role-based access control
- 🌐 **TiDB Serverless Integration**: Scalable vector database for high-performance search
- 📱 **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Database**: TiDB Serverless (MySQL-compatible with vector search)
- **AI/ML**: Local Hash-based Embeddings
- **State Management**: React Query, Custom Hooks
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ and npm/yarn
- TiDB Serverless account
- OpenAI API key
- Modern web browser

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd incident-guard-ai
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# TiDB Serverless Configuration
VITE_TIDB_HOST=your-tidb-host.tidbcloud.com
VITE_TIDB_PORT=4000
VITE_TIDB_USER=your-username
VITE_TIDB_PASSWORD=your-password
VITE_TIDB_DATABASE=incident_guard_ai

# OpenAI Configuration (for embedding generation)
VITE_OPENAI_API_KEY=your-openai-api-key

# Application Configuration
VITE_APP_ENV=development
```

### 3. TiDB Serverless Setup

1. **Create TiDB Serverless Cluster**:
   - Sign up at [TiDB Cloud](https://tidbcloud.com)
   - Create a new Serverless cluster
   - Note your connection details (host, port, username, password)

2. **Database Configuration**:
   - The application will automatically create the required tables and indexes
   - Vector indexes are created for optimal search performance

### 4. OpenAI API Setup

1. **Get API Key**:
   - Sign up at [OpenAI](https://openai.com)
   - Generate an API key for embeddings
   - Add the key to your `.env` file

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 6. Seed Sample Data

1. Navigate to **Settings** → **Database Management**
2. Click **"Seed Sample Data"** to populate the database with realistic security incidents
3. Each incident is automatically vectorized for semantic search

## Usage

### Vector Search

1. Navigate to **Vector Search** page
2. Enter a natural language description of your security incident
3. Use advanced filters to refine results
4. View similarity scores and apply solutions from similar incidents

### Incident Management

1. Create new incidents with automatic vectorization
2. Update incident details with real-time embedding updates
3. Search across all incidents using semantic similarity

### AI Analysis

1. Use AI-powered analysis tools
2. Generate automated reports
3. Get intelligent recommendations based on historical data

## Database Schema

### Incidents Table

```sql
CREATE TABLE incidents (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
  status ENUM('Active', 'Investigating', 'Contained', 'Resolved', 'Scheduled') NOT NULL,
  timestamp DATETIME NOT NULL,
  resolution TEXT,
  tags JSON,
  sources JSON,
  embedding JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vector index for similarity search
CREATE VECTOR INDEX idx_incident_embedding 
ON incidents(embedding) 
DIMENSION 1536 
METRIC_TYPE COSINE;
```

## API Integration

### Vector Search

```typescript
import { tidbService } from '@/lib/tidb';

// Perform semantic search
const results = await tidbService.vectorSearch(
  "DDoS attack on web servers", 
  { categories: ["Network Security"] },
  10
);
```

### Incident Management

```typescript
// Create new incident
const incident = await tidbService.createIncident({
  id: "INC-2024-001",
  title: "New Security Incident",
  description: "Description of the incident...",
  category: "Network Security",
  severity: "High",
  status: "Active",
  timestamp: new Date().toISOString(),
  tags: ["ddos", "web-infrastructure"],
  sources: ["Firewall", "Network Monitor"]
});

// Update incident
await tidbService.updateIncident("INC-2024-001", {
  status: "Resolved",
  resolution: "Incident resolved by implementing rate limiting"
});
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TIDB_HOST` | TiDB Serverless host | Yes |
| `VITE_TIDB_PORT` | TiDB Serverless port | Yes |
| `VITE_TIDB_USER` | Database username | Yes |
| `VITE_TIDB_PASSWORD` | Database password | Yes |
| `VITE_TIDB_DATABASE` | Database name | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key | Yes |
| `VITE_APP_ENV` | Application environment | No |

### Search Parameters

- **Similarity Threshold**: Minimum similarity score for results (0.0-1.0)
- **Vector Distance**: Maximum distance for vector search
- **Categories**: Filter by incident categories
- **Severity**: Filter by incident severity levels
- **Date Range**: Filter by incident timestamp

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Shadcn/ui components
│   ├── modals/        # Modal components
│   └── DatabaseManager.tsx
├── hooks/             # Custom React hooks
│   ├── use-tidb.ts    # TiDB integration hooks
│   └── use-toast.ts   # Toast notifications
├── lib/               # Utility libraries
│   ├── tidb.ts        # TiDB service
│   ├── seed-data.ts   # Sample data
│   └── utils.ts       # Utility functions
├── pages/             # Page components
│   ├── VectorSearch.tsx
│   ├── Dashboard.tsx
│   └── Settings.tsx
└── main.tsx           # Application entry point
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features

1. **New Incident Types**: Add to the `Incident` interface in `src/lib/tidb.ts`
2. **Custom Filters**: Extend the `SearchFilters` interface
3. **New Components**: Create in `src/components/`
4. **Database Changes**: Update the schema in `src/lib/tidb.ts`

## Troubleshooting

### Common Issues

1. **Connection Failed**:
   - Verify TiDB Serverless credentials
   - Check network connectivity
   - Ensure SSL is properly configured

2. **Vector Search Not Working**:
   - Verify OpenAI API key
   - Check embedding generation
   - Ensure vector index is created

3. **Performance Issues**:
   - Optimize vector index parameters
   - Reduce search result limits
   - Use appropriate filters

### Debug Mode

Enable debug logging by setting `VITE_APP_ENV=development` in your `.env` file.

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement proper authentication and authorization
- Regular security updates and patches
- Monitor API usage and costs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Note**: This application requires TiDB Serverless and OpenAI API access. Please ensure you have the necessary accounts and API keys before running the application.
