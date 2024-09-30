import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolicitudesMateriaPrimaService } from '../../../../core/services/solicitudes-materia-prima.service';
import { SolicitudDetallesComponent } from '../../laboratorio/ver-materias-primas-almacen/solicitud-detalles/solicitud-detalles.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';

interface Solicitud {
  fechaSolicitud: string;
  personaSolicita: string;
  nombreMateria: string;
  codigo: string;
  lote: string;
  proveedor: string;
  ubicacion: string;
  urgencia: string;
  estado?: string; // Make 'estado' optional
  fechaDevuelto?: string; // Make 'fechaDevolucion' optional
}

@Component({
  selector: 'app-materiasprimas-lab',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    SolicitudDetallesComponent,
    MatTabsModule
  ],  templateUrl: './materiasprimas-lab.component.html',
  styleUrl: './materiasprimas-lab.component.css'
})
export class MateriasprimasLabComponent implements OnInit {
  displayedColumns = ['fechaSolicitud', 'personaSolicita', 'nombreMateria', 'codigo', 'lote', 'proveedor', 'ubicacion', 'urgencia', 'estado', 'ver', 'acciones'];
  displayedColumnsDevueltas = ['fechaDevuelto', 'personaSolicita', 'nombreMateria', 'codigo', 'lote', 'proveedor', 'ubicacion', 'urgencia', 'estado', 'ver']; // Agrega o modifica según tus necesidades
  dataSource = new MatTableDataSource<Solicitud>([]);

  @ViewChild('paginatorCreadas') paginatorCreadas!: MatPaginator;
  @ViewChild('sortCreadas') sortCreadas!: MatSort;

  @ViewChild('paginatorDevueltas') paginatorDevueltas!: MatPaginator;
  @ViewChild('sortDevueltas') sortDevueltas!: MatSort;

  dataSourceCreadas = new MatTableDataSource<Solicitud>([]);
  dataSourceDevueltas = new MatTableDataSource<Solicitud>([]);
  constructor(
    private solicitudesService: SolicitudesMateriaPrimaService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  ngAfterViewInit() {
    this.dataSourceCreadas.paginator = this.paginatorCreadas;
    this.dataSourceCreadas.sort = this.sortCreadas;

    this.dataSourceDevueltas.paginator = this.paginatorDevueltas;
    this.dataSourceDevueltas.sort = this.sortDevueltas;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCreadas.filter = filterValue.trim().toLowerCase();
  }

  applyFilterDevueltas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDevueltas.filter = filterValue.trim().toLowerCase();
  }
  loadSolicitudes() {
    this.solicitudesService.getSolicitudes().subscribe(
      (data: Solicitud[]) => {
        // Filtra los datos según el estado y asigna a las fuentes correspondientes
        this.dataSourceCreadas.data = data.filter(solicitud => solicitud.estado === 'Creado');
        this.dataSourceDevueltas.data = data.filter(solicitud => solicitud.estado === 'Devuelto');
      },
      (error) => {
        console.error('Error al cargar las solicitudes', error);
      }
    );
  }




  verDetalles(solicitud: Solicitud) {
    this.dialog.open(SolicitudDetallesComponent, {
      width: '400px',
      data: solicitud,
    });
  }

  getRowClass(estado: string): string {
    switch (estado) {
      case 'Creado':
        return 'state-created';
      case 'Devuelto':
        return 'state-delivered';
      default:
        return ''; // O una clase por defecto si es necesario
    }
  }
  finalizarSolicitud(element: any) {
    // Lógica para finalizar la solicitud
    console.log('Solicitud finalizada:', element);

    // Aquí puedes agregar lógica adicional para actualizar el estado de la solicitud en la base de datos, etc.
  }

}
