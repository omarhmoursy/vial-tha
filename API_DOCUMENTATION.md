# Query Management API Documentation

## Overview

The Query Management API provides endpoints for managing clinical trial data quality queries. It supports creating, updating, and deleting queries associated with form data entries.

**Base URL:** `http://127.0.0.1:8080`

## Authentication

Currently, no authentication is required for API access.

## Response Format

All API responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "success"
}
```

## Error Handling

Error responses include:
- `statusCode`: HTTP status code
- `message`: Error description

Common error codes:
- `400`: Bad Request - Invalid input or business rule violation
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error

---

## Endpoints

### 1. Get Form Data with Queries

Retrieves all form data entries with their associated queries.

**Endpoint:** `GET /form-data`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "total": 10,
    "formData": [
      {
        "id": "cm123abc",
        "question": "What is your age?",
        "answer": "25",
        "query": {
          "id": "cm456def",
          "title": "What is your age?",
          "description": "Age seems unusually low for this study",
          "status": "OPEN",
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "formDataId": "cm123abc"
        }
      },
      {
        "id": "cm789ghi",
        "question": "What is your weight?",
        "answer": "70kg",
        "query": null
      }
    ]
  },
  "message": "success"
}
```

**cURL Example:**
```bash
curl --location 'http://127.0.0.1:8080/form-data' \
--header 'Content-Type: application/json'
```

---

### 2. Create Query

Creates a new query for a specific form data entry.

**Endpoint:** `POST /queries`

**Request Body:**
```json
{
  "title": "What is your age?",
  "description": "Age seems unusually low for this study",
  "formDataId": "cm123abc"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "id": "cm456def",
    "title": "What is your age?",
    "description": "Age seems unusually low for this study",
    "status": "OPEN",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "formDataId": "cm123abc"
  },
  "message": "success"
}
```

**Business Rules:**
- FormData must exist
- Only one query per FormData entry is allowed
- Status is automatically set to "OPEN"

**Error Responses:**
- `404`: FormData not found
- `400`: Query already exists for this FormData

**cURL Example:**
```bash
curl --location 'http://127.0.0.1:8080/queries' \
--header 'Content-Type: application/json' \
--data '{
  "title": "What is your age?",
  "description": "Age seems unusually low for this study",
  "formDataId": "cm123abc"
}'
```

---

### 3. Update Query

Updates an existing query's status and/or description.

**Endpoint:** `PUT /queries/:id`

**Path Parameters:**
- `id` (string): Query ID

**Request Body:**
```json
{
  "status": "RESOLVED",
  "description": "Age verified with source documents - correct as entered"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "id": "cm456def",
    "title": "What is your age?",
    "description": "Age verified with source documents - correct as entered",
    "status": "RESOLVED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:45:00.000Z",
    "formDataId": "cm123abc"
  },
  "message": "success"
}
```

**Valid Status Values:**
- `OPEN`: Query requires attention
- `RESOLVED`: Query has been resolved

**Error Responses:**
- `404`: Query not found

**cURL Example:**
```bash
curl --location --request PUT 'http://127.0.0.1:8080/queries/cm456def' \
--header 'Content-Type: application/json' \
--data '{
  "status": "RESOLVED",
  "description": "Age verified with source documents - correct as entered"
}'
```

---

### 4. Delete Query (Bonus Feature)

Permanently deletes a query from the system.

**Endpoint:** `DELETE /queries/:id`

**Path Parameters:**
- `id` (string): Query ID

**Response:**
- Status: `204 No Content`
- Body: Empty

**Error Responses:**
- `404`: Query not found

**cURL Example:**
```bash
curl --location --request DELETE 'http://127.0.0.1:8080/queries/cm456def'
```

---

## Data Models

### FormData
```typescript
interface FormData {
  id: string;           // Unique identifier
  question: string;     // Question asked to participant
  answer: string;       // Participant's answer
  query: Query | null;  // Associated query (if any)
}
```

### Query
```typescript
interface Query {
  id: string;          // Unique identifier
  title: string;       // Query title (usually the question)
  description: string; // Query description or resolution notes
  status: "OPEN" | "RESOLVED"; // Current status
  createdAt: string;   // ISO timestamp when created
  updatedAt: string;   // ISO timestamp when last updated
  formDataId: string;  // Reference to associated FormData
}
```

---

## Workflow Example

### Creating and Resolving a Query

1. **Get form data to identify issues:**
   ```bash
   curl --location 'http://127.0.0.1:8080/form-data'
   ```

2. **Create a query for suspicious data:**
   ```bash
   curl --location 'http://127.0.0.1:8080/queries' \
   --header 'Content-Type: application/json' \
   --data '{
     "title": "What is your age?",
     "description": "Age seems unusually low for this study",
     "formDataId": "cm123abc"
   }'
   ```

3. **Resolve the query after investigation:**
   ```bash
   curl --location --request PUT 'http://127.0.0.1:8080/queries/cm456def' \
   --header 'Content-Type: application/json' \
   --data '{
     "status": "RESOLVED",
     "description": "Age verified with source documents - correct as entered"
   }'
   ```

---

## Database

The API uses PostgreSQL with Prisma ORM. The database includes:
- `form_data` table: Stores clinical trial form responses
- `queries` table: Stores data quality queries
- Foreign key relationship: `queries.form_data_id` → `form_data.id` 