document.addEventListener('DOMContentLoaded', function () {
    class AdminDashboard {
        constructor() {
            this.contentDiv = document.getElementById('content');
            if (!this.contentDiv) {
                throw new Error("Content div not found.");
            }
            this.initialize();
        }

        initialize() {
            this.attachMenuListeners();
            this.loadInitialData('customer'); // Load customer data by default
        }

        attachMenuListeners() {
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const target = event.target.getAttribute('data-target');
                    this.loadInitialData(target);
                });
            });
        }

        loadInitialData(target) {
            switch (target) {
                case 'product':
                    this.loadProductData();
                    break;
                case 'orders':
                    this.loadOrderData();
                    break;
                case 'customer':
                    this.loadUserData('customer');
                    break;
                case 'seller':
                    this.loadUserData('seller');
                    break;
                default:
                    console.error('Unknown target:', target);
            }
        }

        loadUserData(userType) {
            fetch(`http://localhost:3000/users?role=${userType}`)
                .then(response => response.json())
                .then(users => this.renderUserData(users, userType))
                .catch(error => console.error(`Error fetching ${userType} data:`, error));
        }

        renderUserData(users, userType) {
            this.contentDiv.innerHTML = `
                <h2>${userType.charAt(0).toUpperCase() + userType.slice(1)} Management</h2>
                <button class="add-${userType}">Add ${userType}</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td>
                                    <button class="edit-${userType}" data-id="${user.id}">Edit</button>
                                    <button class="delete-${userType}" data-id="${user.id}">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            this.attachUserEventListeners(userType);
        }

        attachUserEventListeners(userType) {
            document.querySelector(`.add-${userType}`).addEventListener('click', () => {
                this.showAddUserForm(userType);
            });

            document.querySelectorAll(`.edit-${userType}`).forEach(button => {
                button.addEventListener('click', (e) => {
                    const userId = e.target.getAttribute('data-id');
                    this.editUser(userId, userType);
                });
            });

            document.querySelectorAll(`.delete-${userType}`).forEach(button => {
                button.addEventListener('click', (e) => {
                    const userId = e.target.getAttribute('data-id');
                    this.deleteUser(userId, userType);
                });
            });
        }

        showAddUserForm(userType) {
            const modal = this.createModal(`
                <h2>Add ${userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                <form id="addUserForm">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    <label for="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                    </select>
                    <button type="submit">Add User</button>
                </form>
            `);

            document.getElementById('addUserForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addUser(userType);
                modal.remove();
            });
        }

        addUser(userType) {
            const form = document.getElementById('addUserForm');
            const newUser = {
                name: form.name.value,
                email: form.email.value,
                role: form.role.value
            };

            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            })
                .then(() => {
                    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} added successfully!`);
                    this.loadUserData(userType);
                })
                .catch(error => console.error(`Error adding ${userType}:`, error));
        }

        editUser(userId, userType) {
            fetch(`http://localhost:3000/users/${userId}`)
                .then(response => response.json())
                .then(user => {
                    const modal = this.createModal(`
                        <h2>Edit ${userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                        <form id="editUserForm">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" value="${user.name}" required>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" value="${user.email}" required>
                            <label for="role">Role:</label>
                            <select id="role" name="role" required>
                                <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>Customer</option>
                                <option value="seller" ${user.role === 'seller' ? 'selected' : ''}>Seller</option>
                            </select>
                            <button type="submit">Save Changes</button>
                        </form>
                    `);

                    document.getElementById('editUserForm').addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveUserChanges(userId, userType);
                        modal.remove();
                    });
                })
                .catch(error => console.error(`Error fetching ${userType}:`, error));
        }

        saveUserChanges(userId, userType) {
            const form = document.getElementById('editUserForm');
            const updatedUser = {
                name: form.name.value,
                email: form.email.value,
                role: form.role.value
            };

            fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            })
                .then(() => {
                    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} updated successfully!`);
                    this.loadUserData(userType);
                })
                .catch(error => console.error(`Error updating ${userType}:`, error));
        }

        deleteUser(userId, userType) {
            if (confirm(`Are you sure you want to delete this ${userType}?`)) {
                fetch(`http://localhost:3000/users/${userId}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully!`);
                        this.loadUserData(userType);
                    })
                    .catch(error => console.error(`Error deleting ${userType}:`, error));
            }
        }

        loadProductData() {
            fetch('http://localhost:3000/products')
                .then(response => response.json())
                .then(products => this.renderProductData(products))
                .catch(error => console.error('Error fetching products:', error));
        }

        renderProductData(products) {
            this.contentDiv.innerHTML = `
                <h2>Product Management</h2>
                <button class="add-product">Add Product</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Status</th>
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
                                <td>${product.status || 'Approved'}</td>
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

        attachProductEventListeners() {
            document.querySelector('.add-product').addEventListener('click', () => {
                this.showAddProductForm();
            });

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
        }

        showAddProductForm() {
            const modal = this.createModal(`
                <h2>Add Product</h2>
                <form id="addProductForm">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" step="0.01" required>
                    <label for="category">Category:</label>
                    <input type="text" id="category" name="category" required>
                    <label for="status">Status:</label>
                    <select id="status" name="status">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button type="submit">Add Product</button>
                </form>
            `);

            document.getElementById('addProductForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
                modal.remove();
            });
        }

        addProduct() {
            const form = document.getElementById('addProductForm');
            const newProduct = {
                name: form.name.value,
                price: parseFloat(form.price.value),
                category: form.category.value,
                status: form.status.value
            };

            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })
                .then(() => {
                    alert('Product added successfully!');
                    this.loadProductData();
                })
                .catch(error => console.error('Error adding product:', error));
        }

        editProduct(productId) {
            fetch(`http://localhost:3000/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    const modal = this.createModal(`
                        <h2>Edit Product</h2>
                        <form id="editProductForm">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" value="${product.name}" required>
                            <label for="price">Price:</label>
                            <input type="number" id="price" name="price" value="${product.price}" step="0.01" required>
                            <label for="category">Category:</label>
                            <input type="text" id="category" name="category" value="${product.category}" required>
                            <label for="status">Status:</label>
                            <select id="status" name="status">
                                <option value="Pending" ${product.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Approved" ${product.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                <option value="Rejected" ${product.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
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

        saveProductChanges(productId) {
            const form = document.getElementById('editProductForm');
            const updatedProduct = {
                name: form.name.value,
                price: parseFloat(form.price.value),
                category: form.category.value,
                status: form.status.value
            };

            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            })
                .then(() => {
                    alert('Product updated successfully!');
                    this.loadProductData();
                })
                .catch(error => console.error('Error updating product:', error));
        }

        deleteProduct(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        alert('Product deleted successfully!');
                        this.loadProductData();
                    })
                    .catch(error => console.error('Error deleting product:', error));
            }
        }

        loadOrderData() {
            fetch('http://localhost:3000/orders')
                .then(response => response.json())
                .then(orders => this.renderOrderData(orders))
                .catch(error => console.error('Error fetching orders:', error));
        }

        renderOrderData(orders) {
            this.contentDiv.innerHTML = `
                <h2>Order Management</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
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

        attachOrderEventListeners() {
            document.querySelectorAll('.order-status').forEach(select => {
                select.addEventListener('change', (e) => {
                    const orderId = e.target.getAttribute('data-id');
                    const newStatus = e.target.value;
                    this.updateOrderStatus(orderId, newStatus);
                });
            });
        }

        updateOrderStatus(orderId, newStatus) {
            fetch(`http://localhost:3000/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
                .then(() => {
                    alert('Order status updated successfully!');
                    this.loadOrderData();
                })
                .catch(error => console.error('Error updating order status:', error));
        }

        createModal(content) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">×</span>
                    ${content}
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            return modal;
        }
    }

    const adminDashboard = new AdminDashboard();
});