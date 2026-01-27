// Servicios para ofertas
// Por ejemplo: validación de ofertas activas, cálculo de ahorros, etc.

class OfferService {
  static isOfferActive(offer) {
    const now = new Date();
    return offer.isActive && 
           new Date(offer.startDate) <= now && 
           new Date(offer.endDate) >= now;
  }

  static calculateSavings(originalPrice, discount) {
    return Math.round((originalPrice * discount) / 100);
  }

  static getActiveOffers(offers) {
    return offers.filter(offer => this.isOfferActive(offer));
  }

  static sortByDiscount(offers, order = 'desc') {
    return [...offers].sort((a, b) => {
      return order === 'desc' ? b.discount - a.discount : a.discount - b.discount;
    });
  }
}

module.exports = OfferService;
