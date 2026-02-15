import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { ApiService } from '../../services/api.service';
import { lastValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FavoritesService } from '../../services/favorites.service';
import { Offer } from '../../models/offer.model';
import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';

interface OfferWithDetails {
  offer: Offer;
  product: Product;
  store: Store;
}

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [CommonModule, OfferCardComponent],
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.css']
})
export class PersonalListComponent implements OnInit, OnDestroy {
  offersWithDetails: OfferWithDetails[] = [];
  loading = true;
  error = '';
  private readonly destroy$ = new Subject<void>();
  private readonly cacheKey = 'cachedOffersWithDetails';

  constructor(
    private readonly apiService: ApiService,
    private readonly favService: FavoritesService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('PersonalListComponent: ngOnInit');

    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw) as OfferWithDetails[];
        console.log('PersonalListComponent: cache contents', parsed);
        const currentFavs = this.favService.getFavorites();
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.offersWithDetails = parsed.filter(od => currentFavs.includes(od.offer.id));
          console.log('PersonalListComponent: restored from cache, filtered list', this.offersWithDetails);
          this.loading = false;
        }
      }
    } catch (e) {
      console.warn('PersonalListComponent: cache restore failed', e);
    }

    this.favService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favIds) => {
        console.log('PersonalListComponent: favorites$ emitted', favIds);

        if (this.offersWithDetails.length && favIds.length < this.offersWithDetails.length) {
          this.offersWithDetails = this.offersWithDetails.filter(od =>
            favIds.includes(od.offer.id)
          );
          try {
            localStorage.setItem(this.cacheKey, JSON.stringify(this.offersWithDetails));
          } catch {}
        }

        this.loadFavorites(favIds);
      });

    // No need to call `loadFavorites()` manually; subscribing to a
    // BehaviorSubject immediately invokes the callback with the current
    // value.  The extra invocation previously could race with the
    // subscription and occasionally overwrite a valid list with an error-
    // driven empty state.

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearAll() {
    this.favService.clearAll();
    try { localStorage.removeItem(this.cacheKey); } catch {}
  }

  private loadFavorites(favIds?: string[]) {
    // always show the spinner while we rebuild the list.  previously we
    // only set loading=true when the array was empty, which could leave the
    // old items visible until the network request finished.  not a huge
    // deal but might confuse users who feel they need to reopen the page.
    this.loading = true;
    this.cdr.detectChanges();

    const ids = favIds ?? this.favService.getFavorites();
    console.log('PersonalListComponent: loadFavorites, favIds=', ids);

    if (!ids || ids.length === 0) {
      this.offersWithDetails = [];
      this.loading = false;
      return;
    }

    this.loadFavoritesData(ids);
  }

  private async loadFavoritesData(favIds: string[]) {
    try {
      console.log('PersonalListComponent: loadFavoritesData start');
      const allOffers = await lastValueFrom(this.apiService.getOffers());
      console.log('PersonalListComponent: offers fetched', allOffers?.length);
      const selected = allOffers.filter(o => favIds.includes(o.id));
      console.log('PersonalListComponent: selected count', selected.length);

      if (selected.length === 0) {
        this.offersWithDetails = [];
        this.loading = false;
        return;
      }

      const storeIds = [...new Set(selected.map(o => o.storeId))];
      const allProducts = await lastValueFrom(this.apiService.getProducts());
      const storePromises = storeIds.map(id =>
        lastValueFrom(this.apiService.getStoreById(id))
      );
      const stores = await Promise.all(storePromises);

      const productMap = new Map(allProducts.map(p => [p.id, p]));
      const storeMap = new Map(stores.map(s => [s.id, s]));

      const result: OfferWithDetails[] = [];
      selected.forEach(offer => {
        const product = productMap.get(offer.productId);
        const store = storeMap.get(offer.storeId);
        if (product && store) {
          result.push({ offer, product, store });
        } else {
          console.warn('PersonalListComponent: missing product or store for', offer.id);
        }
      });

      this.offersWithDetails = result;
      try { localStorage.setItem(this.cacheKey, JSON.stringify(result)); } catch {}

      console.log('PersonalListComponent: finished, result length', result.length);
      this.loading = false;
      // ensure the DOM reflects our updated array right away
      this.cdr.detectChanges();

    } catch (err) {
      console.error('✗ Error loading favorites:', err);
      this.error = 'Error al cargar las ofertas';
      this.loading = false;
    }
  }
}
