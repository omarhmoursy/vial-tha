/**
 * API Client for Clinical Trial Query Management System
 */

import { 
  FormData, 
  Query, 
  CreateQueryRequest, 
  UpdateQueryRequest, 
  ApiResponse, 
  FormDataResponse 
} from '@/types';

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vial-query-backend.onrender.com';


/** Custom error class for API-related errors */
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Generic fetch wrapper with error handling and JSON headers */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }

  return response.json();
}

/** API client methods */
export const api = {
  /** Fetch all form data with related query information */
  async getFormData(): Promise<FormData[]> {
    const response = await fetchApi<ApiResponse<FormDataResponse>>('/form-data');
    return response.data.formData;
  },

  /** Create a new query for a FormData record */
  async createQuery(data: CreateQueryRequest): Promise<Query> {
    const response = await fetchApi<ApiResponse<Query>>('/queries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /** Update an existing query (primarily for resolution) */
  async updateQuery(id: string, data: UpdateQueryRequest): Promise<Query> {
    const response = await fetchApi<ApiResponse<Query>>(`/queries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /** Delete a query (bonus feature) */
  async deleteQuery(id: string): Promise<void> {
    await fetchApi(`/queries/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError }; 