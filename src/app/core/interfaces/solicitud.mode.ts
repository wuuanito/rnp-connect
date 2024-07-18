// solicitud.model.ts
export interface Solicitud {
  id_solicitud: number;
  nombre_solicitud: string;
  fecha: string;
  tipo: string;
  estado: string;
  prioridad: string;
  descripcion: string;
  respuesta: string | null;
  id_departamento: number;
  enviado_por: number;
  enviado_a: number;
}
