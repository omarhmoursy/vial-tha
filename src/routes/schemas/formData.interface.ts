export interface IQuery {
  id: string
  title: string
  description: string | null
  status: 'OPEN' | 'RESOLVED'
  createdAt: Date
  updatedAt: Date
  formDataId: string
}

export interface IFormData {
  id: string
  question: string
  answer: string
  query?: IQuery | null  // Optional query relationship
}

export interface ICountedFormData {
  total: number
  formData: IFormData[]
}
