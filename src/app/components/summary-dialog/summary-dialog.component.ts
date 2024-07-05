import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CamelCaseToSpaceStringPipe } from '../../pipes/camelCase2SpaceString/camel-case-to-space-string.pipe';

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule,CamelCaseToSpaceStringPipe]
})
export class SummaryDialogComponent {
  sections: { title: string, fields: { label: string, value: any }[] }[] = [];

  constructor(
    public dialogRef: MatDialogRef<SummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Received Data:', data);
  
    // Organiser les données en sections
    const groupedData: { [key: string]: { label: string, value: any }[] } = {};
  
    data.forEach((item: { label: string, value: any }) => {
      const [section, ...rest] = item.label.split(' - ');
      const field = rest.join(' - ');
  
      if (!groupedData[section]) {
        groupedData[section] = [];
      }
      groupedData[section].push({ label: field, value: item.value });
    });
  
    console.log('Grouped Data:', groupedData);
  
    // Convertir en tableau pour itération facile dans le template
    this.sections = Object.keys(groupedData).map(section => ({
      title: section,
      fields: groupedData[section]
    }));
  
    console.log('Sections:', this.sections);
  }
  

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
