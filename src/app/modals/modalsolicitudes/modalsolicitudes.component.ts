import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SolicitudesService } from '../../core/services/solicitudes.service';

@Component({
  selector: 'app-modalsolicitudes',
  standalone: true,
  imports: [],
  templateUrl: './modalsolicitudes.component.html',
  styleUrl: './modalsolicitudes.component.css'
})
export class ModalsolicitudesComponent implements OnInit {

  @Input() solicitudId: number | null = null;
  solicitud: any;
  constructor(private solicitudService: SolicitudesService) { }

  ngOnInit(): void {
    if (this.solicitudId !== null) {
      this.getSolicitud();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['solicitudId'] && this.solicitudId !== null) {
      this.getSolicitud();
    }
  }

  getSolicitud() {
    if (this.solicitudId !== null) {
      this.solicitudService.getSolicitudById(this.solicitudId).subscribe(data => {
        this.solicitud = data;
      }, error => {
        console.error('Error al obtener la solicitud', error);
      });
    }
  }
}
