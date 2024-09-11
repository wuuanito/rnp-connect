import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './action-dialog.component.html',
}
)
export class ActionDialogComponent {
  constructor(public dialogRef: MatDialogRef<ActionDialogComponent>) {}

  close(action: string): void {
    this.dialogRef.close(action);
  }
}
