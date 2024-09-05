import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SolicitudesService } from './core/services/solicitudes.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgbPaginationModule,MatSnackBarModule,],
  providers: [HttpClient, SolicitudesService,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rnp-connect';
}
