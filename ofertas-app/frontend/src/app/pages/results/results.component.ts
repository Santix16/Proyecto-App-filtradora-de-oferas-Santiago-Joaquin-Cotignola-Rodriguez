import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

interface OfferWithDetails {
  offer: Offer;
  product: Product;
  store: Store;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, OfferCardComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  subcategory: string = '';
  offersWithDetails: OfferWithDetails[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.subcategory = params['subcategory'] || '';
      if (this.subcategory) {
        this.loadOffersForSubcategory(this.subcategory);
      }
    });
  }

  loadOffersForSubcategory(subcategory: string) {
    this.loading = true;
    this.error = '';

    // Primero obtener productos
    this.apiService.getProducts().subscribe({
      next: (products: Product[]) => {
        // Filtrar productos que pertenecen a esta subcategoría
        const productsInSubcategory = this.filterProductsBySubcategory(products, subcategory);
        
        if (productsInSubcategory.length === 0) {
          this.loading = false;
          return;
        }

        const productIds = productsInSubcategory.map(p => p.id);

        // Obtener ofertas activas para estos productos
        this.apiService.getOffers({ isActive: true }).subscribe({
          next: (offers: Offer[]) => {
            const offersForSubcategory = offers.filter((o: Offer) => productIds.includes(o.productId));

            // Para cada oferta, combinar con producto y tienda
            this.combineOffersWithDetails(offersForSubcategory, productsInSubcategory);
          },
          error: (error: any) => {
            console.error('Error loading offers:', error);
            this.error = 'Error al cargar ofertas';
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar productos';
        this.loading = false;
      }
    });
  }

  private filterProductsBySubcategory(products: Product[], subcategory: string): Product[] {
    const keywordMap: { [key: string]: string[] } = {
      'Leche': ['leche', 'lácteos'],
      'Yogur': ['yogur', 'yogurt'],
      'Queso': ['queso'],
      'Pan': ['pan', 'barra', 'baguette', 'baguete'],
      'Pollo': ['pollo', 'pechuga'],
      'Ternera': ['ternera', 'carne picada'],
      'Naranja': ['naranja'],
      'Tomate': ['tomate'],
      'Plátano': ['plátano', 'banana'],
      'Agua': ['agua'],
      'Refresco': ['coca', 'cola', 'refresco'],
      'Zumo': ['zumo', 'jugo']
    };

    const keywords = keywordMap[subcategory] || [];
    
    return products.filter(product => {
      const name = product.name.toLowerCase();
      return keywords.some(keyword => name.includes(keyword));
    });
  }

  private combineOffersWithDetails(offers: Offer[], products: Product[]) {
    const offersWithDetails: OfferWithDetails[] = [];

    // Obtener todas las tiendas necesarias
    const storeIds = [...new Set(offers.map(o => o.storeId))];
    const storePromises = storeIds.map(id => this.apiService.getStoreById(id).toPromise());

    Promise.all(storePromises).then((stores: any[]) => {
      const storeMap = new Map(stores.filter((s: Store | null | undefined) => s !== null && s !== undefined).map((s: Store) => [s!.id, s!]));

      offers.forEach(offer => {
        const product = products.find(p => p.id === offer.productId);
        const store = storeMap.get(offer.storeId);

        if (product && store) {
          offersWithDetails.push({
            offer,
            product,
            store
          } as OfferWithDetails);
        }
      });

      this.offersWithDetails = offersWithDetails;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading stores:', error);
      this.error = 'Error al cargar tiendas';
      this.loading = false;
    });
  }
}
