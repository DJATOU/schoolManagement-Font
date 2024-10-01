import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GroupType } from '../../../models/GroupType/groupType';
import { Group } from '../../../models/group/group';
import { Level } from '../../../models/level/level';
import { Student } from '../../../models/student/student';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { GroupService } from '../../../services/group.service';
import { LevelService } from '../../../services/level.service';
import { StudentService } from '../../../services/student.service';
import { GroupCardComponent } from '../../group/group-card/group-card.component';
import { GroupDialogComponent } from '../../group/group-dialog/group-dialog.component';
import { PaymentDialogComponent } from '../../payment/payment-dialog/payment-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ApiError, ApiResponse } from '../../../models/response';
import { PaymentHistoryDialogComponent } from '../../payment/payment-history/payment-history-dialog/payment-history-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttendanceHistoryDialogComponent } from '../../attendance/attendance-history-dialog/attendance-history-dialog.component';
import { EditStudentDialogComponent } from '../edit-student-dialog/edit-student-dialog.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { SessionHistoryDTO } from '../../../models/session/SessionHistoryDTO';
import { StudentFullHistoryDTO } from '../../../models/student/StudentFullHistoryDTO';

const errorMessages = {
  PAYMENT_EXCEEDS_SESSIONS: "Le paiement ne peut pas être effectué car il dépasse le coût des sessions actuellement créées.",
  STUDENT_NOT_FOUND: "L'étudiant n'a pas été trouvé.",
  GROUP_NOT_FOUND: "Le groupe n'a pas été trouvé.",
  GENERIC_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard.",
  GROUP_ALREADY_ASSOCIATED: "Certains groupes sont déjà associés à l'étudiant.",
  INSUFFICIENT_SESSIONS: "Le nombre de sessions créées est insuffisant pour couvrir le paiement.",
  INVALID_GROUP_LEVEL: "Aucun groupe correspondant au niveau de l'étudiant n'a été trouvé.",
};

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    GroupCardComponent,
    PaymentDialogComponent,
    GroupDialogComponent,
    MatTooltipModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [StudentService, GroupService, LevelService, GroupTypeService]
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;
  allGroups: Group[] = [];
  allGroupTypes: GroupType[] = [];
  levels: Level[] = [];
  studentGroups: Group[] = [];
  studentLevelId: number = -1;
  groupForm: FormGroup;
  loading = true;
  studentPhotoUrl: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private groupService: GroupService,
    private groupTypeService: GroupTypeService,
    private levelService: LevelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.groupForm = this.fb.group({
      groupIds: [[]]
    });
  }

  ngOnInit(): void {
    const studentId = this.getStudentIdFromRoute();
    if (studentId) {
      this.loadStudentData(studentId);
    } else {
      this.showError(errorMessages.STUDENT_NOT_FOUND);
    }
    this.loadSelectOptions();
    this.loadAllGroups(); // Ajouté pour charger les groupes
    this.loadAllGroupTypes(); // Si nécessaire pour charger les types de groupes
  }
  

  private getStudentIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

 
  private loadStudentData(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe({
      next: student => {
        this.student = student;
        console.log('Student data:', this.student);

        // Générer l'URL complète de la photo en utilisant les variables d'environnement
        if (this.student?.photo) {
          this.studentPhotoUrl = `${environment.apiUrl}${environment.imagesPath}${this.student.photo}`;
        }
        console.log('Student photo URL:', this.studentPhotoUrl);  // Vérifier l'URL générée

        this.loading = false;
        this.loadStudentLevel();
        this.loadStudentGroups();
      },
      error: () => {
        this.loading = false;
        this.showError(errorMessages.STUDENT_NOT_FOUND);
      }
    });
  }


  private loadStudentLevel(): void {
    if (this.student?.levelId) {
      console.log('Attempting to fetch level with ID:', this.student.levelId); // Log pour vérifier l'ID du niveau
      this.levelService.getLevelById(this.student.levelId).subscribe({
        next: level => {
          console.log('Level fetched successfully:', level); // Log pour vérifier la réponse du backend
          this.student!.levelName = level.name;
          this.studentLevelId = level.id ?? 0;
          console.log('Level name set:', this.student?.levelName);
          this.updateUI();
        },
        error: error => {
          console.error('Error fetching level:', error); // Log pour vérifier les erreurs
          this.showError(errorMessages.GENERIC_ERROR);
          this.updateUI();
        }
      });
    } else {
      console.warn('No level ID provided for student:', this.student);
      this.updateUI();
    }
  }

  private updateUI(): void {
    // Mettez à jour l'interface ici après avoir récupéré les données
    this.loading = false;
  }
  
  private loadStudentGroups(): void {
    if (this.student?.id !== undefined) {
      this.studentService.getGroupsForStudent(this.student.id).subscribe({
        next: groups => {
          this.studentGroups = groups;
          console.log('Student groups loaded:', this.studentGroups);
        },
        error: () => {
          this.showError(errorMessages.GENERIC_ERROR);
        }
      });
    }
  }

  private loadAllGroups(): void {
    this.groupService.getGroups().subscribe({
      next: groups => {
        this.allGroups = groups;
      },
      error: () => {
        this.showError(errorMessages.GENERIC_ERROR);
      }
    });
  }

  private loadAllGroupTypes(): void {
    this.groupTypeService.getAllGroupTypes().subscribe({
      next: groupTypes => {
        this.allGroupTypes = groupTypes;
      },
      error: () => {
        this.showError(errorMessages.GENERIC_ERROR);
      }
    });
  }

  loadSelectOptions(): void {
    this.levelService.getLevels().subscribe(data => this.levels = data);
  }

  onSubmitGroups(): void {
    if (this.groupForm.valid) {
      const groupIds: number[] = this.groupForm.value.groupIds;
      if (this.student?.id !== undefined) {
        this.studentService.addGroupsToStudent(this.student.id, groupIds).subscribe({
          next: (response: ApiResponse) => {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            this.updateStudentGroups(groupIds);

            this.groupForm.reset({ groupIds: [] });
          },
          error: (error: ApiError) => {
            this.handleGroupSubmissionError(error);
          }
        });
      } else {
        this.showError(errorMessages.STUDENT_NOT_FOUND);
      }
    }
  }

  private updateStudentGroups(groupIds: number[]): void {
    const newGroups = this.allGroups.filter(group => group.id !== undefined && groupIds.includes(group.id!));
    this.studentGroups = [...this.studentGroups, ...newGroups];
  }

  private handleGroupSubmissionError(error: ApiError): void {
    if (error.status === 409) {
      const alreadyAssociatedGroups = error.error.alreadyAssociatedGroups || [];
      this.showError(`${errorMessages.GROUP_ALREADY_ASSOCIATED}: ${alreadyAssociatedGroups.join(', ')}`);
    } else if (error.status === 404) {
      this.showError(errorMessages.GROUP_NOT_FOUND);
    } else {
      this.showError(errorMessages.GENERIC_ERROR);
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  openPaymentDialog(): void {
    if (this.student?.id && this.studentGroups.length > 0) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        width: '400px',
        data: {
          studentId: this.student.id,
          groups: this.studentGroups
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submitPayment(result);
        }
      });
    } else {
      this.showError('The student must be enrolled in at least one group to proceed with the payment.');
    }
  }

  openGroupDialog(): void {
    console.log('All groups:', this.allGroups);

    // Filtrer tous les groupes correspondant au niveau de l'étudiant
    const groupsForLevel = this.allGroups.filter(group => group.levelId === this.studentLevelId);
    
    if (groupsForLevel.length === 0) {
        // Aucun groupe disponible pour le niveau de l'étudiant
        this.showErrorMessage('Aucun groupe disponible pour ce niveau.');
        return;
    }

    // Filtrer pour exclure les groupes déjà ajoutés à l'étudiant
    const possibleGroups = groupsForLevel.filter(group => 
      !this.studentGroups.some(studentGroup => studentGroup.id === group.id)
    );
    
    if (possibleGroups.length === 0) {
        // Tous les groupes de ce niveau ont déjà été ajoutés à l'étudiant
        this.showErrorMessage('Tous les groupes de ce niveau ont déjà été ajoutés à cet étudiant.');
        return;
    }

    console.log('Possible groups for level:', possibleGroups);

    // Ouvrir un dialogue pour sélectionner les groupes
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '400px',
      data: {
        allGroups: possibleGroups,  // Passer les groupes filtrés qui ne sont pas déjà ajoutés
        selectedGroups: this.groupForm.value.groupIds  // Groupes déjà sélectionnés dans le formulaire
      }
    });

    // Mettre à jour le formulaire avec les groupes sélectionnés
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupForm.patchValue({ groupIds: result });
        this.onSubmitGroups();
      }
    });
}


  
  submitPayment(paymentData: any): void {
    console.log('Submitting payment data:', paymentData);
  }

 

  onEdit(): void {
    const dialogRef = this.dialog.open(EditStudentDialogComponent, {
      width: '600px',
      data: { student: this.student },
    });

    dialogRef.afterClosed().subscribe((result: Student | undefined) => {
      if (result) {
        this.studentService.updateStudent(result).subscribe({
          next: (updatedStudent) => {
            this.student = updatedStudent;
            this.loadStudentLevel(); // Recharger le niveau
            this.showSuccessMessage('Étudiant mis à jour avec succès.');
          },
          error: (error) => {
            console.error('Error updating student:', error);
            this.showErrorMessage('Erreur lors de la mise à jour de l\'étudiant.');
          },
        });
      } else {
        console.log('Modification annulée.');
      }
    });
  }

  onDisable(): void {
    // Confirmation dialog to disable student
    this.dialog.open(ConfirmationDialogComponent, {
      data:{
        title: "Suppression d'un étudiant",
        message: 'Voulez-vous vraiment supprimer cet étudiant?',
        confirmText: 'Yes, delete',
        cancelText: 'No, cancel',
        confirmColor: 'warn'
      } 
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.studentService.disableStudent(this.student!.id || -1).subscribe({
          next: (response) => {
            console.log('Student disabled successfully:', response);
            this.showSuccessMessage('Student disabled successfully.'); // Affichez le message de succès
          },
          error: (error) => {
            console.error('Error disabling student:', error);
            this.showErrorMessage('Error disabling student.'); // Affichez le message d'erreur
          }
        });
      }
      else{
        console.log('Operation canceled.');
      }
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-error']
    });
  }
  
  onPrint(lang: string = 'ar') {
    if (this.student?.id) {
      this.studentService.generateStudentPdf(this.student.id, lang).subscribe({
        next: (pdfBlob: Blob) => {
          const blob = new Blob([pdfBlob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `student-profile-${this.student?.id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error generating PDF:', error);
          this.showErrorMessage('Failed to generate PDF.');
        }
      });
    } else {
      this.showErrorMessage('Student not found.');
    }
  }
  
  

  openPaymentHistoryDialog(): void {
    this.dialog.open(PaymentHistoryDialogComponent, {
      width: '600px',
      data: { studentId: this.student?.id } // Passer l'ID de l'étudiant pour filtrer les données
    });
  }
  
  openAttendanceHistoryDialog(): void {
    this.dialog.open(AttendanceHistoryDialogComponent, {
      width: '600px',
      data: { studentId: this.student?.id } // Passer l'ID de l'étudiant pour filtrer les données
    });
  }
  

  // ... vos autres propriétés ...

  generateFullHistoryPdf(): void {
    if (this.student?.id) {
      this.studentService.getStudentFullHistory(this.student.id).subscribe({
        next: (fullHistory) => {
          console.log('Full History:', fullHistory);
          this.createFullHistoryPdf(fullHistory);
        },
        error: (error) => {
          console.error('Error fetching full history:', error);
          this.showErrorMessage('Erreur lors de la récupération de l\'historique complet.');
        }
      });
    } else {
      this.showErrorMessage('Étudiant introuvable.');
    }
  }

  private async createFullHistoryPdf(fullHistory: StudentFullHistoryDTO): Promise<void> {
    let logoBase64 = '';
    try {
      logoBase64 = await this.convertImageToBase64('assets/succes_assistance.png');
    } catch (error) {
      console.error('Erreur lors du chargement du logo :', error);
    }

    const content: Content[] = [
      {
        columns: [
          {
            image: logoBase64,
            width: 100
          },
          {
            text: 'Historique Complet de l\'Étudiant',
            style: 'header',
            alignment: 'right'
          }
        ]
      },
      { text: '\n\n' },
      {
        text: `Étudiant : ${fullHistory.studentName}`,
        style: 'subheader'
      },
      {
        text: `Date : ${new Date().toLocaleDateString()}`,
        alignment: 'right'
      },
      { text: '\n' },
      ...this.getFullHistoryContent(fullHistory),
      { text: '\n\n' },
      { text: 'Légende des couleurs :', style: 'subheader', alignment: 'left' },
      {
        table: {
          widths: ['auto', '*'],
          body: [
            [
              { text: '', fillColor: '#d4edda', width: 15, height: 15 },
              { text: 'Présent et Paiement Complet' }
            ],
            [
              { text: '', fillColor: '#cce5ff', width: 15, height: 15 },
              { text: 'Absent et Paiement Complet' }
            ],
            [
              { text: '', fillColor: '#fff3cd', width: 15, height: 15 },
              { text: 'Présent et Paiement Partiel' }
            ],
            [
              { text: '', fillColor: '#f8d7da', width: 15, height: 15 },
              { text: 'Absent et Paiement Partiel' }
            ]
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 20]
      },
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
    ];

    const documentDefinition: TDocumentDefinitions = {
      content: content,
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
          margin: [0, 20, 0, 10]
        },
        subsectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#2F5496',
          margin: [0, 15, 0, 5]
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
      defaultStyle: {
        fontSize: 11
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

  private getFullHistoryContent(fullHistory: StudentFullHistoryDTO): Content[] {
    const content: Content[] = [];

    if (fullHistory.groups && fullHistory.groups.length > 0) {
      fullHistory.groups.forEach(group => {
        content.push(
          { text: `Groupe : ${group.groupName}`, style: 'sectionHeader', alignment: 'left' }
        );

        if (group.series && group.series.length > 0) {
          group.series.forEach(series => {
            content.push(
              {
                columns: [
                  { text: `Série : ${series.seriesName}`, style: 'subsectionHeader', alignment: 'left' },
                  { text: `Paiement : ${series.paymentStatus}`, alignment: 'right', style: 'subsectionHeader' }
                ]
              },
              {
                text: `Montant payé : ${series.totalAmountPaid} DA / ${series.totalCost} DA`,
                alignment: 'right',
                margin: [0, 0, 0, 10]
              }
            );

            if (series.sessions && series.sessions.length > 0) {
              content.push(this.getSessionsTable(series.sessions));
            } else {
              content.push(
                { text: 'Aucune session disponible pour cette série.', italics: true }
              );
            }

            content.push({ text: '\n' });
          });
        } else {
          content.push(
            { text: 'Aucune série disponible pour ce groupe.', italics: true }
          );
        }

        content.push({ text: '\n' });
      });
    } else {
      content.push(
        { text: 'Aucun groupe disponible pour cet étudiant.', italics: true }
      );
    }

    return content;
  }

  private getSessionsTable(sessions: SessionHistoryDTO[]): Content {
    const body: any[] = [];
  
    // Définir la ligne d'en-tête
    const headerRow: any[] = [
      { text: 'Session', style: 'tableHeader' },
      { text: 'Date', style: 'tableHeader' },
      { text: 'Présence', style: 'tableHeader' },
      { text: 'Justifiée', style: 'tableHeader' },
      { text: 'Description', style: 'tableHeader' },
      { text: 'Date de Paiement', style: 'tableHeader' },
      { text: 'Paiement', style: 'tableHeader' },
      { text: 'Montant Payé', style: 'tableHeader' }
    ];
  
    body.push(headerRow);
  
    // Ajouter les lignes de données avec couleurs
    sessions.forEach(session => {
      const fillColor = this.getFillColorForAttendance(session);
  
      const row: any[] = [
        { text: session.sessionName || 'N/A', fillColor },
        { text: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : 'N/A', fillColor },
        { text: session.attendanceStatus || 'Non renseigné', fillColor },
        { text: session.isJustified ? 'Oui' : 'Non', fillColor },
        { text: session.description || '', fillColor },
        { text: session.paymentDate ? new Date(session.paymentDate).toLocaleDateString() : 'N/A', fillColor },
        { text: session.paymentStatus || 'Non payé', fillColor },
        { text: session.amountPaid != null ? `${session.amountPaid} DA` : '0 DA', fillColor }
      ];
  
      body.push(row);
    });
  
    return {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
        body: body
      },
      layout: 'noBorders', // Changement du layout pour 'noBorders'
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }
  
  

  private getFillColorForAttendance(session: SessionHistoryDTO): string {
    if (session.paymentStatus === 'Complet' && session.attendanceStatus === 'Présent') {
      return '#d4edda'; // Vert clair
    } else if (session.paymentStatus === 'Complet' && session.attendanceStatus === 'Absent') {
      return '#cce5ff'; // Bleu clair
    } else if (session.paymentStatus === 'Partiel' && session.attendanceStatus === 'Présent') {
      return '#fff3cd'; // Jaune clair
    } else if (session.paymentStatus === 'Partiel' && session.attendanceStatus === 'Absent') {
      return '#f8d7da'; // Rouge clair
    } else {
      return '#ffffff'; // Blanc par défaut
    }
  }

  // ... vos autres méthodes ...
}


