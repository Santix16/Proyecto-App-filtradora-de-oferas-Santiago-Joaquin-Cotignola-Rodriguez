import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private apiService: ApiService) { }

  searchProducts(query: string, filters?: any): Observable<Product[]> {
    const params = { search: query, ...filters };
    return this.apiService.getProducts(params);
  }

  getProductDetails(id: string): Observable<Product> {
    return this.apiService.getProductById(id);
  }

  getNearbyProducts(latitude: number, longitude: number, radius: number = 5): Observable<Product[]> {
    const params = { latitude, longitude, radius };
    return this.apiService.getProducts(params);
  }

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }
}
