import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent {
  @Input() stores: Store[] = [];
  
  // Aquí iría la lógica del mapa (Google Maps, Leaflet, etc.)
}
