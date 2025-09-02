export type ServiceType = 'planned' | 'unplanned' | 'emergency'

export interface ServiceDraft {
  id: string
  providerId: string
  serviceOrder: string
  carId: string
  odometer: number | null
  engineHours: number | null
  startDate: string
  endDate: string
  type: ServiceType | null
  serviceDescription: string
  savingStatus: 'idle' | 'saving' | 'saved'
  updatedAt: number
}

export interface ServiceLog {
  id: string
  createdAt: number
  providerId: string
  serviceOrder: string
  carId: string
  odometer: number
  engineHours: number
  startDate: string
  endDate: string
  type: ServiceType
  serviceDescription: string
}
