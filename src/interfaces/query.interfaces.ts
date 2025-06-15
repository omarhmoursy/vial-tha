/**
 * TypeScript interfaces for Query Management API
 * 
 * This file defines the request/response contracts for the query management endpoints.
 * These interfaces ensure type safety and provide clear API documentation.
 * 
 * Design Principles:
 * - Request interfaces define required input validation
 * - Response interfaces match the database model structure
 * - Optional fields support partial updates and flexible workflows
 */

/**
 * Request payload for creating a new query
 * 
 * Used when data managers identify form data that requires review.
 * The title is typically auto-populated from the FormData question
 * to maintain context and consistency.
 * 
 * Business Logic:
 * - Backend validates that FormData exists
 * - Prevents duplicate queries per FormData (enforced by unique constraint)
 * - Description must be meaningful to explain what needs review
 */
export interface ICreateQueryRequest {
  /** Query title - typically the question being queried for context */
  title: string;
  
  /** Detailed description of what needs to be reviewed or clarified */
  description: string;
  
  /** ID of the FormData record this query relates to */
  formDataId: string;
}

/**
 * Request payload for updating an existing query
 * 
 * Primarily used for resolving queries but supports partial updates.
 * All fields are optional to enable flexible update scenarios.
 * 
 * Common Use Cases:
 * - Resolving: { status: "RESOLVED", description: "Resolution details..." }
 * - Updating description only: { description: "Updated details..." }
 */
export interface IUpdateQueryRequest {
  /** New status for the query (optional) */
  status?: "OPEN" | "RESOLVED";
  
  /** Updated description (optional) - often used for resolution notes */
  description?: string;
}

/**
 * API response structure for query operations
 * 
 * Matches the database Query model structure with string timestamps
 * for JSON serialization compatibility.
 * 
 * This interface is used for:
 * - Individual query creation responses
 * - Query update responses  
 * - Query retrieval responses
 */
export interface IQueryResponse {
  /** Unique identifier for the query */
  id: string;
  
  /** Query title (typically the question being queried) */
  title: string;
  
  /** Query description or resolution notes */
  description: string;
  
  /** Current query status */
  status: "OPEN" | "RESOLVED";
  
  /** ISO timestamp when the query was created (audit trail) */
  createdAt: string;
  
  /** ISO timestamp when the query was last updated (audit trail) */
  updatedAt: string;
  
  /** Foreign key reference to the associated FormData */
  formDataId: string;
} 