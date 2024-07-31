export interface SolicitudMuestra {
  idSolicitudMuestra?: number; // El campo puede ser opcional al crear una nueva solicitud
  solicitante: string;
  nombreMp: string;
  lote: string;
  proveedor: string;
  urgencia: string;
  fecha: Date;
  estado: 'Pendiente' | 'En Laboratorio' | 'En Almacén' | 'En Expediciones' | 'Completada';
  codigoArticulo: string;
  comentarios: string;
  mensajes: Mensaje[];
  archivos?: {name: string, url: string}[];

}


export interface Mensaje {
  remitente: string;
  contenido: string;
  fecha: Date;
  solicitudMuestraId: number;
}
