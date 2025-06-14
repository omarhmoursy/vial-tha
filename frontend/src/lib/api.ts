import { 
  FormData, 
  Query, 
  CreateQueryRequest, 
  UpdateQueryRequest, 
  ApiResponse, 
  FormDataResponse 
} from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8080';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

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

export const api = {
  // Get all form data with related queries
  async getFormData(): Promise<FormData[]> {
    const response = await fetchApi<ApiResponse<FormDataResponse>>('/form-data');
    return response.data.formData;
  },

  // Create a new query
  async createQuery(data: CreateQueryRequest): Promise<Query> {
    const response = await fetchApi<ApiResponse<Query>>('/queries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // Update an existing query
  async updateQuery(id: string, data: UpdateQueryRequest): Promise<Query> {
    const response = await fetchApi<ApiResponse<Query>>(`/queries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // Delete a query (bonus endpoint)
  async deleteQuery(id: string): Promise<void> {
    await fetchApi(`/queries/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError }; 