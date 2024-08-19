import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-action-project',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './action-project.component.html',
  styleUrl: './action-project.component.css'
})
export class ActionProjectComponent {
  constructor(public dialogRef: MatDialogRef<ActionProjectComponent>) {}

  close(action: string): void {
    this.dialogRef.close(action);
  }
}
