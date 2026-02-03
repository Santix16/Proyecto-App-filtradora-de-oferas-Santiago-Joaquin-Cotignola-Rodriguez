import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  stores: Store[] = [];
  offers: Offer[] = [];
  categories: string[] = [
    'Lácteos',
    'Panadería',
    'Carnes',
    'Frutas y Verduras',
    'Bebidas',
    'Limpieza',
    'Congelados',
    'Alimentación'
  ];
  loading = true;
  error = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;

    // Cargar productos para contar ofertas por categoría
    this.apiService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        console.log('✅ Productos cargados:', data.length);
      },
      error: (error: any) => {
        console.error('❌ Error cargando productos:', error);
        this.error = 'Error al cargar productos. Verifica que json-server esté corriendo.';
      }
    });

    // Cargar ofertas activas
    this.apiService.getOffers({ isActive: true }).subscribe({
      next: (data: Offer[]) => {
        this.offers = data;
        this.loading = false;
        console.log('✅ Ofertas cargadas:', data.length);
      },
      error: (error: any) => {
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
      next: (data: Product[]) => {
        this.products = data;
        console.log('🔍 Resultados de búsqueda:', data.length);
      },
      error: (error: any) => {
        console.error('❌ Error en búsqueda:', error);
      }
    });
  }

  // Método para extraer subcategorías de los nombres de productos
  private extractSubcategories(products: Product[]): string[] {
    const subcategoryMap: { [key: string]: string[] } = {
      // Lácteos
      'Leche': ['leche', 'lácteos'],
      'Yogur': ['yogur', 'yogurt'],
      'Queso': ['queso'],

      // Panadería
      'Pan': ['pan', 'barra', 'baguette', 'baguete'],

      // Carnes
      'Pollo': ['pollo', 'pechuga'],
      'Ternera': ['ternera', 'carne picada'],

      // Frutas y Verduras
      'Naranja': ['naranja'],
      'Tomate': ['tomate'],
      'Plátano': ['plátano', 'banana'],

      // Bebidas
      'Agua': ['agua'],
      'Refresco': ['coca', 'cola', 'refresco'],
      'Zumo': ['zumo', 'jugo']
    };

    const subcategories = new Set<string>();

    products.forEach(product => {
      const name = product.name.toLowerCase();

      for (const [subcategory, keywords] of Object.entries(subcategoryMap)) {
        if (keywords.some((keyword: string) => name.includes(keyword))) {
          subcategories.add(subcategory);
          break; // Solo agregar la primera subcategoría que coincida
        }
      }
    });

    return Array.from(subcategories).sort();
  }

  // Método para manejar click en categoría
  onCategoryClick(category: string) {
    this.router.navigate(['/category', category]);
  }

  // Método para filtrar por categoría
  filterByCategory(category: string) {
    this.apiService.getProductsByCategory(category).subscribe({
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

  // Método auxiliar para obtener emoji de categoría
  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Lácteos': '🥛',
      'Panadería': '🍞',
      'Carnes': '🥩',
      'Frutas y Verduras': '🥕',
      'Bebidas': '🥤',
      'Limpieza': '🧹',
      'Congelados': '🧊',
      'Alimentación': '🍽️'
    };
    return emojiMap[category] || '📦';
  }

  // Método auxiliar para obtener descripción de categoría
  getCategoryDescription(category: string): string {
    const descriptionMap: { [key: string]: string } = {
      'Lácteos': 'Leche, queso, yogures y productos lácteos',
      'Panadería': 'Pan, bollería y productos de horno',
      'Carnes': 'Carnes frescas y procesadas',
      'Frutas y Verduras': 'Frutas y verduras frescas',
      'Bebidas': 'Refrescos, zumos y bebidas',
      'Limpieza': 'Productos de limpieza del hogar',
      'Congelados': 'Alimentos congelados y preparados',
      'Alimentación': 'Productos de alimentación general'
    };
    return descriptionMap[category] || 'Productos de esta categoría';
  }

  // Método para contar ofertas por categoría
  getOffersCountForCategory(category: string): number {
    // Filtrar productos de esta categoría (normalizar por si hay problemas de encoding)
    const productsInCategory = this.products.filter(p => {
      // Comparar normalizando espacios y caracteres especiales
      const productCat = (p.category || '').trim();
      const searchCat = (category || '').trim();
      return productCat.toLowerCase() === searchCat.toLowerCase();
    });
    const productIds = productsInCategory.map(p => p.id);
    return this.offers.filter(o => productIds.includes(o.productId) && o.isActive).length;
  }
}
