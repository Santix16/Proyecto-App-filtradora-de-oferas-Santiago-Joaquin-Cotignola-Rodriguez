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
    this.error = '';

    // "category" filtra en el backend; el resto (solo productos con oferta
    // activa) lo resolvemos aquí cruzando con la colección Offer, que es la
    // única fuente real de descuentos (product.discount no se actualiza).
    this.apiService.getProducts({ category }).subscribe({
      next: (allProducts) => {
        const categoryProducts = allProducts.filter(p =>
          p.category?.toLowerCase() === category.toLowerCase()
        );

        if (categoryProducts.length === 0) {
          this.products = [];
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.apiService.getOffers({ isActive: true }).subscribe({
          next: (offers) => {
            const productIdsWithOffer = new Set(offers.map(o => o.productId));
            this.products = categoryProducts.filter(p => productIdsWithOffer.has(p.id));
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            // si falla la carga de ofertas, mejor mostrar los productos de
            // la categoría sin filtrar que dejar la página vacía
            this.products = categoryProducts;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.error = 'No hemos podido cargar los productos. Reinténtalo en unos minutos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onProductClick(product: any) {
    const productId = product._id || product.id;

    if (productId) {
      this.router.navigate(['/offers', productId]);
    } else {
      console.error('El ID del producto es undefined', product);
    }
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
