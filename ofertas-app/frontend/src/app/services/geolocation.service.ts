import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private geolocationSubject = new BehaviorSubject<GeolocationCoords | null>(null);
  public geolocation$ = this.geolocationSubject.asObservable();
  private lastKnownLocation: GeolocationCoords | null = null;
  private readonly CACHE_KEY = 'lastKnownLocation';

  constructor() {
    this.loadCachedLocation();
  }

  /**
   * Get current user position
   * @param options Geolocation position options
   * @returns Observable<GeolocationCoords>
   */
  getCurrentPosition(options?: PositionOptions): Observable<GeolocationCoords> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coords: GeolocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.lastKnownLocation = coords;
          this.geolocationSubject.next(coords);
          this.cacheLocation(coords);
          observer.next(coords);
          observer.complete();
        },
        (error: GeolocationPositionError) => {
          console.error('Geolocation error:', error);
          if (this.lastKnownLocation) {
            observer.next(this.lastKnownLocation);
            observer.complete();
          } else {
            observer.error(new Error(`Geolocation error: ${error.message}`));
          }
        },
        options || {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Watch location continuously
   */
  watchLocation(options?: PositionOptions): void {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        const coords: GeolocationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        this.lastKnownLocation = coords;
        this.geolocationSubject.next(coords);
        this.cacheLocation(coords);
      },
      (error: GeolocationPositionError) => {
        console.error('Error watching location:', error);
      },
      options || {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param lat1 First latitude
   * @param lng1 First longitude
   * @param lat2 Second latitude
   * @param lng2 Second longitude
   * @returns Distance in meters
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format distance for display
   * @param meters Distance in meters
   * @returns Formatted distance string (e.g., "2.5 km" or "150 m")
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Get last known location
   */
  getLastKnownLocation(): GeolocationCoords | null {
    return this.lastKnownLocation;
  }

  /**
   * Cache location in localStorage
   */
  private cacheLocation(coords: GeolocationCoords): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(coords));
    } catch (e) {
      console.warn('Failed to cache location:', e);
    }
  }

  /**
   * Load cached location from localStorage
   */
  private loadCachedLocation(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        this.lastKnownLocation = JSON.parse(cached);
        this.geolocationSubject.next(this.lastKnownLocation);
      }
    } catch (e) {
      console.warn('Failed to load cached location:', e);
    }
  }
}
