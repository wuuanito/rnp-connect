export interface QualityControl {
  id?: number;
  fecha: Date;
  pais: string;
  tipo: string;
  empresa: string;
  tipoMP: string;
  codigo: string;
  gmp: boolean;
  fsm: boolean;
  fPrimerEnvio: Date | null;
  fVisita1: Date | null;
  fVisita2: Date | null;
  aprobadoQA: boolean;
  aprobadoDT: boolean;
  estado: string;
  comentarios: string;
  creadoPor: string;
  ultimaModificacion: Date;
  modificadoPor: string;
}

export interface QualityControlUpdate {
  field: keyof QualityControl;
  value: any;
  id: number;
}
