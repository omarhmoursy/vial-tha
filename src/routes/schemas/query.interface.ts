export interface ICreateQueryRequest {
  title: string
  description?: string
  formDataId: string
}

export interface IUpdateQueryRequest {
  description?: string
  status?: 'OPEN' | 'RESOLVED'
}

export interface IQueryResponse {
  id: string
  title: string
  description: string | null
  status: 'OPEN' | 'RESOLVED'
  createdAt: Date
  updatedAt: Date
  formDataId: string
}
