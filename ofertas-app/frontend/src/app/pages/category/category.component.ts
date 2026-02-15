import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    // solicitamos al backend únicamente productos con descuento para cumplir
    // la regla de negocio de "solo ofertas"
    this.apiService.getProducts({ category, discount_gte: 1 }).subscribe({
      next: (allProducts) => {
        // en caso de que el servidor no haya respetado el filtro, lo reforzamos
        this.products = allProducts.filter(p =>
          p.category?.toLowerCase() === category.toLowerCase()
          && (p.discount || 0) > 0
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
