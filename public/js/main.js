// App State
let cart = JSON.parse(localStorage.getItem('threadora_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('threadora_favorites')) || [];

function updateCounts() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    document.querySelectorAll('#fav-count').forEach(el => {
        el.textContent = favorites.length;
    });
}

function saveCart() {
    localStorage.setItem('threadora_cart', JSON.stringify(cart));
    updateCounts();
}

function saveFavorites() {
    localStorage.setItem('threadora_favorites', JSON.stringify(favorites));
    updateCounts();
}

// Cart Logic
function addToCart(product) {
    // If the product has a size, consider it a separate cart item from the same product with a different size
    const existing = cart.find(item => item.id === product.id && item.size === product.size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    
    // Simple visual feedback
    const btn = document.getElementById('add-to-cart-btn');
    if(btn) {
        const ogText = btn.textContent;
        btn.textContent = 'ADDED!';
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.textContent = ogText;
            btn.classList.remove('btn-success');
        }, 1500);
    }
}

// Favorites Logic
window.toggleFavorite = async function(id, event) {
    if(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    id = Number(id);
    const index = favorites.findIndex(f => f.id === id);
    const btns = document.querySelectorAll(`.btn-fav[data-id="${id}"]`);

    if (index > -1) {
        favorites.splice(index, 1);
        btns.forEach(btn => btn.classList.remove('active'));
    } else {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            const product = products.find(p => p.id === id);
            if(product) {
                favorites.push(product);
                btns.forEach(btn => btn.classList.add('active'));
            }
        } catch(e) {
            console.error("Failed to add favorite", e);
        }
    }
    saveFavorites();
    if (window.renderFavorites && document.getElementById('favorites-grid')) {
        renderFavorites();
    }
};

window.renderFavorites = function() {
    const grid = document.getElementById('favorites-grid');
    if(!grid) return;
    
    if (favorites.length === 0) {
        grid.innerHTML = `
            <div class="empty-cart-message" style="grid-column: 1/-1;">
                <h3>No favorites yet</h3>
                <p>Click the heart icon on products to save them for later.</p>
                <a href="/home.html#products" class="btn btn-primary">Discover Products</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = favorites.map(p => `
        <div class="product-card">
            <div class="product-image">
                <img src="/${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <p class="category">${p.category}</p>
                <h3>${p.name}</h3>
                <p class="price">$${p.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick='window.location.href="/product.html?id=${p.id}"'>VIEW DETAILS</button>
                    <button class="btn-fav active" data-id="${p.id}" onclick="window.toggleFavorite(${p.id}, event)">❤</button>
                </div>
            </div>
        </div>
    `).join('');
};

// Fetch Products (Home)
async function fetchProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        
        grid.innerHTML = products.map(p => {
            const isFav = favorites.some(f => f.id === p.id);
            return `
            <div class="product-card">
                <div class="product-image">
                    <img src="/${p.image}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <p class="category">${p.category}</p>
                    <h3>${p.name}</h3>
                    <p class="price">$${p.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick='window.location.href="/product.html?id=${p.id}"'>VIEW DETAILS</button>
                        <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${p.id}" onclick="window.toggleFavorite(${p.id}, event)">❤</button>
                    </div>
                </div>
            </div>
        `}).join('');
    } catch (e) {
        grid.innerHTML = '<p>Failed to load products. Server might be down.</p>';
    }
}

// Fetch Product Details (Product page)
async function loadProductDetails(id) {
    const container = document.getElementById('product-detail-container');
    if (!container) return;
    try {
        id = Number(id);
        const res = await fetch('/api/products');
        const products = await res.json();
        const product = products.find(p => p.id === id);
        if (!product) {
            container.innerHTML = '<p>Product not found.</p>';
            return;
        }

        const isFav = favorites.some(f => f.id === id);

        // Determine if product needs a size selector
        const isClothing = ['Men', 'Women', 'Unisex'].includes(product.category);
        const isFootwear = product.category === 'Footwear';
        
        let sizeOptionsHTML = '';
        if (isClothing) {
            sizeOptionsHTML = `
                <div class="size-selector">
                    <label for="product-size">Select Size:</label>
                    <select id="product-size" class="input-field size-dropdown">
                        <option value="S">Small (S)</option>
                        <option value="M" selected>Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                    </select>
                </div>
            `;
        } else if (isFootwear) {
            sizeOptionsHTML = `
                <div class="size-selector">
                    <label for="product-size">Select Size:</label>
                    <select id="product-size" class="input-field size-dropdown">
                        <option value="US 7">US 7</option>
                        <option value="US 8" selected>US 8</option>
                        <option value="US 9">US 9</option>
                        <option value="US 10">US 10</option>
                        <option value="US 11">US 11</option>
                    </select>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="product-detail-layout">
                <div class="product-detail-image">
                    <img src="/${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <p class="category">${product.category}</p>
                    <h2>${product.name}</h2>
                    <p class="price large-price">$${product.price.toFixed(2)}</p>
                    <p class="description">Experience unparalleled comfort and standout design with Threadora's premium collection. Crafted from high-quality materials to elevate your everyday style seamlessly.</p>
                    ${sizeOptionsHTML}
                    <div class="product-actions" style="margin-top:2rem;">
                        <button id="add-to-cart-btn" class="btn btn-primary btn-large" style="flex-grow:1;">ADD TO CART</button>
                        <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${product.id}" onclick="window.toggleFavorite(${product.id}, event)" style="width:60px; height:60px; flex-shrink:0; font-size:1.5rem;">❤</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            const sizeEl = document.getElementById('product-size');
            const size = sizeEl ? sizeEl.value : null;
            addToCart({ ...product, size });
        });

    } catch (e) {
        container.innerHTML = '<p>Failed to load product details.</p>';
        console.error(e);
    }
}

