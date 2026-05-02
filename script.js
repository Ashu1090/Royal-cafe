// MASTER MENU DATA
const menuData = [
  { name: "Classic Tea", price: 15, category: "Tea Varieties", section: "Beverages" },
  { name: "Strong Tea", price: 20, category: "Tea Varieties", section: "Beverages" },
  { name: "Ginger Tea", price: 20, category: "Tea Varieties", section: "Beverages" },
  { name: "Cardamom Tea", price: 20, category: "Tea Varieties", section: "Beverages" },
  { name: "Special Masala Tea", price: 25, category: "Tea Varieties", section: "Beverages" },
  { name: "Filter Coffee", price: 25, category: "Coffee", section: "Beverages" },
  { name: "Black Coffee", price: 20, category: "Coffee", section: "Beverages" },
  { name: "Chocolate Shake", price: 80, category: "Milkshakes", section: "Beverages" },
  { name: "Vanilla Shake", price: 70, category: "Milkshakes", section: "Beverages" },
  { name: "Strawberry Shake", price: 80, category: "Milkshakes", section: "Beverages" },
  { name: "Oreo Shake", price: 90, category: "Milkshakes", section: "Beverages" },
  { name: "French Fries", price: 70, category: "Snacks", section: "Snacks & Desserts" },
  { name: "Peri Peri Fries", price: 80, category: "Snacks", section: "Snacks & Desserts" },
  { name: "Veg Sandwich", price: 60, category: "Sandwich", section: "Snacks & Desserts" },
  { name: "Egg Sandwich", price: 70, category: "Sandwich", section: "Snacks & Desserts" },
  { name: "Chicken Sandwich", price: 90, category: "Sandwich", section: "Snacks & Desserts" },
  { name: "Vanilla Scoop", price: 40, category: "Ice Cream", section: "Snacks & Desserts" },
  { name: "Chocolate Scoop", price: 50, category: "Ice Cream", section: "Snacks & Desserts" },
  { name: "Butterscotch", price: 50, category: "Ice Cream", section: "Snacks & Desserts" },
  { name: "Ice Cream Sundae", price: 90, category: "Ice Cream", section: "Snacks & Desserts" }
];

const categoryImages = {
  "Tea Varieties": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format",
  "Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format",
  "Milkshakes": "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=600&auto=format",
  "Snacks": "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=600&auto=format",
  "Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FuZHdpY2h8ZW58MHx8MHx8fDA%3D",
  "Ice Cream": "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=600&auto=format"
};

function getCategoryImage(category) {
  return categoryImages[category] || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format";
}

const menuContainer = document.getElementById('menuContainer');
const categorySelect = document.getElementById('categoryFilterSelect');
const searchInput = document.getElementById('searchInput');
const selectedCategorySpan = document.getElementById('selectedCategoryName');
const cartCountSpan = document.getElementById('cartCount');
const orderListContainer = document.getElementById('orderListContainer');
const openOrderPanelBtn = document.getElementById('openOrderPanelBtn');

let cart = [];

function saveCart() {
  localStorage.setItem('royalCafeCart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('royalCafeCart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountSpan.innerText = totalItems;

  if (cart.length === 0) {
    orderListContainer.innerHTML = '<div class="empty-msg">Cart is empty<br>Add delicious items!</div>';
    saveCart();
    return;
  }

  let html = '';
  let totalPrice = 0;
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    html += `
      <div class="cart-item" data-cart-index="${idx}">
        <div class="cart-item-details">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="quantity-controls">
          <button class="qty-btn minus-btn" data-name="${item.name}">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn plus-btn" data-name="${item.name}">+</button>
        </div>
      </div>
    `;
  });
  html += `<div class="total-row"><span>💰 Total Amount:</span><span>₹${totalPrice}</span></div>`;
  orderListContainer.innerHTML = html;

  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.getAttribute('data-name');
      updateQuantity(name, 1);
    });
  });
  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.getAttribute('data-name');
      updateQuantity(name, -1);
    });
  });
  saveCart();
}

function updateQuantity(itemName, delta) {
  const existing = cart.find(i => i.name === itemName);
  if (existing) {
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      cart = cart.filter(i => i.name !== itemName);
    } else {
      existing.quantity = newQty;
    }
    updateCartUI();
  }
}

function addToCart(itemName, itemPrice) {
  const existing = cart.find(i => i.name === itemName);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: itemName, price: itemPrice, quantity: 1 });
  }
  updateCartUI();
  const badge = openOrderPanelBtn;
  badge.style.transform = 'scale(1.1)';
  setTimeout(() => badge.style.transform = '', 200);
}

