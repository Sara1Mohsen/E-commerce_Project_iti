document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
  
        const password = document.getElementById('pass').value;
        const confirmPassword = document.getElementById('confirmPass').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('pass');
        const errorElement = document.getElementById('error');
        let messages = [];
  
        if (emailInput.value.trim() === '') {
            messages.push('Email is required');
        } else if (!emailInput.value.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            messages.push('Invalid email format');
        }
  
     
        if (passwordInput.value.length <= 6) {
            messages.push('Password must be longer than 6 characters');
        }
  
        if (messages.length > 0) {
            errorElement.innerText = messages.join(', ');
            return;  
        }
  
        let formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: password,
            role: document.getElementById('role').value,
            status: 'Active'  
        };
  
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            
            alert('Registration successful!');
  
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', formData.name);
            sessionStorage.setItem('userId', data.id);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userStatus', data.status);

            let userRole = data.role;
            if (userRole === 'admin') {
                window.location.href = "/html/admin.html";  
            } else if (userRole === 'customer') {
                window.location.href = '../E-commerce_Project_iti/index.html';  
            } else if (userRole === 'seller') {
                window.location.href = '/html/seller.html'; 
            } else {
                alert('Role not recognized. Please contact support.');
            }
        });
        
    });
  });