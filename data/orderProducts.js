import { formatCurrency } from '../scripts/utils/money.js';

export let products = [];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export async function loadProducts() {
  try {
    const response = await fetch('https://supersimplebackend.dev/products');
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Produkte');
    }

    const productsData = await response.json();

    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('Produkte erfolgreich geladen:', products);
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});