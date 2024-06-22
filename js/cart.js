// Función para obtener el carrito del localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Función para guardar el carrito en el localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para mostrar los productos en el carrito
function displayCart() {
    const cart = getCart();
    const cartSection = document.getElementById('cart-section');
    const checkoutButton = document.getElementById('checkout-button');
    cartSection.innerHTML = ''; // Limpiar contenido previo
    
    if (cart.length === 0) {
        cartSection.innerHTML = '<p>El carrito está vacío</p>';
        checkoutButton.style.display = 'none'; // Ocultar el botón de finalizar compra
        return;
    }
    
    cart.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('cart-product');
        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="cart-product-details">
                <h2>${product.title}</h2>
                <p>Precio: $${product.price}</p>
                <p>Cantidad: ${product.quantity}</p>
            </div>
            <div class="cart-product-actions">
                <button onclick="updateQuantity('${product.id}', -1)">-</button>
                <button onclick="updateQuantity('${product.id}', 1)">+</button>
                <button onclick="removeFromCart('${product.id}')">Eliminar</button>
            </div>
        `;
        cartSection.appendChild(productDiv);
    });

    // Mostrar el precio total
    const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h3>Total: $${totalPrice}</h3>`;
    cartSection.appendChild(totalDiv);

    checkoutButton.style.display = 'block'; // Mostrar el botón de finalizar compra si hay productos
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(productId, change) {
    const cart = getCart();
    const productIndex = cart.findIndex(product => product.id === productId);
    
    if (productIndex > -1) {
        cart[productIndex].quantity += change;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); // Eliminar el producto si la cantidad es 0 o menos
        }
    }
    
    saveCart(cart);
    displayCart();
    updateCartCount();
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(product => product.id !== productId);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

// Función para finalizar la compra
function checkout() {
    if (confirm('¿Estás seguro de que deseas finalizar la compra?')) {
        localStorage.removeItem('cart'); // Limpiar el carrito
        alert('¡Compra finalizada con éxito!');
        displayCart(); // Actualizar la vista del carrito
        updateCartCount();
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Configurar el botón de finalizar compra
document.getElementById('checkout-button').addEventListener('click', checkout);

// Mostrar el carrito al cargar la página
displayCart();

// Llamar a la función para actualizar el contador al cargar la página
updateCartCount();