import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MapViewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  stores: Store[] = [];
  offers: Offer[] = [];
  loading = true;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;

    // Cargar productos
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('✅ Productos cargados:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        this.error = 'Error al cargar productos. Verifica que json-server esté corriendo.';
      }
    });

    // Cargar tiendas
    this.apiService.getStores().subscribe({
      next: (data) => {
        this.stores = data;
        console.log('✅ Tiendas cargadas:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando tiendas:', error);
      }
    });

    // Cargar ofertas activas
    this.apiService.getOffers({ isActive: true }).subscribe({
      next: (data) => {
        this.offers = data;
        this.loading = false;
        console.log('✅ Ofertas cargadas:', data.length);
      },
      error: (error) => {
        console.error('❌ Error cargando ofertas:', error);
        this.loading = false;
      }
    });
  }

  // Método para manejar búsquedas desde el SearchBarComponent
  onSearch(query: string) {
    if (!query || query.trim() === '') {
      this.loadAllData();
      return;
    }

    this.apiService.searchProducts(query).subscribe({
      next: (data) => {
        this.products = data;
        console.log('🔍 Resultados de búsqueda:', data.length);
      },
      error: (error) => {
        console.error('❌ Error en búsqueda:', error);
      }
    });
  }

  // Método para filtrar por categoría
  filterByCategory(category: string) {
    this.apiService.getProducts({ category }).subscribe({
      next: (data) => {
        this.products = data;
        console.log(`📂 Productos en ${category}:`, data.length);
      },
      error: (error) => {
        console.error('❌ Error filtrando por categoría:', error);
      }
    });
  }

  // Método para obtener productos con descuento
  getProductsWithDiscount() {
    const productsWithDiscount = this.products.filter(p => p.discount && p.discount > 0);
    return productsWithDiscount;
  }
}
