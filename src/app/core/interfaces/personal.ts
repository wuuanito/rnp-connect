// solicitud.model.ts
export interface Personal {
  id?: number;
  nombreSolicitante: string;
  numeroCandidatos: number; // Añadimos este campo
  puesto: string;
  fechaInicio: string;
  estado: string;
  tipoContrato: string;
  departamento: string;
  experiencia: string;
  justificacion: string;
  notas?: string; // Hacemos este campo opcional
}
