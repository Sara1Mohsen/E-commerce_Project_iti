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
                    <span class="candel-price">$${product.price}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                `;
                productCards.appendChild(card);
            });

            const addToCartButtons = document.querySelectorAll(".add-to-cart");
            addToCartButtons.forEach(button => {
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


function addToCart(product) {
    const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];

    const existingProduct = existingCart.find(item => item.productId === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        existingCart.push({
            productId: product.id,
            quantity: 1,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image
        });
    }

    sessionStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${product.name} has been added to your cart.`);

    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: product.id, 
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
        window.location.href = 'cart.html';
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('There was an error adding the product to the cart. Please try again.');
    });
}



const footScrollAppear = function () {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const footerPosition = footer.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (footerPosition < screenPosition) {
        footer.style.opacity = "1";
        footer.classList.add('visible');
    }
};

window.addEventListener('scroll', footScrollAppear);


document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = '../html/cart.html'; 
        });
    } else {
        console.error('Cart icon not found in the DOM.');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim().toLowerCase();

            if (query.length > 0) {
                fetch('http://localhost:3000/products')
                    .then(response => response.json())
                    .then(products => {
                        const filteredProducts = products.filter(product =>
                            product.name.toLowerCase().includes(query)
                        );

                        displaySearchResults(filteredProducts, searchResults);
                    })
                    .catch(error => console.error('Error fetching products:', error));
            } else {
                searchResults.innerHTML = ''; 
            }
        });
    } else {
        console.error('Search input or results container not found in the DOM.');
    }

    function displaySearchResults(products, container) {
        container.innerHTML = ''; 

        if (products.length === 0) {
            container.innerHTML = '<p>No products found.</p>';
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Description: ${product.description}</p>
            `;
            container.appendChild(productDiv);
        });
    }
});


fetch('http://localhost:3000/testimonials')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(testimonials => {
        const testimonialCards = document.querySelectorAll(".product-cards")[1];

        if (testimonialCards) {
            testimonials.forEach(testimonial => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <p class="testimonial-author">- ${testimonial.author}</p>
                `;
                testimonialCards.appendChild(card);
            });
        } else {
            console.error("Testimonial cards container not found in the DOM.");
        }
    })
    .catch(error => console.error('Error fetching testimonials:', error));

// User Info Display
// document.getElementById('user-info-button').addEventListener('click', function() {
//   const userInfoContainer = document.getElementById('user-info-display');
//   const userInfoJSON = localStorage.getItem('userInfo');
//   if (userInfoJSON) {
//     const userInfo = JSON.parse(userInfoJSON);
//     userInfoContainer.innerHTML = 
//       `<p>Name: ${userInfo.name}</p>
//        <p>Email: ${userInfo.email}</p>`;
//     userInfoContainer.style.display = 'block';
//   } else {
//     userInfoContainer.innerHTML = '<p>Please log in to see your information.</p>';
//     userInfoContainer.style.display = 'block';
//   }
// });
document.addEventListener('DOMContentLoaded', function() {
    const userInfoButton = document.getElementById('user-info-button');
    const userInfoDisplay = document.getElementById('user-info-display');
    if (userInfoButton && userInfoDisplay) {
        userInfoButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            if (userInfoDisplay.style.display === 'block') {
                userInfoDisplay.style.display = 'none';
            } else {
                userInfoDisplay.style.display = 'block';
                const userInfoJSON = localStorage.getItem('userInfo');
                if (userInfoJSON) {
                    const userInfo = JSON.parse(userInfoJSON);

                    
                    while (userInfoDisplay.firstChild) {
                        userInfoDisplay.removeChild(userInfoDisplay.firstChild);
                    }

                    const namePara = document.createElement('p');
                    namePara.textContent = `Name: ${userInfo.name}`;
                    userInfoDisplay.appendChild(namePara);

                    
                    const emailPara = document.createElement('p');
                    emailPara.textContent = `Email: ${userInfo.email}`;
                    userInfoDisplay.appendChild(emailPara);
                    
                    const logoutButton = document.createElement('button');
                    logoutButton.textContent = 'Logout';
                    logoutButton.addEventListener('click', function() {
                        localStorage.removeItem('userInfo');
                        userInfoDisplay.style.display = 'none';
                    });
                    userInfoDisplay.appendChild(logoutButton);
                } else {
                    
                    while (userInfoDisplay.firstChild) {
                        userInfoDisplay.removeChild(userInfoDisplay.firstChild);
                    }
                    const loginLink = document.createElement('a');
                    loginLink.href = 'html/login.html'; 
                    loginLink.textContent = 'Please log in to see your information.';
                    loginLink.className = 'login-link'; 
                    userInfoDisplay.appendChild(loginLink);
                }
            }
        });
    } else {
        console.error('User info button or display container not found in the DOM.');
    }
});