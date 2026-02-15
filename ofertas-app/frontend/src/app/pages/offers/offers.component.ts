import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

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
  product: Product | null = null;
  offersByStore: OffersGroup[] = [];
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
      const productId = params['id'];
      if (productId) this.loadData(productId);
    });
  }

  private async loadData(productId: string) {
    try {
      this.loading = true;
      // 1. Cargar Producto
      this.product = await this.apiService.getProductById(productId).toPromise() || null;
      
      // 2. Cargar Ofertas y Tiendas en paralelo
      const [allOffers, allStores] = await Promise.all([
        this.apiService.getOffers({ productId, isActive: true }).toPromise(),
        this.apiService.getStores().toPromise()
      ]);

      if (allOffers && allStores) {
        this.processOffers(allOffers, allStores);
      }
      
      this.loading = false;
      this.cdr.detectChanges();
    } catch (err) {
      this.error = 'Error al cargar las ofertas comparativas';
      this.loading = false;
    }
  }

  private processOffers(offers: Offer[], stores: Store[]) {
    const groups: OffersGroup[] = [];

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
    this.offersByStore = groups.sort((a, b) => b.bestScore - a.bestScore);
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

  goBack() {
    window.history.back();
  }
}