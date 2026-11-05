export type Course = {
  id: string
  unitId?: number
  title: string
  topic: string
  topicId: number
  description: string
  difficulty: string
  samplePublic: boolean
  progress: number
  kind: 'Aprende' | 'NormaMatch' | 'CasoTech'
  color: 'teal' | 'amber' | 'blue'
}
