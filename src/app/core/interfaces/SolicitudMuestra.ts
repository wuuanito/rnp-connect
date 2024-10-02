export interface SolicitudMuestra {
  idSolicitudMuestra?: number;
  solicitante: string;
  nombreMp: string;
  lote: string;
  proveedor: string;
  urgencia: string;
  fecha: Date;
  estado: "Pendiente" | "En Laboratorio" | "En Almacén" | "En Expediciones" | "Completada" | "Finalizado";
  codigoArticulo: string;
  comentarios: string;
  mensajes: Mensaje[];
  archivos?: {name: string, url: string}[];
  expediciones?: boolean;
  almacen?: boolean;
  estadoAlmacen?: string;
  mensajesNoLeidos?: number; // Hacemos este campo opcional

}


export interface Mensaje {
  remitente: string;
  contenido: string;
  fecha: Date;
  solicitudMuestraId: number;
}
