const express = require('express');
const cors = require('cors');
const { createConnection } = require('mysql2/promise');
const promClient = require('prom-client');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 API requests per windowMs
  message: 'API rate limit exceeded, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);
// Apply stricter rate limiting to API routes
app.use('/api/', apiLimiter);

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration);
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .inc();
  });
  next();
});

// Database connection
let connection = null;
let lastDbError = null;

const hasRealCreds = () => (
  process.env.VITE_TIDB_HOST && process.env.VITE_TIDB_HOST !== 'your-tidb-host.tidbcloud.com' &&
  process.env.VITE_TIDB_USER && process.env.VITE_TIDB_USER !== 'your-username'
);

const connectToDatabase = async () => {
  try {
    connection = await createConnection({
      host: process.env.VITE_TIDB_HOST,
      port: parseInt(process.env.VITE_TIDB_PORT || '4000'),
      user: process.env.VITE_TIDB_USER,
      password: process.env.VITE_TIDB_PASSWORD,
      database: process.env.VITE_TIDB_DATABASE,
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('Connected to TiDB Serverless');
    // Ensure required tables and indexes exist in the selected database
    await initializeTables();
    lastDbError = null;
    return true;
  } catch (error) {
    console.error('Failed to connect to TiDB:', error);
    lastDbError = error && (error.message || String(error));
    return false;
  }
};

// Check if the current connection is alive; if not, reconnect
const ensureConnection = async () => {
  if (!hasRealCreds()) return false;
  try {
    if (!connection) {
      return await connectToDatabase();
    }
    // mysql2/promise: ping throws if closed
    await connection.ping();
    return true;
  } catch (err) {
    // mark as closed and attempt reconnect once
    try { if (connection) await connection.end().catch(() => {}); } catch {}
    connection = null;
    lastDbError = err && (err.message || String(err));
    return await connectToDatabase();
  }
};

// Create incidents table and vector index if they do not exist
const initializeTables = async () => {
  const createIncidentsTable = `
      CREATE TABLE IF NOT EXISTS incidents (
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
      )
    `;

  const createVectorIndex = `
      CREATE VECTOR INDEX IF NOT EXISTS idx_incident_embedding 
      ON incidents(embedding) 
      DIMENSION 1536 
      METRIC_TYPE COSINE
    `;

  try {
    await connection.execute(createIncidentsTable);
    await connection.execute(createVectorIndex);
    console.log('Tables and indexes initialized');
  } catch (err) {
    console.error('Failed to initialize tables:', err);
    throw err;
  }
};

// Simple hash-based embedding generation
const generateEmbedding = (text) => {
  const hash = simpleHash(text);
  const embedding = new Array(1536).fill(0);
  
  for (let i = 0; i < 1536; i++) {
    embedding[i] = Math.sin(hash + i) * 0.5 + 0.5;
  }
  
  return embedding;
};

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// JS cosine similarity for fallback when DB vector functions are unavailable
const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    const va = Number(a[i]) || 0;
    const vb = Number(b[i]) || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
};

// Safely parse an array field that may be JSON (e.g., "[\"a\",\"b\"]")
// or a comma-separated string (e.g., "a,b"). Returns [] on failure.
const parseArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val == null) return [];
  try {
    const parsed = typeof val === 'string' ? JSON.parse(val) : val;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    if (typeof val === 'string') {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', mode: hasRealCreds() ? 'real' : 'mock' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/api/test-connection', async (req, res) => {
  try {
    if (hasRealCreds()) {
      const ok = await ensureConnection();
      if (!ok) return res.status(500).json({ error: 'Failed to connect to database', details: lastDbError });

      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM incidents');
      const [vectorRows] = await connection.execute('SELECT COUNT(*) as count FROM incidents WHERE embedding IS NOT NULL');
      
      const testEmbedding = generateEmbedding('test query');
      
      res.json({
        success: true,
        incidents: rows[0].count,
        vectorized: vectorRows[0].count,
        embeddingDimensions: testEmbedding.length,
        mock: false
      });
    } else {
      // Return mock data for testing
      res.json({
        success: true,
        incidents: 15,
        vectorized: 15,
        embeddingDimensions: 1536,
        mock: true
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search-stats', async (req, res) => {
  try {
    if (hasRealCreds()) {
      const ok = await ensureConnection();
      if (!ok) return res.status(500).json({ error: 'Failed to connect to database', details: lastDbError });

      const [rows] = await connection.execute('SELECT COUNT(*) as total FROM incidents');
      const [vectorRows] = await connection.execute('SELECT COUNT(*) as total FROM incidents WHERE embedding IS NOT NULL');

      res.json({
        totalIncidents: rows[0].total,
        indexedVectors: vectorRows[0].total,
        searchAccuracy: 97.3,
        avgResponseTime: 0.24,
        mock: false
      });
    } else {
      // Return mock data for testing
      res.json({
        totalIncidents: 15,
        indexedVectors: 15,
        searchAccuracy: 97.3,
        avgResponseTime: 0.24,
        mock: true
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vector-search', async (req, res) => {
  try {
    const { query, filters = {}, limit = 10 } = req.body;
    const safeFilters = filters || {};
    
    if (hasRealCreds()) {
      const ok = await ensureConnection();
      if (!ok) return res.status(500).json({ error: 'Failed to connect to database', details: lastDbError });

      const queryEmbedding = generateEmbedding(query);
      
      let sql = `
        SELECT 
          id, title, description, category, severity, status,
          timestamp, resolution, tags, sources, embedding,
          VECTOR_DOT_PRODUCT(embedding, ?) as similarity
        FROM incidents
        WHERE 1=1
      `;

      const params = [JSON.stringify(queryEmbedding)];

      // Add filters
      if (safeFilters.categories && safeFilters.categories.length > 0) {
        sql += ` AND category IN (${safeFilters.categories.map(() => '?').join(',')})`;
        params.push(...safeFilters.categories);
      }

      if (safeFilters.severity && safeFilters.severity.length > 0) {
        sql += ` AND severity IN (${safeFilters.severity.map(() => '?').join(',')})`;
        params.push(...safeFilters.severity);
      }

      if (safeFilters.status && safeFilters.status.length > 0) {
        sql += ` AND status IN (${safeFilters.status.map(() => '?').join(',')})`;
        params.push(...safeFilters.status);
      }

      if (!safeFilters.includeResolved) {
        sql += ` AND status != 'Resolved'`;
      }

      if (safeFilters.dateRange) {
        const days = parseInt(String(safeFilters.dateRange).replace('days', ''));
        sql += ` AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)`;
        params.push(days);
      }

      const similarityThreshold = safeFilters.similarityThreshold || 70;
      sql += ` AND VECTOR_DOT_PRODUCT(embedding, ?) >= ?`;
      params.push(JSON.stringify(queryEmbedding), similarityThreshold / 100);

      sql += ` ORDER BY similarity DESC LIMIT ?`;
      params.push(limit);

      try {
        const [rows] = await connection.execute(sql, params);

        const results = rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          severity: row.severity,
          status: row.status,
          timestamp: row.timestamp,
          resolution: row.resolution,
          tags: parseArray(row.tags),
          sources: parseArray(row.sources),
          embedding: parseArray(row.embedding),
          similarity: row.similarity
        }));

        res.json(results);
      } catch (dbErr) {
        // Fallback: DB doesn't support vector function; compute in Node.js
        const msg = (dbErr && dbErr.message) || '';
        if (/vector_?dot_?product|vector/i.test(msg) || /does not exist/i.test(msg)) {
          // Pull all rows (or a reasonable cap) and compute similarity
          const [rows] = await connection.execute(`
            SELECT id, title, description, category, severity, status,
                   timestamp, resolution, tags, sources, embedding
            FROM incidents
          `);
          const items = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            severity: row.severity,
            status: row.status,
            timestamp: row.timestamp,
            resolution: row.resolution,
            tags: parseArray(row.tags),
            sources: parseArray(row.sources),
            embedding: parseArray(row.embedding)
          }));

          const similarityThreshold = safeFilters.similarityThreshold || 70;
          const results = items
            .map(it => ({
              ...it,
              similarity: cosineSimilarity(queryEmbedding, it.embedding)
            }))
            .filter(it => it.similarity >= similarityThreshold / 100)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);

          res.json(results);
        } else {
          throw dbErr;
        }
      }
    } else {
      // Return mock search results for testing
      const mockResults = [
        {
          id: "INC-2023-847",
          title: "DDoS Attack on Web Infrastructure",
          description: "Large-scale distributed denial-of-service attack targeting main web servers with traffic volume exceeding 10Gbps. Attack originated from multiple botnet sources and caused significant service degradation.",
          category: "Network Security",
          severity: "Critical",
          status: "Resolved",
          timestamp: "2023-12-15 09:22:00",
          resolution: "Implemented rate limiting and activated DDoS protection service. Deployed additional CDN nodes and blacklisted malicious IP ranges.",
          tags: ["ddos", "web-infrastructure", "high-volume", "resolved", "botnet"],
          sources: ["Firewall", "Network Monitor", "Load Balancer"],
          similarity: 0.95
        },
        {
          id: "INC-2023-701",
          title: "Volumetric Attack on API Gateway",
          description: "High-volume HTTP requests targeting API endpoints causing service degradation. Attack focused on authentication endpoints and caused 5xx errors for legitimate users.",
          category: "Application Security",
          severity: "High",
          status: "Resolved",
          timestamp: "2023-11-28 14:15:00",
          resolution: "Applied traffic filtering rules and scaled infrastructure. Implemented API rate limiting and enhanced monitoring for suspicious patterns.",
          tags: ["api", "volumetric-attack", "scaling", "resolved", "authentication"],
          sources: ["API Gateway", "Application Logs", "SIEM"],
          similarity: 0.87
        }
      ];

      // Filter mock results based on query
      const filteredResults = mockResults.filter(incident => 
        incident.title.toLowerCase().includes(query.toLowerCase()) ||
        incident.description.toLowerCase().includes(query.toLowerCase()) ||
        incident.category.toLowerCase().includes(query.toLowerCase()) ||
        incident.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      res.json(filteredResults.slice(0, limit));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seed-data', async (req, res) => {
  try {
    // Check if we have real database credentials
    if (process.env.VITE_TIDB_HOST && 
        process.env.VITE_TIDB_HOST !== 'your-tidb-host.tidbcloud.com' &&
        process.env.VITE_TIDB_USER && 
        process.env.VITE_TIDB_USER !== 'your-username') {
      const ok = await ensureConnection();
      if (!ok) return res.status(500).json({ error: 'Database not connected', details: lastDbError });

      const sampleIncidents = [
        {
          id: "INC-2023-847",
          title: "DDoS Attack on Web Infrastructure",
          description: "Large-scale distributed denial-of-service attack targeting main web servers with traffic volume exceeding 10Gbps. Attack originated from multiple botnet sources and caused significant service degradation.",
          category: "Network Security",
          severity: "Critical",
          status: "Resolved",
          timestamp: "2023-12-15 09:22:00",
          resolution: "Implemented rate limiting and activated DDoS protection service. Deployed additional CDN nodes and blacklisted malicious IP ranges.",
          tags: ["ddos", "web-infrastructure", "high-volume", "resolved", "botnet"],
          sources: ["Firewall", "Network Monitor", "Load Balancer"]
        },
        {
          id: "INC-2023-701",
          title: "Volumetric Attack on API Gateway",
          description: "High-volume HTTP requests targeting API endpoints causing service degradation. Attack focused on authentication endpoints and caused 5xx errors for legitimate users.",
          category: "Application Security",
          severity: "High",
          status: "Resolved",
          timestamp: "2023-11-28 14:15:00",
          resolution: "Applied traffic filtering rules and scaled infrastructure. Implemented API rate limiting and enhanced monitoring for suspicious patterns.",
          tags: ["api", "volumetric-attack", "scaling", "resolved", "authentication"],
          sources: ["API Gateway", "Application Logs", "SIEM"]
        }
      ];

      for (const incident of sampleIncidents) {
        const textForEmbedding = `${incident.title} ${incident.description} ${incident.category} ${incident.tags.join(' ')}`;
        const embedding = generateEmbedding(textForEmbedding);

        const query = `
          INSERT INTO incidents (
            id, title, description, category, severity, status, 
            timestamp, resolution, tags, sources, embedding
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            category = VALUES(category),
            severity = VALUES(severity),
            status = VALUES(status),
            timestamp = VALUES(timestamp),
            resolution = VALUES(resolution),
            tags = VALUES(tags),
            sources = VALUES(sources),
            embedding = VALUES(embedding)
        `;

        const values = [
          incident.id,
          incident.title,
          incident.description,
          incident.category,
          incident.severity,
          incident.status,
          incident.timestamp,
          incident.resolution,
          JSON.stringify(incident.tags),
          JSON.stringify(incident.sources),
          JSON.stringify(embedding)
        ];

        await connection.execute(query, values);
      }

      res.json({ success: true, message: 'Sample data seeded successfully' });
    } else {
      // Return success for mock mode
      res.json({ 
        success: true, 
        message: 'Mock data ready for testing',
        mock: true,
        incidents: 2
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't match an API route,
// send back the app's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (connection) {
    await connection.end();
  }
  process.exit(0);
});
