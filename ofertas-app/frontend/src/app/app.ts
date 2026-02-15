import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = signal('Ofertas App - MVP');
  year = new Date().getFullYear();
  showMyList = signal(true);

  constructor(private readonly router: Router) {
    this.updateRoute(this.router.url);
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.updateRoute(evt.urlAfterRedirects);
      }
    });
  }

  private updateRoute(url: string) {
    this.showMyList.set(url !== '/my-list');
  }
}
