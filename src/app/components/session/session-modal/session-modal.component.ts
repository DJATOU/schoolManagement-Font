import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for common directives and pipes
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SessionService } from '../../../services/SessionService';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  standalone: true, // This component is standalone
  imports: [
    CommonModule, // Add CommonModule to access 'keyvalue' and other common pipes/directives
    MatDialogModule,
    MatButtonModule
  ]
})
export class SessionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SessionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sessionData: any,
    private sessionService: SessionService
  ) {
    console.log("Received session data:", this.sessionData);
  }


  onValidateSession() {
    // Define the updates
    const updates = { isFinished: true };
    this.sessionService.updateSession(this.sessionData.id, updates).subscribe({
      next: (updatedSession) => {
        console.log('Session validated:', updatedSession);
        this.dialogRef.close(updatedSession); // Pass back the updated session data
      },
      error: (error) => {
        console.error('Error updating session:', error);
      }
    });
  }
}
