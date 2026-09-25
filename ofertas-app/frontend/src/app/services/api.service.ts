import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { Offer } from '../models/offer.model';
import { Store } from '../models/store.model';

function withId<T>(item: T): T & { id: string } {
  const raw = item as unknown as { id?: string; _id?: string };
  return { ...item, id: raw.id ?? raw._id! };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

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
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params: httpParams })
      .pipe(map(products => products.map(withId)));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(map(withId));
  }

  // Búsqueda de productos (nuevo método)
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params: { search: query } })
      .pipe(map(products => products.map(withId)));
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
    return this.http.get<Offer[]>(`${this.apiUrl}/offers`, { params: httpParams })
      .pipe(map(offers => offers.map(withId)));
  }

  getOfferById(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/offers/${id}`).pipe(map(withId));
  }

  // Tiendas
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}/stores`)
      .pipe(map(stores => stores.map(withId)));
  }

  getStoreById(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/stores/${id}`).pipe(map(withId));
  }

  // Categorías (usan `id` numérico propio, no `_id`, así que no necesitan normalización)
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // Métodos adicionales útiles

  // Filtrar productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts({ category });
  }
  getProductsByStore(storeId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?storeId=${storeId}`)
      .pipe(map(products => products.map(withId)));
  }

  getProductsWithDiscount(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?discount_gte=1`)
      .pipe(map(products => products.map(withId)));
  }

  getProductsSortedByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?_sort=price&_order=${order}`)
      .pipe(map(products => products.map(withId)));
  }

  getProductsPaginated(page: number = 1, limit: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?_page=${page}&_limit=${limit}`)
      .pipe(map(products => products.map(withId)));
  }
}
