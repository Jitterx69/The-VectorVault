const API_BASE_URL = 'http://localhost:3001/api';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Investigating' | 'Contained' | 'Resolved' | 'Scheduled';
  timestamp: string;
  resolution?: string;
  tags: string[];
  sources: string[];
  embedding?: number[];
  similarity?: number;
}

export interface SearchFilters {
  dateRange?: string;
  categories?: string[];
  severity?: string[];
  similarityThreshold?: number;
  status?: string[];
  sources?: string[];
  tags?: string[];
  includeResolved?: boolean;
  vectorDistance?: number;
  minConfidence?: number;
}

export interface SearchStats {
  totalIncidents: number;
  indexedVectors: number;
  searchAccuracy: number;
  avgResponseTime: number;
}

export interface AttackPrediction {
  success: boolean;
  input: number[];
  prediction: {
    attackName: string;
    confidence: number;
    summary: string;
    points: string[];
    foundInDatabase: boolean;
  };
  timestamp: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async testConnection(): Promise<{
    success: boolean;
    incidents: number;
    vectorized: number;
    embeddingDimensions: number;
  }> {
    return this.request('/test-connection');
  }

  async getSearchStats(): Promise<SearchStats> {
    return this.request('/search-stats');
  }

  async vectorSearch(
    query: string,
    filters: SearchFilters = {},
    limit: number = 10
  ): Promise<Incident[]> {
    return this.request('/vector-search', {
      method: 'POST',
      body: JSON.stringify({ query, filters, limit }),
    });
  }

  async predictAttack(
    part1: string,
    part2: string,
    part3: string
  ): Promise<AttackPrediction> {
    return this.request('/predict-attack', {
      method: 'POST',
      body: JSON.stringify({ part1, part2, part3 }),
    });
  }

  async seedData(): Promise<{ success: boolean; message: string }> {
    return this.request('/seed-data', {
      method: 'POST',
    });
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
