import { Component,Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-comun',
  standalone: true,
  imports: [],
  templateUrl: './confirm-comun.component.html',
  styleUrl: './confirm-comun.component.css'
})
export class ConfirmComunComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmComunComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
