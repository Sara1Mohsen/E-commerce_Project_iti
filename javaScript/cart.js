document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    
    if (!cartContainer) {
        console.error('Cart container not found');
        return;
    }
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        cartRow.innerHTML = `
            <img src="${item.productImage}" alt="${item.productName}" class="cart-image">
            <p class="cart-name">${item.productName}</p>
            <span class="cart-price">$${item.productPrice.toFixed(2)}</span>
            <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-product-id="${item.productId}">
            <button class="remove-item" data-product-id="${item.productId}">Remove</button>
        `;
        cartContainer.appendChild(cartRow);
    });

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = e.target.dataset.productId;
            const newQuantity = e.target.value;
            updateCartItem(productId, newQuantity);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            removeCartItem(productId);
        });
    });
});

function updateCartItem(productId, newQuantity) {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    const updatedCart = cartItems.map(item => {
        if (item.productId === productId) {
            item.quantity = newQuantity;
        }
        return item;
    });

    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
}

function removeCartItem(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.productId !== productId);
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
    window.location.reload();
}
