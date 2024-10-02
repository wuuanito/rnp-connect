export interface SolicitudMuestra {
  idSolicitudMuestra?: number;
  solicitante: string;
  nombreMp: string;
  lote: string;
  proveedor: string;
  urgencia: string;
  fecha: Date;
  estado: "Pendiente" | "En Laboratorio" | "En Almacén" | "En Expediciones" | "Completada" | "Finalizado" | "En Laboratorio - Enviado a Almacén";
  codigoArticulo: string;
  comentarios: string;
  mensajes: Mensaje[];
  archivos?: {name: string, url: string}[];
  expediciones?: boolean;
  laboratorio?: boolean; // Nueva propiedad añadida como opcional
  almacen?: boolean;
  estadoAlmacen?: string;
  mensajesNoLeidos?: number;
  tipoAnalisis?: string;
}


export interface Mensaje {
  remitente: string;
  contenido: string;
  fecha: Date;
  solicitudMuestraId: number;
}
