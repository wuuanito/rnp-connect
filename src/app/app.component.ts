import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SolicitudesService } from './core/services/solicitudes.service';
import { ApplicationConfig } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [HttpClient, SolicitudesService,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rnp-connect';
}
