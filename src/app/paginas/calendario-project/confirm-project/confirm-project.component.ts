import { Component,Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-project',
  standalone: true,
  imports: [],
  templateUrl: './confirm-project.component.html',
  styleUrl: './confirm-project.component.css'
})
export class ConfirmProjectComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
