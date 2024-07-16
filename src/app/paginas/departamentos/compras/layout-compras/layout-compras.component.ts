import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';




@Component({
  selector: 'app-layout-compras',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout-compras.component.html',
  styleUrl: './layout-compras.component.css'
})
export class LayoutComprasComponent {

}
