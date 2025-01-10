document.addEventListener('DOMContentLoaded', function () {
    class SellerDashboard {
        constructor(sellerId) {
            this.sellerId = sellerId; // Seller ID (assumed to be passed from the backend)
            this.contentDiv = document.getElementById('content');
            this.initialize();
        }

        initialize() {
            this.loadSellerProducts();
            this.attachEventListeners();
        }

        // Load products for the logged-in seller
        loadSellerProducts() {
            fetch(`http://localhost:3000/products?sellerId=${this.sellerId}`)
                .then(response => response.json())
                .then(products => {
                    this.renderProducts(products);
                })
                .catch(error => console.error('Error fetching products:', error));
        }

        // Render the seller's products in a table
        renderProducts(products) {
            this.contentDiv.innerHTML = `
                <h2>Your Products</h2>
                <button id="addProductButton">Add Product</button>
                <table id="productTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>$${product.price.toFixed(2)}</td>
                                <td>${product.category}</td>
                                <td><img src="${product.image}" alt="${product.name}" style="max-width: 100px;"></td>
                                <td>
                                    <button class="edit-product" data-id="${product.id}">Edit</button>
                                    <button class="delete-product" data-id="${product.id}">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            this.attachProductEventListeners();
        }

        // Attach event listeners for edit and delete buttons
        attachProductEventListeners() {
            document.querySelectorAll('.edit-product').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    this.editProduct(productId);
                });
            });

            document.querySelectorAll('.delete-product').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    this.deleteProduct(productId);
                });
            });

            document.getElementById('addProductButton').addEventListener('click', () => {
                this.showAddProductForm();
            });
        }

        // Show a modal form to add a new product
        showAddProductForm() {
            const modal = this.createModal(`
                <h2>Add Product</h2>
                <form id="addProductForm">
                    <label for="name">Product Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" step="0.01" required>
                    <label for="category">Category:</label>
                    <input type="text" id="category" name="category" required>
                    <label for="image">Image URL:</label>
                    <input type="text" id="image" name="image">
                    <button type="submit">Add Product</button>
                </form>
            `);

            document.getElementById('addProductForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
                modal.remove();
            });
        }

        // Add a new product
        addProduct() {
            const form = document.getElementById('addProductForm');
            const newProduct = {
                name: form.name.value,
                price: parseFloat(form.price.value),
                category: form.category.value,
                image: form.image.value,
                sellerId: this.sellerId
            };

            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })
                .then(() => {
                    alert('Product added successfully!');
                    this.loadSellerProducts(); // Refresh the product list
                })
                .catch(error => console.error('Error adding product:', error));
        }

        // Edit an existing product
        editProduct(productId) {
            fetch(`http://localhost:3000/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    const modal = this.createModal(`
                        <h2>Edit Product</h2>
                        <form id="editProductForm">
                            <label for="name">Product Name:</label>
                            <input type="text" id="name" name="name" value="${product.name}" required>
                            <label for="price">Price:</label>
                            <input type="number" id="price" name="price" value="${product.price}" step="0.01" required>
                            <label for="category">Category:</label>
                            <input type="text" id="category" name="category" value="${product.category}" required>
                            <label for="image">Image URL:</label>
                            <input type="text" id="image" name="image" value="${product.image}">
                            <button type="submit">Save Changes</button>
                        </form>
                    `);

                    document.getElementById('editProductForm').addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveProductChanges(productId);
                        modal.remove();
                    });
                })
                .catch(error => console.error('Error fetching product:', error));
        }

        // Save changes to an existing product
        saveProductChanges(productId) {
            const form = document.getElementById('editProductForm');
            const updatedProduct = {
                name: form.name.value,
                price: parseFloat(form.price.value),
                category: form.category.value,
                image: form.image.value
            };

            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            })
                .then(() => {
                    alert('Product updated successfully!');
                    this.loadSellerProducts(); // Refresh the product list
                })
                .catch(error => console.error('Error updating product:', error));
        }

        // Delete an existing product
        deleteProduct(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        alert('Product deleted successfully!');
                        this.loadSellerProducts(); // Refresh the product list
                    })
                    .catch(error => console.error('Error deleting product:', error));
            }
        }

        // Load orders for the logged-in seller
        loadSellerOrders() {
            fetch(`http://localhost:3000/orders?sellerId=${this.sellerId}`)
                .then(response => response.json())
                .then(orders => {
                    this.renderOrders(orders);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }

        // Render the seller's orders in a table
        renderOrders(orders) {
            this.contentDiv.innerHTML = `
                <h2>Your Orders</h2>
                <table id="orderTable">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>Customer Name</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.productName}</td>
                                <td>${order.customerName}</td>
                                <td>${order.quantity}</td>
                                <td>${order.status}</td>
                                <td>
                                    <select class="order-status" data-id="${order.id}">
                                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            this.attachOrderEventListeners();
        }

        // Attach event listeners for order status updates
        attachOrderEventListeners() {
            document.querySelectorAll('.order-status').forEach(select => {
                select.addEventListener('change', (e) => {
                    const orderId = e.target.getAttribute('data-id');
                    const newStatus = e.target.value;
                    this.updateOrderStatus(orderId, newStatus);
                });
            });
        }

        // Update the status of an order
        updateOrderStatus(orderId, newStatus) {
            fetch(`http://localhost:3000/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
                .then(() => {
                    alert('Order status updated successfully!');
                    this.loadSellerOrders(); // Refresh the order list
                })
                .catch(error => console.error('Error updating order status:', error));
        }

        // Utility function to create a modal
        createModal(content) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-content">
                        <span class="modal-close">×</span>
                        ${content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            return modal;
        }
    }

    // Assume sellerId is passed from the backend or stored in session
    const sellerId = 1; // Replace with the actual seller ID
    const sellerDashboard = new SellerDashboard(sellerId);
});