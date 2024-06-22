// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Función para obtener detalles del producto desde la API
function getProductDetails(productId) {
    fetch(`https://api.mercadolibre.com/items/${productId}`)
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product);
            setupAddToCartButton(product);
            getProductDescription(productId); // Obtener la descripción del producto
        })
        .catch(error => console.error('Error:', error));
}

// Función para mostrar los detalles del producto
function displayProductDetails(product) {
    const productDetailsSection = document.getElementById('product-details');
    productDetailsSection.innerHTML = `
        <img src="${product.pictures[0].url}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>Precio: $${product.price}</p>
        <p id="product-description">Cargando descripción...</p> <!-- Descripción del producto -->
    `;
}

// Función para obtener la descripción del producto
function getProductDescription(productId) {
    fetch(`https://api.mercadolibre.com/items/${productId}/description`)
        .then(response => response.json())
        .then(description => {
            const descriptionElement = document.getElementById('product-description');
            descriptionElement.innerText = description.plain_text || 'No hay descripción disponible para este producto.';
        })
        .catch(error => {
            console.error('Error:', error);
            const descriptionElement = document.getElementById('product-description');
            descriptionElement.innerText = 'No hay descripción disponible para este producto.';
        });
}

// Función para configurar el botón de añadir al carrito
function setupAddToCartButton(product) {
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.addEventListener('click', () => addToCart(product));
}

// Función para añadir un producto al carrito
function addToCart(product) {
    // Obtener el carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si el producto no está en el carrito, añadirlo con cantidad 1
        const productToAdd = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.thumbnail
        };
        cart.push(productToAdd);
    }
    
    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar el contador del carrito
    updateCartCount();

    // Mostrar un mensaje visual de éxito
    showAddToCartSuccess();
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Función para mostrar un mensaje visual de éxito al añadir al carrito
function showAddToCartSuccess() {
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.innerText = '¡Añadido!';
    setTimeout(() => {
        addToCartButton.innerText = 'Añadir al Carrito';
    }, 1500);
}

// Llamar a la función para obtener y mostrar los detalles del producto
getProductDetails(productId);

// Llamar a la función para actualizar el contador al cargar la página
updateCartCount();