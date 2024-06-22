let currentPage = 1;
const productsPerPage = 20;
let currentQuery = '';

// Guardar el estado en localStorage
function saveState() {
    localStorage.setItem('searchState', JSON.stringify({
        query: currentQuery,
        page: currentPage
    }));
}

// Restaurar el estado desde localStorage
function restoreState() {
    const state = JSON.parse(localStorage.getItem('searchState'));
    if (state) {
        currentQuery = state.query;
        currentPage = state.page;
        document.getElementById('search-input').value = currentQuery;
        performSearch(currentPage);
    }
}

// Limpiar el estado y restaurar la página de inicio
function clearState(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    localStorage.removeItem('searchState');
    currentQuery = '';
    currentPage = 1;
    document.getElementById('search-input').value = '';
    document.getElementById('results-section').innerHTML = '';
    document.getElementById('pagination-section').innerHTML = '';
    window.location.href = 'index.html'; // Redirigir a la página de inicio
}

// Función para realizar la búsqueda
function performSearch(page = 1) {
    currentQuery = document.getElementById('search-input').value;
    currentPage = page;

    if (currentQuery) {
        fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${currentQuery}&offset=${(currentPage - 1) * productsPerPage}&limit=${productsPerPage}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data.results);
                setupPagination(data.paging.total);
                saveState();
            })
            .catch(error => console.error('Error:', error));
    }
}

document.getElementById('search-button').addEventListener('click', () => performSearch(1));
document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch(1);
    }
});

document.getElementById('home-button').addEventListener('click', clearState);

function displayResults(products) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Precio: $${product.price}</p>
            <a href="product.html?id=${product.id}">Ver detalles</a>
        `;
        resultsSection.appendChild(productDiv);
    });
}

function setupPagination(totalProducts) {
    const paginationSection = document.getElementById('pagination-section');
    paginationSection.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Anterior';
        prevButton.addEventListener('click', () => performSearch(currentPage - 1));
        paginationSection.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => performSearch(i));
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationSection.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Siguiente';
        nextButton.addEventListener('click', () => performSearch(currentPage + 1));
        paginationSection.appendChild(nextButton);
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

updateCartCount();

function getFeaturedProducts() {
    const url = 'https://api.mercadolibre.com/sites/MLA/search?q=destacados&limit=6';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const products = data.results;
            displayCarousel(products.slice(0, 3));
            displayOffers(products.slice(3, 6));
        })
        .catch(error => console.error('Error:', error));
}

function displayCarousel(products) {
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = '';

    products.forEach(product => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        carouselItem.innerHTML = `<img src="${product.thumbnail}" alt="${product.title}">`;
        carousel.appendChild(carouselItem);
    });
}

function displayOffers(products) {
    const offersSection = document.getElementById('offers-section');
    offersSection.innerHTML = '<h2>Ofertas del Día</h2>';

    products.forEach(product => {
        const offerItem = document.createElement('div');
        offerItem.classList.add('offer-item');
        offerItem.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Precio: $${product.price}</p>
        `;
        offersSection.appendChild(offerItem);
    });
}

getFeaturedProducts();

let currentSlide = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.carousel');
    const totalSlides = document.querySelectorAll('.carousel-item').length;

    currentSlide += direction;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function loadCarouselImages() {
    getFeaturedProducts();
}

loadCarouselImages();

// Restaurar el estado al cargar la página
window.onload = restoreState;
