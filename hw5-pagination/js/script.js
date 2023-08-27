const productsContainer = document.querySelector(".products");
const loadMoreButton = document.getElementById("loadMore");

let page = 1;
const itemsPerPage = 3;
let totalItems = 0;
let loadedItems = 0;
let isLoading = false;
const maxTotalItems = 12;

/**
 * Получает продукты с сервера с пагинацией.
 * @param {number} page - Номер страницы для загрузки.
 * @returns {Promise<{ products: Array<{ title: string, price: number }> }>} Объект с массивом продуктов.
 */
async function fetchProducts(page) {
    isLoading = true;
    updateLoadButton();
    const response = await fetch(
        `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${loadedItems}&select=title,price`
    );
    const data = await response.json();
    isLoading = false;
    updateLoadButton();
    return data;
}

/**
 * Загружает продукты на страницу.
 */
async function loadProducts() {
    const productsData = await fetchProducts(page);
    const products = productsData.products;
    totalItems = productsData.total;

    if (products.length === 0 || loadedItems >= maxTotalItems) {
        loadMoreButton.style.display = "none";
        return;
    }

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "product";
        productElement.textContent = product.title;
        productsContainer.appendChild(productElement);
    });

    loadedItems += products.length;

    if (loadedItems >= totalItems || loadedItems >= maxTotalItems) {
        loadMoreButton.style.display = "none";
        intersectionObserver.disconnect();
    }
}

function updateLoadButton() {
    if (isLoading) {
        loadMoreButton.textContent = "Loading...";
        loadMoreButton.disabled = true;
    } else {
        loadMoreButton.textContent = "Load More";
        loadMoreButton.disabled = false;
    }
}

/**
 * Обновляет текст загрузки и состояние отключения на основе статуса загрузки.
 */
function handleIntersection(entries) {
    const entry = entries[0];
    if (entry.isIntersecting) {
        page++;
        loadProducts();
    }
}

const intersectionObserver = new IntersectionObserver(handleIntersection);

intersectionObserver.observe(loadMoreButton);
