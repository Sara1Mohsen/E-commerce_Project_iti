// window.addEventListener('load' ,function(){
//     const discoverbutton = this.document.getElementById('home-button');

//     discoverbutton.addEventListener('click', ()=>{
//         fetch('http://localhost:3000/products').then(res=>{
//             res.json().then(result=>{
//                 let targetTable = this.document.createElement('table')
//                 targetTable.innerHTML= `<tr><th>name</th><th>ID</th></tr>`               
//                 for(let i = 0; i<result.length; i++){
//                     let targetTr = this.document.createElement('tr');
//                     for (const key in products) {
//                         let targetTd = this.document.createElement('td');
//                         targetTd.innerHTML = products[key];
//                         targetTr.appendChild(targetTd);
//                     }
//                    targetTable.appendChild(targetTr);
//                 }discoverbutton.appendChild(targetTable);

//             })

//         })
//     })
// })

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
                    <span class="candel-price">&dollar;${product.price}</span>
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
    


function addToCart(productId) {
    console.log(`Product with ID ${productId} added to cart`);
    
}
const products = [];
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    } else {
      console.error("Search input element not found.");
    }
  }

  function handleSearch() {
    if (!products || products.length === 0) {
      console.log("No products available yet.");
      return;
    }
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts);
  }
  function displaySearchResults(filteredProducts) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
  
    if (filteredProducts.length === 0) {
      searchResults.innerHTML = '<p>No products found for your search.</p>';
      return;
    }
  
    filteredProducts.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>$${product.price.toFixed(2)}</p>
      `;
      searchResults.appendChild(productDiv);
    });
  }

/////////////////////////////////////////////////////////
// Select elements
const searchInput = document.querySelector('.search-input');
const searchResults = document.getElementById('searchResults');

// Event listener for input
searchInput.addEventListener('input', debounce(handleSearch, 300));

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Handle search logic
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts);
}

// Display search results
function displaySearchResults(filteredProducts) {
    searchResults.innerHTML = '';

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<p>No products found for your search.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Category: ${product.category}</p>
            <p>$${product.price.toFixed(2)}</p>
        `;
        searchResults.appendChild(productDiv);
    });
}   