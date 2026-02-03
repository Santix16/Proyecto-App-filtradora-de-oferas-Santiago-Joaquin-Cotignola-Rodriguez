import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

interface OfferWithDetails {
  offer: Offer;
  product: Product;
  store: Store;
}

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.css']
})
export class OfferCardComponent {
  @Input() offerDetails!: OfferWithDetails;

  constructor(private router: Router) {}

  onCardClick() {
    // Navegar al detalle del producto con la oferta
    this.router.navigate(['/product', this.offerDetails.product.id], {
      queryParams: { offerId: this.offerDetails.offer.id }
    });
  }

  get discountPercentage(): number {
    return this.offerDetails.offer.discount;
  }

  get finalPrice(): number {
    return this.offerDetails.offer.finalPrice;
  }

  get originalPrice(): number {
    return this.offerDetails.offer.originalPrice;
  }
}
