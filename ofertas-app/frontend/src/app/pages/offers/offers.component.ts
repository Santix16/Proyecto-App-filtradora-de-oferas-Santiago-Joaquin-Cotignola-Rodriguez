import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';
import { FavoritesService } from '../../services/favorites.service';
import { lastValueFrom } from 'rxjs';

// Details object used by FavoritesService cache operations
interface OfferWithDetails {
  offer: Offer;
  product: Product;
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
  imports: [CommonModule, RouterModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  product: Product | null = null;
  offersByStore: OffersGroup[] = [];
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly favService: FavoritesService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) this.loadData(productId);
    });
  }

  private async loadData(productId: string) {
    try {
      this.loading = true;
      // 1. Cargar Producto
      this.product = await lastValueFrom(this.apiService.getProductById(productId)) || null;

      // 2. Cargar Ofertas y Tiendas en paralelo
      const [allOffers, allStores] = await Promise.all([
        lastValueFrom(this.apiService.getOffers({ productId, isActive: true })),
        lastValueFrom(this.apiService.getStores())
      ]);

      if (allOffers && allStores) {
        this.processOffers(allOffers, allStores);
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading offers:', err);
      this.error = 'Error al cargar las ofertas comparativas';
      this.loading = false;
    }
  }

  private processOffers(offers: Offer[], stores: Store[]) {
    const groups: OffersGroup[] = [];

    // por si acaso el backend devuelve ofertas duplicadas para el mismo producto/tienda,
    // filtramos para quedarnos sólo con la primera ocurrencia de cada combinación.
    offers = offers.filter((offer, idx, self) =>
      self.findIndex(o => o.storeId === offer.storeId /* productId igual siempre */) === idx
    );

    // Agrupar por tienda
    offers.forEach(offer => {
      const store = stores.find(s => s.id === offer.storeId);
      if (!store) return;

      let group = groups.find(g => g.store.id === store.id);
      if (!group) {
        group = { store, offers: [], bestScore: 0 };
        groups.push(group);
      }
      group.offers.push(offer);
    });

    // Calcular scores y ordenar ofertas internas por precio
    groups.forEach(group => {
      group.offers.sort((a, b) => a.finalPrice - b.finalPrice);
      group.bestScore = this.computeScore(group.store, group.offers[0]);
    });

    // ORDENAR GRUPOS: Las mejores opciones (mejor score) arriba
    this.offersByStore = [...groups].sort((a, b) => b.bestScore - a.bestScore);
  }

  private computeScore(store: Store, offer: Offer): number {
    const storeRating = store.rating || 3;
    const discountWeight = offer.discount * 1.5;
    const priceFactor = 100 / offer.finalPrice; // A menor precio, más puntos

    return discountWeight + (storeRating * 10) + priceFactor;
  }

  getSavings(offer: Offer): number {
    return offer.originalPrice - offer.finalPrice;
  }

  onOfferClick(offer: Offer) {
    this.router.navigate(['/offer-detail', offer.id]);
  }

  isFavorite(offerId: string): boolean {
    return this.favService.isFavorite(offerId);
  }

  toggleFavorite(offer: Offer, event: Event) {
    event.stopPropagation();
    const id = offer.id;
    if (this.isFavorite(id)) {
      this.favService.remove(id);
    } else {
      // When adding from the offers page we already have the product and
      // store information available in this component, so provide the
      // details to the service.  That allows the personal list to restore
      // the new item from cache on the very first visit instead of needing
      // a second load.
      if (this.product) {
        // try to locate the store object for this offer; it should exist in
        // the current grouping.
        const storeObj = this.offersByStore.find(g => g.store.id === offer.storeId)
          ?.store as Store | undefined;
        if (!storeObj) {
          console.warn('OffersComponent.toggleFavorite: no store found for', offer.id);
        }
        const details: OfferWithDetails = { offer, product: this.product, store: storeObj as Store };
        this.favService.addWithDetails(id, details);
      } else {
        this.favService.add(id);
      }
    }
  }

  goBack() {
    globalThis.history.back();
  }
}
