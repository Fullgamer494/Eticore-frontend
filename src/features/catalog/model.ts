import type { CatalogItem } from './api'
import type { Course } from '../../shared/types/course'

export function mapCatalogItem(item: CatalogItem): Course {
  const type = item.tipo === 'casotech' ? 'CasoTech' : item.tipo === 'normamatch' ? 'NormaMatch' : 'Aprende'
  return {
    id: String(item.id),
    unitId: item.id,
    title: item.titulo,
    topic: item.tema.nombre,
    topicId: item.tema.id,
    description: item.descripcion,
    difficulty: item.dificultad === 'basico' ? 'Básico' : item.dificultad === 'intermedio' ? 'Intermedio' : 'Especializado',
    samplePublic: item.muestra_publica,
    progress: item.completada ? 100 : 0,
    kind: type,
    color: type === 'CasoTech' ? 'amber' : type === 'NormaMatch' ? 'blue' : 'teal',
  }
}
