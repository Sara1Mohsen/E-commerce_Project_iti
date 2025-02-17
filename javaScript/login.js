const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pass');
const form = document.getElementById('form');
const errorElement = document.getElementById('error');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    
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

    let email = emailInput.value;
    let password = passwordInput.value;

    fetch('http://localhost:3000/users')  
        .then(response => response.json())
        .then(users => {
            let user = users.find(u => u.email === email && u.password === password);

            if (user) {
                alert('Login successful!');
                sessionStorage.setItem('userId', user.id);
                localStorage.setItem('isLoggedIn', 'true'); 
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userRole', user.role);  
                localStorage.setItem('userStatus', user.status);

                let userRole = user.role;
                if (userRole === 'admin') {
                    window.location.href = "/html/admin.html";  
                } else if (userRole === 'customer') {
                    window.location.href = '/index.html';  
                } else if (userRole === 'seller') {
                    window.location.href = '/html/seller.html';  
                } else {
                    alert('Role not recognized. Please contact support.');
                }

            } else {
                alert('Invalid email or password.');
            }
        })
        .catch(error => console.error('Error during login:', error));
});

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById('name').value,
        password: document.getElementById('pass').value,
        role: document.getElementById('role').value
    };

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.role === 'admin') {
            window.location.href = '/admin.html'; 
        } else if (data.role === 'customer') {
            window.location.href = '/customer.html'; 
        } else if (data.role === 'seller') {
            window.location.href = '../html/seller.html'; 
        } else {
            alert('Role not recognized. Please contact support.');
        }

        localStorage.setItem('islogin', 'true');
        localStorage.setItem('userName', data.name);
        sessionStorage.setItem('userid', data.id);
        localStorage.setItem('userStatus', data.status);
        localStorage.setItem('userRole', data.role);
    })
    .catch(error => console.error('Error during registration:', error));
});



// function forgot() {
//     event.preventDefault();

//     var email = document.getElementById("fe").value;

    
//     if (emailArray.indexOf(email) == -1) {
//         if (email === "") {
//             alert("Email required.");
//             return;
//         }
//         alert("Email does not exist.");
//         return;
//     }

//     alert("Email is sent to your email. Check it in 24hr. \nThanks.");
//     document.getElementById("fe").value = "";
// }
