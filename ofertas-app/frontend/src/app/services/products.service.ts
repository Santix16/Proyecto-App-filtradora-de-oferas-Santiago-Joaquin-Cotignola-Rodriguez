import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product, Offer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private searchCache = new Map<string, { data: Product[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  constructor(private http: HttpClient) {}

  /**
   * Search products by query string
   * @param query Search query (minimum 3 characters)
   * @returns Observable of Product array
   */
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim().length < 3) {
      return throwError(() => new Error('Search query must be at least 3 characters'));
    }

    const trimmedQuery = query.trim();

    // Check cache
    const cached = this.searchCache.get(trimmedQuery);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    this.loadingSubject.next(true);
    const params = new HttpParams().set('q', trimmedQuery);

    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap(products => {
        this.searchCache.set(trimmedQuery, { data: products, timestamp: Date.now() });
        this.loadingSubject.next(false);
      }),
      catchError(error => this.handleError(error)),
      shareReplay(1)
    );
  }

  /**
   * Get product by ID
   * @param id Product ID
   * @returns Observable of Product
   */
  getProductById(id: string): Observable<Product> {
    this.loadingSubject.next(true);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get product offers filtered by geolocation
   * @param productId Product ID
   * @param lat Latitude
   * @param lng Longitude
   * @param radius Search radius in meters (default 5000m)
   * @returns Observable of Offer array
   */
  getProductOffers(productId: string, lat: number, lng: number, radius: number = 5000): Observable<Offer[]> {
    this.loadingSubject.next(true);
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', radius.toString());

    return this.http.get<Offer[]>(`${this.apiUrl}/${productId}/offers`, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Search product by barcode
   * @param barcode Product barcode (EAN-13, UPC-A, etc.)
   * @returns Observable of Product
   */
  scanBarcode(barcode: string): Observable<Product> {
    if (!barcode) {
      return throwError(() => new Error('Barcode is required'));
    }

    this.loadingSubject.next(true);
    const params = new HttpParams().set('barcode', barcode);

    return this.http.get<Product>(`${this.apiUrl}/barcode`, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
