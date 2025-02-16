import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { displaySearchResults, filterSearchProducts } from '../backend/search-bar.js';

loadProducts(() => {
  renderProductsGrid();
  initializeSearchFunctionality();
});

function renderProductsGrid() {
  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}" alt="rating">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png" alt="checkmark">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  attachCartLogic();
}

function attachCartLogic() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);

      let matchingItem = cart.find((item) => item.productId === productId);

      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        cart.push({
          productId: productId,
          quantity: quantity,
        });
      }

      updateCartDisplay();
      saveToStorage();
    });
  });
}

function initializeSearchFunctionality() {
  const searchInput = document.querySelector('.js-search-input');
  const searchResultsContainer = document.querySelector('.search-results');

  searchInput.addEventListener('input', (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();

    if (searchQuery === '') {
      searchResultsContainer.classList.remove('visible');
      searchResultsContainer.innerHTML = '';
      return;
    }

    const filteredProducts = filterSearchProducts(products, searchQuery);
    displaySearchResults(filteredProducts, searchResultsContainer);
  });

  searchResultsContainer.addEventListener('animationend', (event) => {
    if (event.animationName === 'fadeOut') {
      searchResultsContainer.classList.remove('visible');
    }
  });
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartDisplay() {
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.js-cart-quantity').textContent = cartQuantity;
}

document.addEventListener('DOMContentLoaded', () => {
  cart.length = 0;
  cart.push(...loadCartFromStorage());
  updateCartDisplay();
});
