// Servicios para tiendas
// Por ejemplo: búsqueda geolocalizada, filtrado por ubicación, etc.

class StoreService {
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static getNearbyStores(stores, userLat, userLon, radius = 5) {
    return stores.filter(store => {
      const distance = this.calculateDistance(
        userLat,
        userLon,
        store.location.latitude,
        store.location.longitude
      );
      return distance <= radius;
    });
  }

  static sortByDistance(stores, userLat, userLon) {
    return [...stores].sort((a, b) => {
      const distanceA = this.calculateDistance(
        userLat,
        userLon,
        a.location.latitude,
        a.location.longitude
      );
      const distanceB = this.calculateDistance(
        userLat,
        userLon,
        b.location.latitude,
        b.location.longitude
      );
      return distanceA - distanceB;
    });
  }

  static sortByRating(stores, order = 'desc') {
    return [...stores].sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
  }
}

module.exports = StoreService;
