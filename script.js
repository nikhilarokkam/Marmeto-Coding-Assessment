console.log('====================================');
console.log("Connected");
console.log('====================================');

const productContainer = document.getElementById('productContainer');

async function fetchProducts(category) {
    try {
        const response = await fetch(`https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json`);
        const data = await response.json();

        console.log('API Response:', data);

        const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
        const products = categoryData ? categoryData.category_products : [];
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

const defaultImageURL = "https://assets.ajio.com/medias/sys_master/root/20230516/0K5j/6463b90442f9e729d78dae21/-473Wx593H-469447195-green-MODEL3.jpg"; // Example placeholder image URL

function displayProducts(products) {
    if (!products || products.length === 0) {
        console.error('No products available.');
        return;
    }

    productContainer.innerHTML = '';

    products.forEach(product => {
        const discountPercentage = calculateDiscountPercentage(product.price, product.compare_at_price);

        const productImage = product.image ? `<img src="${product.image}" alt="${product.title}">` : `<img src="${defaultImageURL}" alt="Default Image">`;

        const badgeContainer = product.badge_text ? `<div class="badge-container"><div class="badge">${product.badge_text}</div></div>` : '';

        const productCard = `
            <div class="product-card">
                ${productImage}
                ${badgeContainer}
                <h3>${product.title}</h3>
                <div class="vendor-price">
                    <p><strong>${product.vendor}</strong></p>
                    <p class="discount-percentage">${discountPercentage}% off</p>
                </div>
                <div class="discount-compare">
                    <p>Price: <strong>Rs. ${product.price}</strong></p>
                    <p><span class="compare-price">Rs. ${product.compare_at_price}</span></p>
                </div>
                <button class="add-to-cart-button">Add to Cart</button>
            </div>
        `;

        productContainer.innerHTML += productCard;
    });
}



showProducts("Women");

function calculateDiscountPercentage(price, compareAtPrice) {
    if (!compareAtPrice || compareAtPrice <= price) {
        return 0;
    }
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(discount);
}

function showProducts(category) {
    fetchProducts(category);
    const tabButtons = document.querySelectorAll('.tabs button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.tabs button[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}
