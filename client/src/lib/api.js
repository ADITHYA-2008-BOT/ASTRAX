import { authService } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Standard HTTP Fetch Wrapper with Authorization & Error Parsing
 */
async function apiRequest(endpoint, options = {}) {
  const token = await authService.getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg =
      data?.error?.message ||
      data?.error?.details?.map((d) => `${d.field}: ${d.message}`).join(', ') ||
      `API Error (${response.status}): ${response.statusText}`;

    const errorObj = new Error(errorMsg);
    errorObj.status = response.status;
    errorObj.code = data?.error?.code;
    errorObj.details = data?.error?.details;
    throw errorObj;
  }

  return data;
}

export const api = {
  /**
   * Fetch all theories with optional search and filters
   */
  async getTheories(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.framework && filters.framework !== 'All') params.append('framework', filters.framework);
    if (filters.tag && filters.tag !== 'All') params.append('tag', filters.tag);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/theories${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  /**
   * Fetch single theory by UUID
   */
  async getTheoryById(id) {
    return apiRequest(`/api/theories/${id}`);
  },

  /**
   * Submit new theory
   */
  async createTheory(theoryData) {
    return apiRequest('/api/theories', {
      method: 'POST',
      body: JSON.stringify(theoryData),
    });
  },

  /**
   * Summarize theory with Google Gemini AI
   */
  async summarizeTheory(payload) {
    return apiRequest('/api/theories/summarize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Upvote a theory
   */
  async upvoteTheory(id) {
    return apiRequest(`/api/theories/${id}/upvote`, {
      method: 'POST',
    });
  },

  /**
   * Check Backend & Cybersecurity Health
   */
  async getHealth() {
    return apiRequest('/api/health');
  },
};
