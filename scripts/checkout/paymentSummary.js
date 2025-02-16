import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
            </div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalCents)}
            </div>
        </div>

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    const paymentSummary = {
        cartQuantity,
        productPriceCents,
        shippingPriceCents,
        totalBeforeTaxCents,
        taxCents,
        totalCents
    };
    localStorage.setItem('paymentSummary', JSON.stringify(paymentSummary));

    document.querySelector('.js-place-order').addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before placing an order.');
            return;
        }

        try {
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: cart
                })
            });

            const order = await response.json();
            addOrder(order);

            const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
            const newOrders = cart.map(cartItem => ({
                ...cartItem,
                orderId: crypto.randomUUID()
            }));
            localStorage.setItem('orders', JSON.stringify([...existingOrders, ...newOrders]));

            localStorage.setItem('cart', JSON.stringify([]));

            window.location.href = 'orders.html';
        } catch (error) {
            console.error('Unexpected error. Try again later.');
        }
    });

    const returnToHomeLink = document.querySelector('.js-return-to-home-link');
    if (returnToHomeLink) {
        returnToHomeLink.innerHTML = cartQuantity;
    } 
}