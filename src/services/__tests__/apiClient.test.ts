// Tests for apiClient

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient, createApiClient } from '../apiClient';

// Mock fetch
global.fetch = vi.fn();

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = createApiClient({ baseURL: 'https://api.test.com' });
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: async () => ({ data: 'test' }),
      });

      const response = await apiClient.get<{ data: string }>('/test');

      expect(response.data).toEqual({ data: 'test' });
      expect(response.status).toBe(200);
    });
  });

  describe('POST requests', () => {
    it('makes successful POST request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers(),
        json: async () => ({ id: '1' }),
      });

      const response = await apiClient.post<{ id: string }>('/test', { name: 'Test' });

      expect(response.data).toEqual({ id: '1' });
      expect(response.status).toBe(201);
    });
  });

  describe('Error handling', () => {
    it('throws error on non-OK response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow('Bad request');
    });

    it('retries on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({ data: 'success' }),
        });

      const response = await apiClient.get('/test');

      expect(response.data).toEqual({ data: 'success' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interceptors', () => {
    it('applies request interceptors', async () => {
      const interceptor = vi.fn((config) => {
        config.headers = { ...config.headers, 'X-Custom': 'test' };
        return config;
      });

      apiClient.addRequestInterceptor(interceptor);

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({}),
      });

      await apiClient.get('/test');

      expect(interceptor).toHaveBeenCalled();
    });
  });
});
