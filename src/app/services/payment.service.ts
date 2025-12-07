import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Payment } from '../models/payment/payment';
import { PaymentDetail } from '../models/paymentDetail/paymentDetail';
import { PageResponse } from '../models/common/page-response';
import { API_BASE_URL } from '../app.config';

/**
 * Service de gestion des paiements
 *
 * SYNCHRONISÉ AVEC BACKEND PHASE 2:
 * - Utilise les nouveaux endpoints paginés
 * - Support de PageResponse<PaymentDTO>
 * - Utilise les 4 services backend (CRUD, Processing, Status, Distribution)
 *
 * @see PaymentController.java (backend)
 * @author Frontend Team
 * @since Phase 2 Sync
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly baseUrl = `${API_BASE_URL}/api/payments`;

  constructor(private http: HttpClient) {}

  // =========================================================================
  // CRUD OPERATIONS (PaymentCrudService backend)
  // =========================================================================

  /**
   * Récupère tous les paiements avec pagination
   *
   * Backend: PaymentController.getAllPayments()
   * Endpoint: GET /api/payments?page=0&size=20&sort=paymentDate,desc
   *
   * @param page Numéro de page (commence à 0)
   * @param size Nombre d'éléments par page (max 100)
   * @param sort Tri optionnel (ex: 'paymentDate,desc')
   * @returns Observable<PageResponse<Payment>>
   */
  getAllPaymentsPaginated(
    page: number = 0,
    size: number = 20,
    sort?: string
  ): Observable<PageResponse<Payment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<Payment>>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère tous les paiements d'un étudiant avec pagination
   *
   * Backend: PaymentController.getAllPaymentsForStudent()
   * Endpoint: GET /api/payments/student/{studentId}?page=0&size=20
   *
   * @param studentId ID de l'étudiant
   * @param page Numéro de page
   * @param size Nombre d'éléments par page
   * @returns Observable<PageResponse<Payment>>
   */
  getPaymentsByStudentPaginated(
    studentId: number,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<Payment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Payment>>(
      `${this.baseUrl}/student/${studentId}`,
      { params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Récupère les détails de paiement pour une série
   *
   * Backend: PaymentController.getPaymentDetailsForSeries()
   * Endpoint: GET /api/payments/process/{studentId}/series/{sessionSeriesId}/payment-details
   *
   * @param studentId ID de l'étudiant
   * @param sessionSeriesId ID de la série de sessions
   * @returns Observable<PaymentDetail[]>
   */
  getPaymentDetailsForSeries(
    studentId: number,
    sessionSeriesId: number
  ): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(
      `${this.baseUrl}/process/${studentId}/series/${sessionSeriesId}/payment-details`
    ).pipe(catchError(this.handleError));
  }

  /**
   * Récupère l'historique des paiements pour une série
   *
   * Backend: PaymentController.getPaymentHistoryForSeries()
   * Endpoint: GET /api/payments/process/{studentId}/series/{sessionSeriesId}/payment-history
   *
   * @param studentId ID de l'étudiant
   * @param sessionSeriesId ID de la série de sessions
   * @returns Observable<Payment[]>
   */
  getPaymentHistoryForSeries(
    studentId: number,
    sessionSeriesId: number
  ): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.baseUrl}/process/${studentId}/series/${sessionSeriesId}/payment-history`
    ).pipe(catchError(this.handleError));
  }

  // =========================================================================
  // PAYMENT PROCESSING (PaymentProcessingService backend)
  // =========================================================================

  /**
   * Traite un paiement pour une série complète de sessions
   *
   * Backend: PaymentController.processPayment()
   * Endpoint: POST /api/payments/process
   *
   * Le backend distribue automatiquement le montant sur toutes les sessions
   * de la série en ordre chronologique.
   *
   * @param payment Données du paiement
   * @returns Observable<Payment>
   */
  processPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/process`, payment).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un paiement de base
   *
   * Backend: PaymentController.createPayment()
   * Endpoint: POST /api/payments
   *
   * @param payment Données du paiement
   * @returns Observable<Payment>
   */
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payment).pipe(
      catchError(this.handleError)
    );
  }

  // =========================================================================
  // PAYMENT STATUS (PaymentStatusService backend)
  // =========================================================================

  /**
   * Récupère le statut de paiement pour tous les étudiants d'un groupe
   *
   * Backend: PaymentController.getStudentsPaymentStatus()
   * Endpoint: GET /api/payments/{groupId}/students-payment-status
   *
   * @param groupId ID du groupe
   * @returns Observable<any[]> StudentPaymentStatus[]
   */
  getStudentsPaymentStatus(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/${groupId}/students-payment-status`
    ).pipe(catchError(this.handleError));
  }

  /**
   * Récupère les sessions auxquelles un étudiant a assisté mais qu'il n'a pas payées
   *
   * Backend: PaymentController.getUnpaidAttendedSessions()
   * Endpoint: GET /api/payments/students/{studentId}/unpaid-sessions
   *
   * @param studentId ID de l'étudiant
   * @returns Observable<any[]> SessionDTO[]
   */
  getUnpaidSessions(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/students/${studentId}/unpaid-sessions`
    ).pipe(catchError(this.handleError));
  }

  /**
   * Récupère le statut de paiement détaillé pour un étudiant
   *
   * Backend: PaymentController.getStudentPaymentStatus()
   * Endpoint: GET /api/payments/students/{studentId}/payment-status
   *
   * @param studentId ID de l'étudiant
   * @returns Observable<any[]> GroupPaymentStatus[]
   */
  getStudentPaymentStatus(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/students/${studentId}/payment-status`
    ).pipe(catchError(this.handleError));
  }

  // =========================================================================
  // LEGACY METHODS (À MIGRER)
  // =========================================================================

  /**
   * @deprecated Utiliser getPaymentsByStudentPaginated() à la place
   * Récupère l'historique des paiements d'un étudiant (non paginé)
   */
  getPaymentHistoryByStudentId(studentId: number): Observable<Payment[]> {
    console.warn('[DEPRECATED] Use getPaymentsByStudentPaginated() instead');
    return this.http.get<Payment[]>(`${this.baseUrl}/student/${studentId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @deprecated Utiliser getPaymentDetailsForSeries() à la place
   */
  getPaymentDetailsForSessions(
    studentId: number,
    sessionSeriesId: number
  ): Observable<PaymentDetail[]> {
    console.warn('[DEPRECATED] Use getPaymentDetailsForSeries() instead');
    return this.getPaymentDetailsForSeries(studentId, sessionSeriesId);
  }

  /**
   * @deprecated À supprimer - Utiliser createPayment() ou processPayment()
   */
  addPayment(payment: Payment): Observable<Payment> {
    console.warn('[DEPRECATED] Use createPayment() or processPayment() instead');
    return this.processPayment(payment);
  }

  // =========================================================================
  // ERROR HANDLING
  // =========================================================================

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;

      // Messages spécifiques selon le code HTTP
      switch (error.status) {
        case 404:
          errorMessage = 'Paiement non trouvé';
          break;
        case 400:
          errorMessage = error.error?.message || 'Données invalides';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
      }
    }

    console.error('Payment Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
