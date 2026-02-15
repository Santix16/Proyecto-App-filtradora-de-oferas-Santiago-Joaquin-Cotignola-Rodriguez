import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
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
    this.apiService.getProducts().subscribe({
      next: (allProducts) => {
        // Filtramos localmente para asegurar consistencia con los nombres de categoría
        this.products = allProducts.filter(p => 
          p.category?.toLowerCase() === category.toLowerCase()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No hemos podido cargar los productos. Reinténtalo en unos minutos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onProductClick(product: Product) {
    this.router.navigate(['/offers', product.id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Lácteos': '🥛', 'Panadería': '🍞', 'Carnes': '🥩', 
      'Frutas y Verduras': '🥕', 'Bebidas': '🥤', 'Limpieza': '🧹', 
      'Congelados': '🧊', 'Alimentación': '🍽️'
    };
    return emojiMap[category] || '📦';
  }
}