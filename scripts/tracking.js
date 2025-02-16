import { loadProducts, getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const url = new URL(window.location.href);
const productId = url.searchParams.get('productId');
const orderId = url.searchParams.get('orderId');
console.log('Product ID from URL:', productId);
console.log('Order ID from URL:', orderId);

function loadTrackingData(productId, orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  console.log('Orders in localStorage:', orders);

  const order = orders.find(order => order.orderId === orderId);

  if (!order) {
    console.error('Order not found for this order ID.');
    return;
  }

  console.log('Order found:', order);

  if (order.productId !== productId) {
    console.error('Product not found in this order.');
    return;
  }

  console.log('Product found in order:', order);

  const matchingProduct = getProduct(productId);

  if (!matchingProduct) {
    console.error('Product details not found in products.');
    return;
  }

  console.log('Product details found:', matchingProduct);

  const deliveryOption = getDeliveryOption(order.deliveryOptionId);
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const formattedDate = deliveryDate.format('dddd, MMMM D');

  document.querySelector('.js-delivery-date').textContent = `Arriving on ${formattedDate}`;
  document.querySelector('.js-product-name').textContent = matchingProduct.name || 'Product name not available';
  document.querySelector('.js-product-quantity').textContent = `Quantity: ${order.quantity}`;

  const productImage = matchingProduct.image || 'images/default-product-image.jpg'; 
  document.querySelector('.js-product-image').src = productImage;
}

loadProducts(() => {
  if (productId && orderId) {
    loadTrackingData(productId, orderId);
  } else {
    console.error('Product ID or Order ID not found in URL.');
  }
});