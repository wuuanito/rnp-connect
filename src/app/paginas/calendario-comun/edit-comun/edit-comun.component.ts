import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-comun',
  standalone: true,
  imports: [ MatFormFieldModule,FormsModule,MatDialogModule],
  templateUrl: './edit-comun.component.html',
  styleUrl: './edit-comun.component.css'
})
export class EditComunComponent {

  constructor(
    public dialogRef: MatDialogRef<EditComunComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
