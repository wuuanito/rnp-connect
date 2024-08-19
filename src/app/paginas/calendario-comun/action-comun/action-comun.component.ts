import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-action-comun',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './action-comun.component.html',
  styleUrl: './action-comun.component.css'
})
export class ActionComunComponent {
  constructor(public dialogRef: MatDialogRef<ActionComunComponent>) {}

  close(action: string): void {
    this.dialogRef.close(action);
  }
}
