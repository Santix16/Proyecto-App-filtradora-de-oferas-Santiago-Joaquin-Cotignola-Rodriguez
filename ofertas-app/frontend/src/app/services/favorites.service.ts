import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer.model';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';

interface OfferWithDetails {
  offer: Offer;
  product: Product;
  store: Store;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'favoriteOffers';
  private readonly cacheKey = 'cachedOffersWithDetails';
  private readonly _favorites$ = new BehaviorSubject<string[]>(this.loadFavorites());

  get favorites$() {
    return this._favorites$.asObservable();
  }

  private loadFavorites(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(favs: string[]) {
    // store and publish; log to make debugging easier when list seems empty
    console.log('FavoritesService.save', favs);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this._favorites$.next(favs);
  }

  getFavorites(): string[] {
    return [...this.loadFavorites()];
  }

  add(offerId: string) {
    const favs = this.loadFavorites();
    if (!favs.includes(offerId)) {
      favs.push(offerId);
      this.save(favs);
    }
  }

  // Add with optional full details to seed the cache used by PersonalListComponent
  addWithDetails(offerId: string, details?: OfferWithDetails) {
    // always ensure the ID is part of the favorites list itself (and emit)
    this.add(offerId);

    if (!details) {
      console.warn('FavoritesService.addWithDetails called without details for', offerId);
      return;
    }

    // guard against malformed objects—only cache when all three pieces are
    // present.  this prevents the personal list from crashing with a
    // `Cannot read property 'name' of null` error if a store is missing.
    if (!details.offer || !details.product || !details.store || !details.store.id) {
      console.warn('FavoritesService.addWithDetails received incomplete details, skipping cache', details);
      return;
    }

    try {
      const raw = localStorage.getItem(this.cacheKey);
      const arr = raw ? (JSON.parse(raw) as OfferWithDetails[]) : [];
      if (!arr.find(x => x.offer.id === offerId)) {
        arr.push(details);
        localStorage.setItem(this.cacheKey, JSON.stringify(arr));
        console.log('FavoritesService: cached details for', offerId);
      }
    } catch (e) {
      console.error('FavoritesService: failed to cache details', e);
    }
  }

  remove(offerId: string) {
    let favs = this.loadFavorites();
    favs = favs.filter(id => id !== offerId);
    this.save(favs);
    // Also remove from cached details if present
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (!raw) return;
      let arr = JSON.parse(raw) as OfferWithDetails[];
      arr = arr.filter(x => x.offer.id !== offerId);
      localStorage.setItem(this.cacheKey, JSON.stringify(arr));
    } catch {}
  }

  clearAll() {
    this.save([]);
  }

  isFavorite(offerId: string): boolean {
    return this.loadFavorites().includes(offerId);
  }
}
