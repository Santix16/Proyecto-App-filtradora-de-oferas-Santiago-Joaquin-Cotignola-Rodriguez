import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

interface OfferWithStore {
  offer: Offer;
  store: Store;
}

interface OffersGroup {
  store: Store;
  offers: Offer[];
  bestScore: number;
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
  offersByStore: OffersGroup[] = [];
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
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
    // solicitar con _expand=store para que json-server incluya la tienda embebida
    this.apiService.getOffers({ productId: productId, isActive: true, _expand: 'store' }).subscribe({
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

        // Si las ofertas ya traen la tienda embebida (json-server _expand), usamos esa información
        const first = (activeOffers as any[])[0];
        if (first?.store) {
          // construir grupos directamente
          const groupsMap = new Map<string, OffersGroup>();

          activeOffers.forEach((offer: any) => {
            const store: Store = offer.store;
            if (!store) return;

            const score = this.computeScore(store, offer);

            if (!groupsMap.has(store.id)) {
              groupsMap.set(store.id, { store, offers: [], bestScore: score });
            }
            const group = groupsMap.get(store.id)!;
            group.offers.push(offer as Offer);
            if (score > group.bestScore) group.bestScore = score;
          });

          const groups: OffersGroup[] = Array.from(groupsMap.values()).map(g => {
            g.offers.sort((a, b) => this.computeScore(g.store, b) - this.computeScore(g.store, a));
            return g;
          });
          groups.sort((a, b) => b.bestScore - a.bestScore);

          const offersWithStores: OfferWithStore[] = [];
          groups.forEach(g => g.offers.forEach(o => offersWithStores.push({ offer: o, store: g.store })));

          this.offersByStore = groups;
          this.offersWithStores = offersWithStores;
          this.loading = false;
          return;
        }

        // Si no vienen embebidas, usar la lógica anterior que carga tiendas por separado
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
      const storeMap = new Map(
        stores
          .filter((s): s is Store => !!s)
          .map((s: Store) => [s.id, s])
      );

      // Build groups by store
      const groupsMap = new Map<string, OffersGroup>();

      offers.forEach(offer => {
        const store = storeMap.get(offer.storeId);
        if (!store) return;

        const score = this.computeScore(store, offer);

        if (!groupsMap.has(store.id)) {
          groupsMap.set(store.id, { store, offers: [], bestScore: score });
        }

        const group = groupsMap.get(store.id)!;
        group.offers.push(offer);
        // update best score
        if (score > group.bestScore) group.bestScore = score;
      });

      // Sort offers inside each group by score (quality-price) desc
      const groups: OffersGroup[] = Array.from(groupsMap.values()).map(g => {
        g.offers.sort((a, b) => this.computeScore(g.store, b) - this.computeScore(g.store, a));
        return g;
      });

      // Sort groups by best offer score desc
      groups.sort((a, b) => b.bestScore - a.bestScore);

      // Also keep a flat list for compatibility
      const offersWithStores: OfferWithStore[] = [];
      groups.forEach(g => g.offers.forEach(o => offersWithStores.push({ offer: o, store: g.store })));

      this.offersByStore = groups;
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

  private computeScore(store: Store, offer: Offer): number {
    // Simple quality-price score:
    // higher store rating and lower finalPrice => higher score
    const rating = store.rating ?? 3;
    // avoid division by zero
    const price = offer.finalPrice > 0 ? offer.finalPrice : 0.01;
    return rating / price;
  }

  get totalOffersCount(): number {
    return this.offersByStore.reduce((sum, g) => sum + g.offers.length, 0);
  }
}
