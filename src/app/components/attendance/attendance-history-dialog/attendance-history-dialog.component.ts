import { Component, Inject, OnInit } from '@angular/core';
import { Attendance } from '../../../models/Attendance/attendance';
import { Group } from '../../../models/group/group';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { AttendanceService } from '../../../services/attendance.service';
import { SeriesService } from '../../../services/series.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StudentService } from '../../student/services/student.service';
import { SessionService } from '../../../services/SessionService';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-attendance-history-dialog',
  standalone: true,
  templateUrl: './attendance-history-dialog.component.html',
  styleUrls: ['./attendance-history-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule
  ]
})
export class AttendanceHistoryDialogComponent implements OnInit {
  studentGroups: Group[] = [];
  sessionSeries: SessionSeries[] = [];
  attendanceHistory = new MatTableDataSource<any>(); // Utiliser any pour inclure les données supplémentaires

  selectedGroup: number | null = null;
  selectedSeries: number | null = null;

  displayedColumns: string[] = ['session', 'attendanceDate', 'isPresent', 'isJustified', 'description'];

  studentName: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private seriesService: SeriesService,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<AttendanceHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {}

  ngOnInit(): void {
    this.loadStudentInfo();
    this.loadGroups();
  }

  private loadStudentInfo(): void {
    this.studentService.getStudentById(this.data.studentId).subscribe({
      next: (student) => {
        this.studentName = `${student.firstName} ${student.lastName}`;
      },
      error: (error) => {
        console.error('Error loading student info:', error);
      }
    });
  }

  private loadGroups(): void {
    this.studentService.getGroupsForStudent(this.data.studentId).subscribe({
      next: (groups) => {
        this.studentGroups = groups;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  loadSessionSeries(): void {
    if (this.selectedGroup) {
      this.seriesService.getSessionSeriesByGroupId(this.selectedGroup).subscribe({
        next: (series) => {
          this.sessionSeries = series;
          this.selectedSeries = null;
          this.attendanceHistory.data = [];
        },
        error: (error) => {
          console.error('Error loading session series:', error);
        }
      });
    }
  }

  loadAttendanceHistory(): void {
    if (this.selectedSeries && this.selectedGroup) {
      this.attendanceService.getAttendanceByStudentAndSeries(this.data.studentId, this.selectedSeries).subscribe({
        next: (attendanceRecords) => {
          // Pour chaque enregistrement de présence, récupérer les détails de la session
          const sessionRequests = attendanceRecords.map(attendance =>
            this.sessionService.getSessionById(attendance.sessionId).toPromise()
          );

          Promise.all(sessionRequests).then(sessions => {
            this.attendanceHistory.data = attendanceRecords.map((attendance, index) => {
              const session = sessions[index];
              return {
                ...attendance,
                sessionName: session?.title || 'Session inconnue', // Récupérer le nom de la session ou une valeur par défaut
                sessionDate: session?.sessionTimeStart || null // Récupérer la date de la session ou null
              };
            });
          }).catch(error => {
            console.error('Error loading session data:', error);
          });
        },
        error: (error: Error) => {
          console.error('Error loading attendance history:', error);
        }
      });
    } else {
      console.error('Selected series or group is null or undefined.');
    }
  }

  getRowClass(attendance: Attendance): string {
    if (attendance.isPresent) {
      return 'row-present';
    } else if (attendance.isJustified) {
      return 'row-justified';
    } else {
      return 'row-not-justified';
    }
  }

  // Méthode pour convertir l'image en Base64
  private convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
    });
  }

  // Méthode pour générer le PDF
  async generatePdf(): Promise<void> {
    let logoBase64 = '';
    try {
      logoBase64 = await this.convertImageToBase64('assets/succes_assistance.png');
    } catch (error) {
      console.error('Erreur lors du chargement du logo :', error);
    }

    const documentDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 100
            },
            {
              text: 'Historique des Présences',
              style: 'header',
              alignment: 'right'
            }
          ]
        },
        { text: '\n\n' },
        {
          text: `Étudiant : ${this.studentName}`,
          style: 'subheader'
        },
        {
          text: `Date : ${new Date().toLocaleDateString()}`,
          alignment: 'right'
        },
        { text: '\n' },
        {
          text: `${this.sessionSeries.find(series => series.id === this.selectedSeries)?.name}`,
          style: 'sectionHeader'
        },
        { text: '\n' },
        this.getAttendanceTable(),
        { text: '\n\n' },
        {
          columns: [
            {
              text: 'Signature de l\'Étudiant : ________________________',
              alignment: 'left',
              margin: [0, 50, 0, 0]
            },
            {
              text: 'Signature de l\'Administration : ________________________',
              alignment: 'right',
              margin: [0, 50, 0, 0]
            }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#2F5496',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        sectionHeader: {
          fontSize: 18,
          bold: true,
          color: '#2F5496',
          margin: [0, 15, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#4F81BD',
          alignment: 'center'
        },
        tableCell: {
          margin: [0, 5, 0, 5]
        }
      },
      footer: (currentPage: number, pageCount: number): Content => {
        return {
          text: `Page ${currentPage} sur ${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          margin: [0, 10, 0, 0]
        } as Content;
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    pdfDocGenerator.getBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    });
  }

  private getAttendanceTable(): any {
    const body = [];

    // En-têtes du tableau
    body.push([
      { text: 'Session', style: 'tableHeader' },
      { text: 'Date de la Session', style: 'tableHeader' },
      { text: 'Présence', style: 'tableHeader' },
      { text: 'Justifiée', style: 'tableHeader' },
      { text: 'Description', style: 'tableHeader' }
    ]);

    // Données du tableau
    if (this.attendanceHistory.data && this.attendanceHistory.data.length > 0) {
      for (const attendance of this.attendanceHistory.data) {
        const fillColor = this.getFillColorForAttendance(attendance);

        body.push([
          { text: attendance.sessionName || 'N/A', fillColor },
          { text: attendance.sessionDate ? new Date(attendance.sessionDate).toLocaleDateString() : 'N/A', fillColor },
          { text: attendance.isPresent ? 'Oui' : 'Non', fillColor },
          { text: attendance.isJustified ? 'Oui' : 'Non', fillColor },
          { text: attendance.description || '', fillColor }
        ]);
      }
    } else {
      body.push([
        { text: 'Aucune donnée disponible', colSpan: 5, alignment: 'center' }
      ]);
    }

    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: body
      },
      layout: 'lightHorizontalLines'
    };
  }

  private getFillColorForAttendance(attendance: Attendance): string {
    if (attendance.isPresent) {
      return '#d4edda'; // Vert pour présent
    } else if (attendance.isJustified) {
      return '#ffeeba'; // Orange pour absent justifié
    } else {
      return '#f8d7da'; // Rouge pour absent non justifié
    }
  }
}
