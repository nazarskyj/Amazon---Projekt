let searchProducts = [];

async function loadSearchProductsFromBackend() {
  try {
    const response = await fetch('https://supersimplebackend.dev/products');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    searchProducts = await response.json();
  } catch (error) {
    console.error('Error loading products for search:', error);
  }
}

export function displaySearchResults(filteredProducts) {
  const productList = document.getElementById('search-results-container');
  if (!productList) return;

  productList.innerHTML = '';

  if (filteredProducts.length > 0) {
    filteredProducts.forEach((product) => {
      const productItem = document.createElement('div');
      productItem.className = 'product-item';
      productItem.dataset.productId = product.id; 
      productItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${(product.priceCents / 100).toFixed(2)}</p>
        <p class="product-rating">Rating: ${product.rating.stars} (${product.rating.count} reviews)</p>
      `;

      productItem.addEventListener('click', () => {
        const targetProduct = document.querySelector(
          `.product-container[data-product-id="${product.id}"]`
        );

        if (targetProduct) {
          targetProduct.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          targetProduct.classList.add('highlight');
          setTimeout(() => {
            targetProduct.classList.remove('highlight');
          }, 1500);

          document.querySelector('.js-search-bar').value = '';
          productList.classList.remove('visible');
        }
      });

      productList.appendChild(productItem);
    });

    productList.classList.add('visible');
  } else {
    productList.classList.remove('visible');
  }
}

export function filterSearchProducts() {
  const searchInput = document.querySelector('.js-search-bar').value.toLowerCase();

  if (searchInput.trim() === '') {
    displaySearchResults([]);
    return;
  }

  const filteredProducts = searchProducts.filter((product) =>
    product.name.toLowerCase().includes(searchInput) ||
    (product.keywords && product.keywords.some((keyword) =>
      keyword.toLowerCase().includes(searchInput)
    ))
  );

  displaySearchResults(filteredProducts);
}

document.querySelector('.js-search-bar')?.addEventListener('input', filterSearchProducts);

document.querySelector('.js-search-button')?.addEventListener('click', filterSearchProducts);

document.addEventListener('DOMContentLoaded', loadSearchProductsFromBackend);