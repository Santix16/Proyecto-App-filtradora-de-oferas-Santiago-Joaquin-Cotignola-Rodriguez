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
  private apiUrl = 'http://localhost:3000'; // ← Cambiado a puerto 3000

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

  // Búsqueda de productos (nuevo método)
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?q=${query}`);
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

  getOfferById(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/offers/${id}`);
  }

  // Tiendas
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}/stores`);
  }

  getStoreById(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/stores/${id}`);
  }

  // Categorías
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // Métodos adicionales útiles

  // Filtrar productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`);
  }

  // Filtrar productos por tienda
  getProductsByStore(storeId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?storeId=${storeId}`);
  }

  // Filtrar productos con descuento
  getProductsWithDiscount(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?discount_gte=1`);
  }

  // Ordenar productos por precio
  getProductsSortedByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?_sort=price&_order=${order}`);
  }

  // Obtener productos con paginación
  getProductsPaginated(page: number = 1, limit: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?_page=${page}&_limit=${limit}`);
  }
}
