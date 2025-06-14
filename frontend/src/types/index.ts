export interface FormData {
  id: string;
  question: string;
  answer: string;
  query: Query | null;
}

export interface Query {
  id: string;
  title: string;
  description: string;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  formDataId: string;
}

export enum QueryStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED'
}

export interface CreateQueryRequest {
  title: string;
  description: string;
  formDataId: string;
}

export interface UpdateQueryRequest {
  status?: QueryStatus;
  description?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface FormDataResponse {
  formData: FormData[];
} 