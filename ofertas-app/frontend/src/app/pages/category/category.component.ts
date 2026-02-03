import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryName: string = '';
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['name'] || '';
      if (this.categoryName) {
        this.loadProductsByCategory(this.categoryName);
      }
    });
  }

  loadProductsByCategory(category: string) {
    this.loading = true;
    this.error = '';

    // Cargar todos los productos y filtrar por categoría local
    this.apiService.getProducts().subscribe({
      next: (allProducts: Product[]) => {
        // Filtrar productos por la categoría recibida (case-insensitive)
        this.products = allProducts.filter(p => {
          const productCat = (p.category || '').trim().toLowerCase();
          const searchCat = (category || '').trim().toLowerCase();
          return productCat === searchCat;
        });
        console.log(`📂 Productos en ${category}:`, this.products.length);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar productos de esta categoría';
        this.loading = false;
      }
    });
  }

  onProductClick(product: Product) {
    // Navegar a la página de ofertas del producto
    this.router.navigate(['/offers', product.id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

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
}
