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
  searchQuery = '';

  onSearch() {
    this.search.emit(this.searchQuery);
  }

  onInputChange() {
    // Búsqueda en tiempo real (opcional)
    if (this.searchQuery.length >= 2 || this.searchQuery.length === 0) {
      this.search.emit(this.searchQuery);
    }
  }
}