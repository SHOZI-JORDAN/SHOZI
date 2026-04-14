let products = [
    { id: 1, name: "Nike Air Force 1", category: "nike", price: 120, img: "https://source.unsplash.com/random/300x300/?nike" },
    { id: 2, name: "Adidas Ultraboost", category: "adidas", price: 150, img: "https://source.unsplash.com/random/300x300/?adidas" },
    { id: 3, name: "Puma RS-X", category: "puma", price: 95, img: "https://source.unsplash.com/random/300x300/?puma" },
    { id: 4, name: "Nike Dunk Low", category: "nike", price: 110, img: "https://source.unsplash.com/random/300x300/?nike-shoes" },
    { id: 5, name: "Adidas Samba", category: "adidas", price: 85, img: "https://source.unsplash.com/random/300x300/?adidas" },
    { id: 6, name: "Puma Suede Classic", category: "puma", price: 75, img: "https://source.unsplash.com/random/300x300/?puma" },
    { id: 7, name: "New Balance 550", category: "nike", price: 130, img: "https://source.unsplash.com/random/300x300/?newbalance" } // مثال إضافي
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

function renderProducts(filteredProducts) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" onclick="showProduct(${product.id})">
            <h3>${product.name}</h3>
            <div class="price">${product.price} دينار</div>
            <button class="add-to-cart" onclick="addToCart(${product.id}); event.stopImmediatePropagation();">أضف إلى السلة</button>
        `;
        container.appendChild(card);
    });
}

function showProduct(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    
    document.getElementById('modal-image').src = currentProduct.img;
    document.getElementById('modal-name').textContent = currentProduct.name;
    document.getElementById('modal-price').textContent = currentProduct.price + " دينار";
    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function addCurrentToCart() {
    if (currentProduct) addToCart(currentProduct.id);
    closeModal();
}

function filterCategory(cat) {
    if (cat === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.category === cat));
}

function searchProducts() {
    const term = document.getElementById('search').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    alert(`✅ تم إضافة ${product.name} إلى السلة`);
}

function updateCart() {
    document.getElementById('cart-count').textContent = cart.length;
}

function showCart() {
    const section = document.getElementById('cart-section');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        alert("السلة فارغة");
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            ${item.name} - ${item.price} دينار
            <button onclick="removeFromCart(${index})" style="background:red;color:white;border:none;padding:5px 10px;">حذف</button>
        `;
        itemsContainer.appendChild(div);
    });
    totalEl.textContent = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    updateCart();
}

function clearCart() {
    if (confirm("هل تريد تفريغ السلة؟")) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
        updateCart();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    // جلب معلومات العميل
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !phone || !address) {
        alert("يرجى ملء جميع معلوماتك (الاسم، الجوال، العنوان)");
        return;
    }

    // جلب طريقة الدفع
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentText = (paymentMethod === 'cash') ? 'نقداً عند الاستلام' : 'فيزا / بطاقة ائتمان';

    // بناء رسالة الواتساب
    let message = `مرحبا، أريد إتمام الطلب التالي:\n\n`;
    message += `👤 الاسم: ${name}\n`;
    message += `📱 الجوال: ${phone}\n`;
    message += `📍 العنوان: ${address}\n\n`;
    message += `🛒 المنتجات:\n`;

    let total = 0;
    cart.forEach(item => {
        message += `- ${item.name} (${item.price} دينار)\n`;
        total += item.price;
    });

    message += `\n💰 المجموع: ${total} دينار\n`;
    message += `💳 طريقة الدفع: ${paymentText}\n\n`;
    message += `يرجى تأكيد الطلب وإخباري بموعد التسليم. شكراً!`;

    // رابط الواتساب (غيّر الرقم إلى رقمك)
    const whatsappUrl = `https://wa.me/962788673914?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    // رسالة تأكيد + تفريغ السلة
    setTimeout(() => {
        alert(`✅ تم إرسال الطلب إلى واتساب!\n\nسأقوم بتأكيد الطلب يدوياً وأتواصل معك قريباً.`);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        document.getElementById('cart-section').style.display = 'none';
        updateCart();
    }, 800);
}}

// تحميل عند فتح الصفحة
window.onload = () => {
    renderProducts(products);
    updateCart();
};