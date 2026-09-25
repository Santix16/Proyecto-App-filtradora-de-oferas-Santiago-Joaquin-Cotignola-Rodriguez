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
      console.log('Cargando ofertas para el producto ID:', productId); // Añade esto para depurar en consola

      // 1. Cargar Producto
      this.product = await lastValueFrom(this.apiService.getProductById(productId)) || null;

      // 2. Cargar Ofertas pasando explícitamente el productId
      const [allOffers, allStores] = await Promise.all([
        lastValueFrom(this.apiService.getOffers({ productId: productId, isActive: true })),
        lastValueFrom(this.apiService.getStores())
      ]);

      console.log('Ofertas filtradas recibidas del backend:', allOffers); //Revisa si cambian según el producto

      if (allOffers && allStores) {
        this.processOffers(allOffers, allStores);
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading offers:', err);
      this.error = 'Error al cargar las ofertas comparativas';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private processOffers(offers: Offer[], stores: Store[]) {
  const groups: OffersGroup[] = [];

  offers.forEach(offer => {
    const storeId = typeof offer.storeId === 'object' && offer.storeId !== null
      ? (offer.storeId as any)._id || (offer.storeId as any).id
      : offer.storeId;

    const store = stores.find((s: any) => s.id === storeId || s._id === storeId);
    if (!store) return;

    // Comprobamos si esta tienda ya tiene un grupo creado
    let group = groups.find((g: any) => g.store.id === store.id || (g.store as any)._id === (store as any)._id);

    if (!group) {
      group = { store, offers: [], bestScore: 0 };
      groups.push(group);
    }

    // Evitamos duplicar exactamente la misma oferta
    if (!group.offers.some(o => o.id === offer.id || (o as any)._id === (offer as any)._id)) {
      group.offers.push(offer);
    }
  });

  groups.forEach(group => {
    group.offers.sort((a, b) => a.finalPrice - b.finalPrice);
    group.bestScore = this.computeScore(group.store, group.offers[0]);
  });

  this.offersByStore = [...groups].sort((a, b) => b.bestScore - a.bestScore);
}

  private computeScore(store: Store, offer: Offer): number {
    const storeRating = store.rating || 3;
    const discountWeight = offer.discount * 1.5;
    const priceFactor = 100 / offer.finalPrice; // A menor precio, más puntos

    return discountWeight + (storeRating * 10) + priceFactor;
  }

  getSavings(offer: Offer): number {
    return Math.round((offer.originalPrice - offer.finalPrice) * 100) / 100;
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
      if (this.product) {
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
