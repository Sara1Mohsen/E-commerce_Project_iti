fetch('http://localhost:3000/products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(products => {
        const productCards = document.querySelector(".product-cards");

        if (productCards) {
            products.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <p class="candel-name">${product.name}</p>
                    <span class="candel-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                `;
                productCards.appendChild(card);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    addToCart(productId);
                });
            });
        } else {
            console.error("Product cards container not found in the DOM.");
        }
    })
    .catch(error => console.error('Error fetching products:', error));

function addToCart(productId) {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('You must be logged in to add items to the cart.');
        return;
    }

    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId: productId,
            userId: userId,
            quantity: 1,
            status: 'In Cart',
            dateAdded: new Date().toISOString()
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(cartItem => {
        console.log('Product added to cart:', cartItem);
        window.location.href = '../html/cart.html';
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('There was an error adding the product to the cart. Please try again.');
    });
}