function renderMenu() {
  const selectedCat = categorySelect.value;
  const searchTerm = searchInput.value.toLowerCase().trim();

  let displayCat = selectedCat === 'all' ? 'All Items' : selectedCat;
  selectedCategorySpan.innerText = displayCat;

  let filteredItems = menuData.filter(item => {
    const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm);
    const matchesCategory = (selectedCat === 'all') || (item.category === selectedCat);
    return matchesSearch && matchesCategory;
  });

  let orderedItems = [...filteredItems];

  const beveragesItems = orderedItems.filter(i => i.section === 'Beverages');
  const snacksItems = orderedItems.filter(i => i.section === 'Snacks & Desserts');

  function sortBySelectedCategory(items, selectedCat) {
    if (selectedCat === 'all') return items;
    return items.sort((a, b) => {
      const aIsSelected = a.category === selectedCat;
      const bIsSelected = b.category === selectedCat;
      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;
      return 0;
    });
  }

  const sortedBev = sortBySelectedCategory(beveragesItems, selectedCat);
  const sortedSnacks = sortBySelectedCategory(snacksItems, selectedCat);

  function buildSectionHTML(items, sectionTitle, sectionIcon) {
    if (items.length === 0) return '';
    
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let html = `<div class="menu-section">
      <h2 class="section-title">${sectionIcon} ${sectionTitle}</h2>`;
    
    for (const [catName, catItems] of Object.entries(grouped)) {
      const catImage = getCategoryImage(catName);
      html += `<div class="category-group" data-category="${catName}">
        <h3>${catName}</h3>
        <img src="${catImage}" loading="lazy" class="food-image category-image" alt="${catName}">
      `;
      catItems.forEach(item => {
        html += `
          <div class="menu-item" data-name="${item.name}" data-price="${item.price}">
            <div class="item-info">
              <span class="item-name">${item.name}</span>
              <span class="price">₹${item.price}</span>
            </div>
            <button class="add-to-cart">+ Add</button>
          </div>
        `;
      });
      html += `</div>`;
    }
    html += `</div>`;
    return html;
  }

  let finalHTML = '';
  if (sortedBev.length > 0) finalHTML += buildSectionHTML(sortedBev, 'Beverages', '☕');
  if (sortedSnacks.length > 0) finalHTML += buildSectionHTML(sortedSnacks, 'Snacks & Desserts', '🍔');
  
  if (finalHTML === '') {
    finalHTML = `<div style="text-align:center; padding:40px; background:white; border-radius:25px;">🍽️ No items match your search or category. Try something else!</div>`;
  }
  
  menuContainer.innerHTML = finalHTML;
  
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.removeEventListener('click', addHandler);
    btn.addEventListener('click', addHandler);
  });
}

function addHandler(e) {
  const menuItem = this.closest('.menu-item');
  if (menuItem) {
    const name = menuItem.getAttribute('data-name');
    const price = parseInt(menuItem.getAttribute('data-price'));
    if (name && price) {
      addToCart(name, price);
    }
  }
}

function handleFilter() {
  renderMenu();
}

categorySelect.addEventListener('change', handleFilter);
searchInput.addEventListener('input', handleFilter);

const orderPanel = document.getElementById('orderPanel');
const toggleBtn = document.getElementById('toggleOrderPanel');

function togglePanel() {
  if (orderPanel.style.transform === 'scale(0.95)' || !orderPanel.style.transform) {
    orderPanel.style.transform = 'scale(1)';
    orderPanel.style.opacity = '1';
    orderPanel.style.visibility = 'visible';
    orderPanel.style.display = 'block';
  } else {
    orderPanel.style.transform = 'scale(0.95)';
    orderPanel.style.opacity = '0';
    orderPanel.style.visibility = 'hidden';
    setTimeout(() => {
      if (orderPanel.style.opacity === '0') orderPanel.style.display = 'none';
    }, 200);
  }
}

function showPanel() {
  orderPanel.style.display = 'block';
  setTimeout(() => {
    orderPanel.style.transform = 'scale(1)';
    orderPanel.style.opacity = '1';
    orderPanel.style.visibility = 'visible';
  }, 10);
}

toggleBtn.addEventListener('click', togglePanel);
openOrderPanelBtn.addEventListener('click', (e) => { e.preventDefault(); showPanel(); });

orderPanel.style.transform = 'scale(0.95)';
orderPanel.style.opacity = '0';
orderPanel.style.visibility = 'hidden';
orderPanel.style.display = 'none';
orderPanel.style.transition = '0.2s ease';

document.addEventListener('mousemove', (e) => {
  const sections = document.querySelectorAll('.menu-section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      section.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.95), rgba(255,255,255,0.65))`;
    } else {
      section.style.background = "rgba(255,255,255,0.7)";
    }
  });
});

const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) topBtn.classList.add("show");
  else topBtn.classList.remove("show");
});
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

loadCart();
renderMenu();
updateCartUI();