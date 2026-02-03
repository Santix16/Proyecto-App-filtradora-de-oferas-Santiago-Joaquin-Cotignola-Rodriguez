import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  offer: Offer | null = null;
  store: Store | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      const offerId = this.route.snapshot.queryParams['offerId'];

      if (productId) {
        this.loadProductDetails(productId, offerId);
      }
    });
  }

  private loadProductDetails(productId: string, offerId?: string) {
    this.loading = true;

    // Cargar producto
    this.apiService.getProductById(productId).subscribe({
      next: (product: Product) => {
        this.product = product;

        // Si hay offerId, cargar la oferta específica
        if (offerId) {
          this.loadOfferDetails(offerId);
        } else {
          // Si no hay oferta específica, buscar ofertas activas para este producto
          this.apiService.getOffers({ productId: productId, isActive: true }).subscribe({
            next: (offers: Offer[]) => {
              if (offers.length > 0) {
                this.loadOfferDetails(offers[0].id);
              } else {
                this.loading = false;
              }
            },
            error: () => {
              this.loading = false;
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = 'Producto no encontrado';
        this.loading = false;
      }
    });
  }

  private loadOfferDetails(offerId: string) {
    this.apiService.getOfferById(offerId).subscribe({
      next: (offer: Offer) => {
        this.offer = offer;

        // Cargar información de la tienda
        this.apiService.getStoreById(offer.storeId).subscribe({
          next: (store: Store) => {
            this.store = store;
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error loading store:', error);
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading offer:', error);
        this.loading = false;
      }
    });
  }

  get discountPercentage(): number {
    if (this.product?.originalPrice && this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  get offerDiscountPercentage(): number {
    return this.offer?.discount || 0;
  }

  get offerFinalPrice(): number {
    return this.offer?.finalPrice || this.product?.price || 0;
  }

  get offerOriginalPrice(): number {
    return this.offer?.originalPrice || this.product?.originalPrice || 0;
  }
}
