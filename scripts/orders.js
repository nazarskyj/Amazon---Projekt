import { products, getProduct, loadProducts } from '../data/orderProducts.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}

const orders = JSON.parse(localStorage.getItem('orders'));

export function renderOrders() {
    if (!orders || orders.length === 0) {
        console.log('No orders found.');
        return;
    }

    let ordersHTML = '';

    const reversedOrders = [...orders].reverse();

    reversedOrders.forEach((order) => {
        const productId = order.productId;
        const matchingProduct = getProduct(productId);

        if (!matchingProduct) {
            console.error(`Product with ID ${productId} not found in the order.`);
            return; 
        }

        const deliveryOptionId = order.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        const orderId = order.orderId || crypto.randomUUID();

        ordersHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${dateString}</div>
                        </div>
                    </div>
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${orderId}</div>
                    </div>
                </div>
                <div class="order-details-grid">
                    <div class="product-image-container">
                        <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
                    </div>
                    <div class="product-details">
                        <div class="product-name">${matchingProduct.name}</div>
                        <div class="product-delivery-date">Arriving on: ${dateString}</div>
                        <div class="product-quantity">Quantity: ${order.quantity}</div>
                    </div>
                    <div class="product-actions">
                        <a href="tracking.html?orderId=${orderId}&productId=${productId}">
                            <button class="track-package-button button-secondary">Track package</button>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    const ordersGridElement = document.querySelector('.orders-grid');
    if (ordersGridElement) {
        ordersGridElement.innerHTML = ordersHTML;
    } else {
        console.error('Element with class .orders-grid not found.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    renderOrders(); 
});