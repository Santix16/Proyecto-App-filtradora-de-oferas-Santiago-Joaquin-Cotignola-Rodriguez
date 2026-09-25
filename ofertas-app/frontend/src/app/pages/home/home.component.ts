import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  offers: Offer[] = [];

  // Lista maestra de categorías
  allCategories: string[] = [
    'Lácteos', 'Panadería', 'Carnes', 'Frutas y Verduras',
    'Bebidas', 'Limpieza', 'Congelados', 'Alimentación'
  ];

  // Lista que se renderiza en el HTML
  filteredCategories: string[] = [];

  loading = true;
  error = '';
  searchActive = false;

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {
    // Inicializamos la vista con todas las categorías
    this.filteredCategories = [...this.allCategories];
  }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    let completed = 0;

    const check = () => {
      completed++;
      if (completed === 2) {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    };

    this.apiService.getProducts().subscribe({
      next: (data) => { this.products = data; check(); },
      error: () => { this.error = 'Error de conexión con el servidor'; check(); }
    });

    this.apiService.getOffers({ isActive: true }).subscribe({
      next: (data) => { this.offers = data; check(); },
      error: () => check()
    });
  }

  // Ahora la búsqueda filtra las categorías locales
  onSearch(query: string) {
    const term = query.trim().toLowerCase();

    if (term === '') {
      this.searchActive = false;
      this.filteredCategories = [...this.allCategories];
    } else {
      this.searchActive = true;
      this.filteredCategories = this.allCategories.filter(cat =>
        cat.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

  onCategoryClick(category: string) {
    this.router.navigate(['/category', category]);
  }

  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Lácteos': '🥛', 'Panadería': '🍞', 'Carnes': '🥩',
      'Frutas y Verduras': '🥕', 'Bebidas': '🥤', 'Limpieza': '🧹',
      'Congelados': '🧊', 'Alimentación': '🍽️'
    };
    return emojiMap[category] || '📦';
  }

  getCategoryDescription(category: string): string {
    const descriptionMap: { [key: string]: string } = {
      'Lácteos': 'Leche, queso y derivados',
      'Panadería': 'Pan y bollería recién hecha',
      'Carnes': 'Cortes frescos y embutidos',
      'Frutas y Verduras': 'Productos de la huerta',
      'Bebidas': 'Refrescos, aguas y más',
      'Limpieza': 'Cuidado del hogar',
      'Congelados': 'Platos listos y conservas',
      'Alimentación': 'Despensa y básicos'
    };
    return descriptionMap[category] || 'Explora productos de esta categoría';
  }

  /**
   * IDs de producto de esta categoría que tienen al menos una oferta activa.
   * Es la única fuente de verdad: el campo product.discount no refleja
   * las ofertas reales (viven en la colección Offer, aparte).
   */
  private getProductIdsWithActiveOffer(category: string): Set<string> {
    const categoryProductIds = new Set(
      this.products
        .filter(p => p.category?.toLowerCase() === category.toLowerCase())
        .map(p => p.id)
    );
    const withOffer = new Set<string>();
    this.offers.forEach(o => {
      if (o.isActive && categoryProductIds.has(o.productId)) {
        withOffer.add(o.productId);
      }
    });
    return withOffer;
  }

  /**
   * Número de productos de la categoría que tienen alguna oferta activa.
   */
  getProductCountForCategory(category: string): number {
    return this.getProductIdsWithActiveOffer(category).size;
  }

  /**
   * Total de ofertas activas para los productos de la categoría.
   */
  getOffersCountForCategory(category: string): number {
    const productIds = new Set(
      this.products
        .filter(p => p.category?.toLowerCase() === category.toLowerCase())
        .map(p => p.id)
    );
    return this.offers.filter(o => productIds.has(o.productId) && o.isActive).length;
  }
}
