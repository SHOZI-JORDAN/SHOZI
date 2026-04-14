let products = [
    { id: 1, name: "Nike Air Force 1", category: "nike", price: 120, img: "https://source.unsplash.com/random/300x300/?nike" },
    { id: 2, name: "Adidas Ultraboost", category: "adidas", price: 150, img: "https://source.unsplash.com/random/300x300/?adidas" },
    { id: 3, name: "Puma RS-X", category: "puma", price: 95, img: "https://source.unsplash.com/random/300x300/?puma" },
    { id: 4, name: "Nike Dunk Low", category: "nike", price: 110, img: "https://source.unsplash.com/random/300x300/?nike-shoes" },
    { id: 5, name: "Adidas Samba", category: "adidas", price: 85, img: "https://source.unsplash.com/random/300x300/?adidas" },
    { id: 6, name: "Puma Suede Classic", category: "puma", price: 75, img: "https://source.unsplash.com/random/300x300/?puma" }
];

let cart = [];

function renderProducts(filteredProducts) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${product.price} دينار</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">أضف إلى السلة</button>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat) {
    if (cat === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
    alert(`تم إضافة ${product.name} إلى السلة`);
}

function updateCart() {
    document.getElementById('cart-count').textContent = cart.length;
    const cartSection = document.getElementById('cart-section');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartSection.style.display = 'none';
        return;
    }

    cartSection.style.display = 'block';
    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price} دينار</span>
        `;
        itemsContainer.appendChild(div);
    });

    totalEl.textContent = total;
}

function checkout() {
    if (cart.length === 0) return;
    alert('شكراً لك! هذا متجر عرضي. في النسخة الحقيقية سيتم الدفع هنا.');
    // يمكنك هنا إضافة نموذج تواصل أو WhatsApp
    cart = [];
    updateCart();
}

// تحميل المنتجات عند فتح الصفحة
window.onload = () => {
    renderProducts(products);
};