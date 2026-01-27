// Aquí irán los servicios de negocio para productos
// Por ejemplo: lógica de búsqueda avanzada, cálculos de descuentos, etc.

class ProductService {
  static calculateDiscount(originalPrice, finalPrice) {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }

  static getProductsByCategory(products, category) {
    return products.filter(product => product.category === category);
  }

  static sortByPrice(products, order = 'asc') {
    return [...products].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }

  static filterByRating(products, minRating) {
    return products.filter(product => (product.rating || 0) >= minRating);
  }
}

module.exports = ProductService;
