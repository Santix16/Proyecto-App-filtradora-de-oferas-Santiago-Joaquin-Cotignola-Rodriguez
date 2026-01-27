import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Offer } from '../models/offer.model';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Productos
  getProducts(params?: any): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] != null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params: httpParams });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Ofertas
  getOffers(params?: any): Observable<Offer[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] != null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<Offer[]>(`${this.apiUrl}/offers`, { params: httpParams });
  }

  // Tiendas
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}/stores`);
  }

  getStoreById(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/stores/${id}`);
  }
}
