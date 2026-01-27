import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, OfferCardComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.products$.subscribe(products => {
      this.products = products;
    });
  }
}
