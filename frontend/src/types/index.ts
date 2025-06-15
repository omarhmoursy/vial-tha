/**
 * Type definitions for the Clinical Trial Query Management Application
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * These types ensure type safety and provide clear contracts between components and the API.
 */

/**
 * Form data from clinical trial with optional associated query (1:0..1 relationship)
 */
export interface FormData {
  /** Unique identifier for the form data record */
  id: string;
  /** The question asked to the patient/participant */
  question: string;
  /** The answer provided by the patient/participant */
  answer: string;
  /** Associated query for data quality review, null if no query exists */
  query: Query | null;
}

/**
 * Data quality query for clinical trial form data
 */
export interface Query {
  /** Unique identifier for the query */
  id: string;
  /** Query title (typically the question being queried) */
  title: string;
  /** Detailed description of the query or resolution */
  description: string;
  /** Current status of the query */
  status: QueryStatus;
  /** ISO timestamp when the query was created */
  createdAt: string;
  /** ISO timestamp when the query was last updated */
  updatedAt: string;
  /** Foreign key reference to the associated FormData */
  formDataId: string;
}

/**
 * Query workflow status
 */
export enum QueryStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED'
}

/**
 * Request payload for creating a new query
 * Used when data managers identify issues that need review
 */
export interface CreateQueryRequest {
  /** Title for the query (auto-populated from the question) */
  title: string;
  /** Detailed description of what needs to be reviewed */
  description: string;
  /** ID of the FormData record this query relates to */
  formDataId: string;
}

/**
 * Request payload for updating an existing query
 * Used primarily for resolving queries with updated descriptions
 */
export interface UpdateQueryRequest {
  /** New status for the query (optional) */
  status?: QueryStatus;
  /** Updated description (optional) */
  description?: string;
}

/**
 * Standard API response wrapper used by the backend
 * Provides consistent response structure across all endpoints
 */
export interface ApiResponse<T> {
  /** HTTP status code */
  statusCode: number;
  /** Response payload data */
  data: T;
  /** Success or error message */
  message: string;
}

/**
 * Response structure for the form-data endpoint
 * Contains array of FormData with included Query relationships
 */
export interface FormDataResponse {
  /** Array of form data records with associated queries */
  formData: FormData[];
} 