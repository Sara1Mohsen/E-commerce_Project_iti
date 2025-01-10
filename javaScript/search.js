document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length > 0) {
            fetch('http://localhost:3000/products')
                .then(response => response.json())
                .then(products => {
                    const filteredProducts = products.filter(product =>
                        product.name.toLowerCase().includes(query)
                    );

                    displaySearchResults(filteredProducts);
                })
                .catch(error => console.error('Error fetching products:', error));
        } else {
            searchResults.innerHTML = ''; // Clear results if the query is empty
        }
    });

    function displaySearchResults(products) {
        searchResults.innerHTML = ''; // Clear previous results

        if (products.length === 0) {
            searchResults.innerHTML = '<p>No products found.</p>';
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
            searchResults.appendChild(productDiv);
        });
    }
});
