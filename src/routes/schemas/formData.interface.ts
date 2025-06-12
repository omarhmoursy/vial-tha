export interface IFormData {
  id: string
  question: string
  answer: string
}

export interface ICountedFormData {
  total: number
  formData: IFormData[]
}
