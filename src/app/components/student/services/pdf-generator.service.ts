import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StudentFullHistoryDTO } from '../domain/StudentFullHistoryDTO';
import { SessionHistoryDTO } from '../../../models/session/SessionHistoryDTO';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  async generateFullHistoryPdf(fullHistory: StudentFullHistoryDTO, logoUrl: string): Promise<void> {
    
    let logoBase64 = '';
    try {
      logoBase64 = await this.convertImageToBase64(logoUrl);
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
              { text: '', fillColor: '#32a852', width: 15, height: 15 },
              { text: 'Présent et Paiement Complété' }
            ],
            [
              { text: '', fillColor: '#ff6347', width: 15, height: 15 },
              { text: 'Absent et Paiement Complété' }
            ],
            [
              { text: '', fillColor: '#ffd700', width: 15, height: 15 },
              { text: 'Présent et Paiement en cours' }
            ],
            [
              { text: '', fillColor: '#ff4500', width: 15, height: 15 },
              { text: 'Absent et Paiement en cours' }
            ],
            [
              { text: '', fillColor: '#f5f5f5', width: 15, height: 15 },
              { text: 'Présence non renseignée' }
            ],
            [
              { text: '', fillColor: '#e60000', width: 15, height: 15 },
              { text: 'Présent et Non payé' }
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
          margin: [0, 20, 0, 10],
          decoration: 'underline'
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

  private async convertImageToBase64(url: string): Promise<string> {
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
      // Trier les groupes par nom
      const sortedGroups = fullHistory.groups.sort((a, b) => a.groupName.localeCompare(b.groupName));
      sortedGroups.forEach(group => {
  
        // Ligne de séparation + titre du groupe
        content.push(
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 515, y2: 0,
                lineWidth: 2,
                lineColor: '#2F5496'
              }
            ],
            margin: [0, 20, 0, 10]
          },
          {
            text: `Groupe : ${group.groupName}`,
            style: 'sectionHeader',
            alignment: 'left'
          },
          { text: '\n' }
        );
  
        // S'il y a des séries
        if (group.series && group.series.length > 0) {
          group.series.forEach(series => {
  
            // Vérifier si la série a des sessions
            if (!series.sessions || series.sessions.length === 0) {
              // Aucune session => message
              content.push({
                text: 'Aucune session disponible pour cette série.',
                italics: true,
                margin: [0, 0, 0, 10]
              });
            } else {
              // sessions présentes => distinguer rattrapage ou normal
              // Test : si toutes les sessions sont catchUpSession = true => rattrapage
              const allAreCatchUp = series.sessions.every(s => s.catchUpSession === true);
  
              if (allAreCatchUp) {
                // Affichage "Session de rattrapage"
                content.push({
                  text: `Session de rattrapage : ${series.seriesName}`,
                  style: 'subsectionHeader',
                  alignment: 'left'
                });
              } else {
                // Série “normale” => afficher paiement
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
              }
  
              // Afficher le tableau des sessions
              content.push(this.getSessionsTable(series.sessions));
              content.push({ text: '\n' });
            }
          });
        } else {
          // Pas de séries du tout
          content.push({
            text: 'Ce groupe ne contient aucune session validée ou payée pour l\'étudiant.',
            italics: true,
            margin: [0, 0, 0, 10]
          });
        }
  
        content.push({ text: '\n' });
      });
    } else {
      // Aucun groupe dans fullHistory
      content.push({
        text: 'Aucun groupe disponible pour cet étudiant.',
        italics: true
      });
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

      const sessionTitle = session.catchUpSession
      ? `Session de rattrapage: ${session.sessionName}`
      : session.sessionName || 'N/A';
      
      // Gestion de la justification
    let justificationText = '';
    if (session.attendanceStatus?.toLowerCase() === 'absent') {
      justificationText = session.isJustified ? 'Oui' : 'Non';
    } else {
      // Présent ou Non renseigné => pas de justification
      justificationText = '';
    }
  
      const row: any[] = [
        { text: sessionTitle || 'N/A', fillColor },
        { text: session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : 'N/A', fillColor },
        { text: session.attendanceStatus || 'Non renseigné', fillColor },
        { text: justificationText, fillColor },
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
      layout: 'noBorders',
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }

  private getFillColorForAttendance(session: SessionHistoryDTO): string {
    console.log('Checking fillColor for session:', session);
    const paymentStatus = session.paymentStatus?.toLowerCase() || '';
    const attendanceStatus = session.attendanceStatus?.toLowerCase() || '';

    if (paymentStatus === 'completed' && attendanceStatus === 'présent') {
      return '#32a852'; // Vert clair amélioré pour plus de visibilité
    } else if (paymentStatus === 'completed' && attendanceStatus === 'absent') {
      return '#ff6347'; // Rouge vif pour plus de visibilité
    } else if (paymentStatus === 'in progress' && attendanceStatus === 'présent') {
      return '#ffd700'; // Jaune prononcé
    } else if (paymentStatus === 'in progress' && attendanceStatus === 'absent') {
      return '#ff4500'; // Rouge prononcé
    } else if (attendanceStatus === '' || attendanceStatus === 'non renseigné') {
      return '#f5f5f5'; // Gris clair pour indiquer une absence de renseignement
    } else if (paymentStatus === 'non payé' && attendanceStatus === 'présent') {
      return '#e60000'; // Rouge vif pour indiquer "Présent et Non payé"
    } else {
      return '#ffffff'; // Blanc par défaut
    }
  }
}
