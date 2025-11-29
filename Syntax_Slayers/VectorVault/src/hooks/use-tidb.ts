import { useState, useEffect, useCallback } from 'react';
import { apiClient, Incident, SearchFilters, SearchStats } from '@/lib/api';
import { useToast } from './use-toast';

export const useTiDBConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const result = await apiClient.testConnection();
      if (result.success) {
        setIsConnected(true);
        if (result.mock) {
          toast({
            title: "Mock Mode Active",
            description: "Using mock data for testing. No real database connection.",
          });
        } else {
          toast({
            title: "Connected to TiDB Serverless",
            description: "Vector search database is ready",
          });
        }
      } else {
        throw new Error('Connection test failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to TiDB';
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
    toast({
      title: "Disconnected from TiDB",
      description: "Database connection closed",
    });
  }, [toast]);

  useEffect(() => {
    // Auto-connect on mount
    connect();
  }, [connect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};

export const useVectorSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Incident[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { toast } = useToast();

  const performSearch = useCallback(async (
    query: string, 
    filters: SearchFilters = {}, 
    limit: number = 10
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await apiClient.vectorSearch(query, filters, limit);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search query or filters",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setSearchError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    isSearching,
    searchResults,
    searchError,
    performSearch,
    clearSearch,
  };
};

export const useIncidentManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createIncident = useCallback(async (incident: Omit<Incident, 'embedding'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const createdIncident = await tidbService.createIncident(incident);
      toast({
        title: "Incident Created",
        description: `Incident ${createdIncident.id} has been created and indexed`,
      });
      return createdIncident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create incident';
      setError(errorMessage);
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateIncident = useCallback(async (id: string, updates: Partial<Incident>) => {
    setIsLoading(true);
    setError(null);

    try {
      await tidbService.updateIncident(id, updates);
      toast({
        title: "Incident Updated",
        description: `Incident ${id} has been updated`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update incident';
      setError(errorMessage);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getIncident = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const incident = await tidbService.getIncidentById(id);
      if (!incident) {
        throw new Error('Incident not found');
      }
      return incident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch incident';
      setError(errorMessage);
      toast({
        title: "Fetch Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    error,
    createIncident,
    updateIncident,
    getIncident,
  };
};

export const useSearchStats = () => {
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchStats = await apiClient.getSearchStats();
      setStats(searchStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
