import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
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
    private apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, queryParams]) => {
      const productId = params.get('id') || params.get('productId');
      const offerId = queryParams.get('offerId');

      if (productId && productId !== 'undefined' && productId !== 'null') {
        this.loadProductDetails(productId, offerId || undefined);
      } else {
        console.error('No se encontró ningún ID válido en la ruta');
        this.loading = false;
        this.error = 'ID de producto inválido';
        this.cdr.detectChanges();
      }
    });
  }

  private loadProductDetails(productId: string, offerId?: string) {
    this.loading = true;

    this.apiService.getProductById(productId).subscribe({
      next: (product: Product) => {
        this.product = product;

        if (offerId && offerId !== 'undefined') {
          this.loadOfferDetails(offerId);
        } else {
          this.apiService.getOffers({ productId: productId, isActive: true }).subscribe({
            next: (offers: any[]) => {
              if (offers && offers.length > 0) {
                const validOfferId = offers[0].id || offers[0]._id;

                if (validOfferId) {
                  this.loadOfferDetails(validOfferId);
                } else {
                  console.warn('La oferta encontrada no tiene un ID válido (_id o id)');
                  this.loading = false;
                  this.cdr.detectChanges();
                }
              } else {
                this.loading = false;
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              console.error('Error fetching offers list:', err);
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = 'Producto no encontrado';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadOfferDetails(offerId: string) {
    if (!offerId || offerId === 'undefined' || offerId === 'null') {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.apiService.getOfferById(offerId).subscribe({
      next: (offer: any) => {
        this.offer = offer;

        const storeId = typeof offer.storeId === 'object' && offer.storeId !== null
          ? (offer.storeId._id || offer.storeId.id)
          : offer.storeId;

        if (storeId && typeof storeId === 'string') {
          this.apiService.getStoreById(storeId).subscribe({
            next: (store: Store) => {
              this.store = store;
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (error: any) => {
              console.error('Error loading store:', error);
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          if (typeof offer.storeId === 'object' && offer.storeId !== null) {
            this.store = offer.storeId as Store;
          }
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error loading offer:', error);
        this.loading = false;
        this.cdr.detectChanges();
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

  get offerSavings(): number {
    return Math.round((this.offerOriginalPrice - this.offerFinalPrice) * 100) / 100;
  }
}
