    // document.addEventListener('DOMContentLoaded', () => {
    // let userId = sessionStorage.getItem('userId');

    // if (!userId) {
    //     document.getElementById('cartMainContainer').innerHTML = '<p>You must log in to view your cart.</p>';
    //     return;
    // }

    // Promise.all([
    //     fetch('http://localhost:3000/cart').then(res => res.json()),
    //     fetch('http://localhost:3000/products').then(res => res.json()),
    //     fetch('http://localhost:3000/Shipped').then(res => res.json())
    // ])
    // .then(([cart, products, shippedOrders]) => {
    //     let cartContainer = document.getElementById('cartContainer');
    //     let userCart = cart.filter(item => item.userId === userId);

    //     if (userCart.length === 0) {
    //         cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    //         return;
    //     }

    //     userCart.forEach(cartItem => {
    //         let product = products.find(p => p.id === cartItem.productId);

    //         if (product) {
    //             let cartDiv = document.createElement('div');
    //             cartDiv.classList.add('cart-item');
    //             let imageSrc = product.image.startsWith('data:image') ? product.image : `../${product.image}`;

    //             let isShipped = shippedOrders.some(order => order.productId === product.id && order.userId === userId);
    //             let buttonText = isShipped ? 'Just Shipped' : 'Order Now';
    //             let buttonClass = isShipped ? 'just-shipped' : 'order-now';

    //             cartDiv.innerHTML = `
    //                 <h2>${product.name}</h2>
    //                 <p><strong>Description:</strong> ${product.description}</p>
    //                 <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
    //                 <img src="${imageSrc}" alt="${product.name}" width="250px">
    //                 <a href="productDetails.html?id=${product.id}" class="btn-details">View Details</a>
    //                 <button class="${buttonClass}" data-product-id="${product.id}" data-cart-id="${cartItem.id}">${buttonText}</button>
    //                 <button class="cancel_order" data-product-id="${product.id}" data-cart-id="${cartItem.id}">Cancel</button>
    //             `;

    //             cartContainer.appendChild(cartDiv);
    //         }
    //     });

    //     document.querySelectorAll('.order-now').forEach(button => {
    //         button.addEventListener('click', (event) => {
    //             let productId = event.target.getAttribute('data-product-id');
    //             let cartItemId = event.target.getAttribute('data-cart-id');

    //             // Show confirmation dialog first
    //             Swal.fire({
    //                 title: 'Confirm Order',
    //                 text: 'Are you sure you want to place this order?',
    //                 icon: 'question',
    //                 showCancelButton: true,
    //                 confirmButtonText: 'Yes, Place Order',
    //                 cancelButtonText: 'Cancel',
    //                 confirmButtonColor: '#3085d6',
    //                 cancelButtonColor: '#d33'
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     // If user confirms, proceed with order
    //                     fetch('http://localhost:3000/orders', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json'
    //                         },
    //                         body: JSON.stringify({
    //                             productId: productId,
    //                             userId: userId,
    //                             status: 'Ordered',
    //                             date: new Date().toISOString()
    //                         })
    //                     })
    //                     .then(response => response.json())
    //                     .then(orderData => {
    //                         console.log('Order created:', orderData);

    //                         return fetch(`http://localhost:3000/cart/${cartItemId}`, {
    //                             method: 'PATCH',
    //                             headers: {
    //                                 'Content-Type': 'application/json'
    //                             },
    //                             body: JSON.stringify({
    //                                 status: 'Ordered'
    //                             })
    //                         });
    //                     })
    //                     .then(() => {
    //                         Swal.fire({
    //                             title: 'Order Placed Successfully!',
    //                             text: 'Thank you for your order!',
    //                             icon: 'success',
    //                             showConfirmButton: false,
    //                             timer: 2000
    //                         }).then(() => {
    //                             location.reload();
    //                         });
    //                     })
    //                     .catch(error => {
    //                         console.error('Error placing order:', error);
    //                         Swal.fire({
    //                             title: 'Error!',
    //                             text: 'There was an error placing your order. Please try again.',
    //                             icon: 'error',
    //                             confirmButtonText: 'OK'
    //                         });
    //                     });
    //                 }
    //             });
    //         });
    //     });

    //     document.querySelectorAll('.just-shipped').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //             let productId = event.target.getAttribute('data-product-id');
    //             let cartItemId = event.target.getAttribute('data-cart-id');

    //             fetch('http://localhost:3000/Delivered', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     productId: productId,
    //                     userId: userId,
    //                     status: 'Delivered',
    //                     date: new Date().toISOString()
    //                 })
    //             })
    //             .then(response => response.json())
    //             .then(orderData => {
    //                 console.log('Order delivered:', orderData);

    //                 return fetch(`http://localhost:3000/Shipped/${cartItemId}`, {
    //                     method: 'PATCH',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         status: 'Delivered'
    //                     })
    //                 });
    //             })
    //             .then(() => {
    //                 return fetch(`http://localhost:3000/cart/${cartItemId}`, {
    //                     method: 'DELETE'
    //                 });
    //             })
    //             .then(() => {
    //                 Swal.fire({
    //                     title: 'Order Shipped!',
    //                     text: 'We will deliver it soon.',
    //                     icon: 'success',
    //                     showConfirmButton: false,
    //                     timer: 2000
    //                 }).then(() => {
    //                     location.reload();
    //                 });
    //             })
    //             .catch(error => {
    //                 console.error('Error processing order:', error);
    //                 alert('There was an error processing your order.');
    //             });
    //         });
    //     });

    // document.querySelectorAll('.cancel_order').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //             let productId = event.target.getAttribute('data-product-id');
    //             let cartItemId = event.target.getAttribute('data-cart-id');

    //             // Show confirmation dialog first
    //             Swal.fire({
    //                 title: 'Cancel Order',
    //                 text: 'Are you sure you want to cancel this order?',
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonText: 'Yes, Cancel Order',
    //                 cancelButtonText: 'No, Keep Order',
    //                 confirmButtonColor: '#d33',
    //                 cancelButtonColor: '#3085d6'
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     fetch('http://localhost:3000/canceld', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json'
    //                         },
    //                         body: JSON.stringify({
    //                             productId: productId,
    //                             userId: userId,
    //                             status: 'Canceled',
    //                             date: new Date().toISOString()
    //                         })
    //                     })
    //                     .then(response => response.json())
    //                     .then(orderData => {
    //                         console.log('Order Canceled:', orderData);

    //                         return fetch(`http://localhost:3000/cart/${cartItemId}`, {
    //                             method: 'PATCH',
    //                             headers: {
    //                                 'Content-Type': 'application/json'
    //                             },
    //                             body: JSON.stringify({
    //                                 status: 'Canceled'
    //                             })
    //                         });
    //                     })
    //                     .then(() => {
    //                         Swal.fire({
    //                             title: 'Order Cancelled!',
    //                             text: 'We hope to serve you again soon.',
    //                             icon: 'error',
    //                             showConfirmButton: false,
    //                             timer: 2000
    //                         }).then(() => {
    //                             location.reload();
    //                         });
    //                     })
    //                     .catch(error => {
    //                         console.error('Error canceling order:', error);
    //                         Swal.fire({
    //                             title: 'Error!',
    //                             text: 'There was an error canceling your order. Please try again.',
    //                             icon: 'error',
    //                             confirmButtonText: 'OK'
    //                         });
    //                     });
    //                 }
    //             });
    //         });
    //     });

    // })
    // .catch(error => {
    //     console.error('Error fetching cart data:', error);
    //     document.getElementById('cartContainer').innerHTML = '<p>Failed to load your cart.</p>';
    // });
    // });

    document.addEventListener('DOMContentLoaded', () => {
        let userId = sessionStorage.getItem('userId');
    
        if (!userId) {
            // document.getElementById('cartContainer').innerHTML = '<p>You must log in to view your cart.</p>';
            return;
        }
    
        Promise.all([
            fetch('http://localhost:3000/cart').then(res => res.json()),
            fetch('http://localhost:3000/products').then(res => res.json()),
            fetch('http://localhost:3000/Shipped').then(res => res.json())
        ])
        .then(([cart, products, shippedOrders]) => {
            console.log('Cart data:', cart);
            console.log('Products data:', products);
            console.log('Shipped orders data:', shippedOrders);
    
            let cartContainer = document.getElementById('cartContainer');
    
            let userCart = cart.filter(item => item.userId === userId);
    
            if (userCart.length === 0) {
                cartContainer.innerHTML = '<p>Your cart is empty.</p>';
                return;
            }
    
            userCart.forEach(cartItem => {
                let product = products.find(p => p.id === cartItem.productId);
    
                if (!product) {
                    console.error(`Product not found for productId ${cartItem.productId}`);
                    return;
                }
    
                let cartDiv = document.createElement('div');
                cartDiv.classList.add('cart-item');
                let imageSrc = product.image.startsWith('data:image') ? product.image : `../images/${product.image}`;
    
                let isShipped = shippedOrders.some(order => order.productId === product.id && order.userId === userId);
                let buttonText = isShipped ? 'Just Shipped' : 'Order Now';
                let buttonClass = isShipped ? 'just-shipped' : 'order-now';
    
                cartDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <img src="${imageSrc}" alt="${product.name}" width="250px">
                    <a href="productDetails.html?id=${product.id}" class="btn-details">View Details</a>
                    <button class="${buttonClass}" data-product-id="${product.id}" data-cart-id="${cartItem.id}">${buttonText}</button>
                    <button class="cancel_order" data-product-id="${product.id}" data-cart-id="${cartItem.id}">Cancel</button>
                `;
    
                cartContainer.appendChild(cartDiv);
            });
    
            document.querySelectorAll('.order-now, .just-shipped').forEach(button => {
                button.addEventListener('click', (event) => {
                    // Add functionality for ordering
                    console.log('Order button clicked');
                });
            });
    
            document.querySelectorAll('.cancel_order').forEach(button => {
                button.addEventListener('click', (event) => {
                    // Add functionality for canceling order
                    console.log('Cancel button clicked');
                });
            });
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
            document.getElementById('cartContainer').innerHTML = '<p>Failed to load your cart.</p>';
        });
    });