// Render Cart (Cart page)
window.renderCart = function() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="/home.html#products" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        summary.classList.add('hide');
        return;
    }

    summary.classList.remove('hide');

    container.innerHTML = cart.map((item, index) => {
        const sizeInfo = item.size ? `<p class="item-size">Size: <strong>${item.size}</strong></p>` : '';
        return `
        <div class="cart-item">
            <img src="/${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="category">${item.category}</p>
                ${sizeInfo}
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
    `}).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`; // Free shipping
};

window.updateQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeItem(index);
    } else {
        saveCart();
        renderCart();
    }
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
};

window.checkout = async function() {
    const btn = document.getElementById('checkout-btn');
    const msg = document.getElementById('checkout-message');
    
    if(!btn) return;

    btn.disabled = true;
    btn.textContent = 'Processing...';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const userEmail = localStorage.getItem('threadora_current_user') || 'guest';

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart, total, email: userEmail })
        });
        const data = await res.json();

        if (res.ok) {
            cart = [];
            saveCart();
            const container = document.getElementById('cart-items');
            if(container) container.innerHTML = '';
            document.getElementById('cart-summary').classList.add('hide');
            msg.innerHTML = `
                <div class="success-message">
                    <h3>Order Successful!</h3>
                    <p>Your Order ID is: <strong class="order-id-highlight">${data.orderId}</strong></p>
                    <p>You can track your order status on the Track Order page.</p>
                    <a href="/tracking.html" class="btn btn-outline" style="margin-top: 1rem;">Track Order</a>
                </div>
            `;
            msg.classList.remove('hide');
        } else {
            alert('Checkout failed: ' + data.error);
            btn.disabled = false;
            btn.textContent = 'PROCEED TO CHECKOUT';
        }
    } catch (e) {
        alert('Checkout error. Please make sure the server is running.');
        btn.disabled = false;
        btn.textContent = 'PROCEED TO CHECKOUT';
    }
};

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateCounts();
});
