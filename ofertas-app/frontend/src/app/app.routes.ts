import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { OffersComponent } from './pages/offers/offers.component';
import { OfferDetailComponent } from './pages/offer-detail/offer-detail.component';
import { ResultsComponent } from './pages/results/results.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'category/:name', component: CategoryComponent },
  { path: 'offers/:id', component: OffersComponent },
  { path: 'offer-detail/:id', component: OfferDetailComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: 'home' }
];
