import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent {
  @Input() stores: Store[] = [];
}
