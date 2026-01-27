import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private locationSubject = new BehaviorSubject<{ latitude: number; longitude: number } | null>(null);
  public location$ = this.locationSubject.asObservable();

  constructor() { }

  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            this.locationSubject.next(location);
            resolve(location);
          },
          (error) => {
            console.error('Error getting location:', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  watchLocation(): Observable<{ latitude: number; longitude: number } | null> {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.locationSubject.next(location);
        },
        (error) => console.error('Error watching location:', error)
      );
    }
    return this.location$;
  }

  getLastLocation(): Observable<{ latitude: number; longitude: number } | null> {
    return this.location$;
  }
}
