import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  
  // Usamos un nombre claro para el binding del input
  ngModelSearchQuery = '';

  onSearch() {
    this.search.emit(this.ngModelSearchQuery.trim());
  }

  onInputChange() {
    // Búsqueda en tiempo real (opcional, solo si quieres reactividad inmediata)
    if (this.ngModelSearchQuery.length >= 2 || this.ngModelSearchQuery.length === 0) {
      this.search.emit(this.ngModelSearchQuery.trim());
    }
  }

  clearSearch() {
    this.ngModelSearchQuery = '';
    this.search.emit('');
  }
}