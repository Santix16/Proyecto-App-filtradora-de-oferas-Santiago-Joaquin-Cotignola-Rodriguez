import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

interface OfferWithStore {
  offer: Offer;
  store: Store;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  offersWithStores: OfferWithStore[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'] || '';
      if (this.productId) {
        this.loadProductAndOffers(this.productId);
      }
    });
  }

  loadProductAndOffers(productId: string) {
    this.loading = true;
    this.error = '';

    // Cargar el producto
    this.apiService.getProductById(productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loadOffersForProduct(productId);
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = 'Producto no encontrado';
        this.loading = false;
      }
    });
  }

  loadOffersForProduct(productId: string) {
    // Cargar ofertas activas para este producto
    this.apiService.getOffers({ productId: productId, isActive: true }).subscribe({
      next: (offers: Offer[]) => {
        // Filtrar ofertas que aún están activas basándose en las fechas
        const now = new Date();
        const activeOffers = offers.filter((offer: Offer) => {
          const startDate = new Date(offer.startDate);
          const endDate = new Date(offer.endDate);
          return now >= startDate && now <= endDate;
        });

        if (activeOffers.length === 0) {
          this.loading = false;
          return;
        }

        // Para cada oferta, cargar la tienda correspondiente
        this.loadStoresForOffers(activeOffers);
      },
      error: (error: any) => {
        console.error('Error loading offers:', error);
        this.error = 'Error al cargar ofertas';
        this.loading = false;
      }
    });
  }

  loadStoresForOffers(offers: Offer[]) {
    const storeIds = [...new Set(offers.map(o => o.storeId))];
    const storePromises = storeIds.map(id => this.apiService.getStoreById(id).toPromise());

    Promise.all(storePromises).then((stores: any[]) => {
      const storeMap = new Map(stores.filter((s: Store | null | undefined) => s !== null && s !== undefined).map((s: Store) => [s!.id, s!]));

      const offersWithStores: OfferWithStore[] = [];
      offers.forEach(offer => {
        const store = storeMap.get(offer.storeId);
        if (store) {
          offersWithStores.push({ offer, store } as OfferWithStore);
        }
      });

      this.offersWithStores = offersWithStores;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading stores:', error);
      this.error = 'Error al cargar tiendas';
      this.loading = false;
    });
  }

  onOfferClick(offer: Offer) {
    // Navegar al detalle de la oferta
    this.router.navigate(['/offer-detail', offer.id]);
  }

  goBack() {
    this.router.navigate(['/category', this.product?.category]);
  }

  getSavings(offer: Offer): number {
    return offer.originalPrice - offer.finalPrice;
  }
}