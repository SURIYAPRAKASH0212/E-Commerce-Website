// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Cart Functionality
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  if (cartItemsContainer && cartTotalContainer) {
    loadCart();
  }

  // Account Page Toggle
  const LoginForm = document.getElementById("LoginForm");
  const RegForm = document.getElementById("RegForm");
  const Indicator = document.getElementById("Indicator");
  const loginBtn = document.getElementById("loginBtn");
  const regBtn = document.getElementById("regBtn");

  if (LoginForm && RegForm && Indicator) {
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        RegForm.style.transform = "translateX(300px)";
        LoginForm.style.transform = "translateX(300px)";
        Indicator.style.transform = "translateX(0px)";
      });
    }

    if (regBtn) {
      regBtn.addEventListener('click', () => {
        RegForm.style.transform = "translateX(0px)";
        LoginForm.style.transform = "translateX(0px)";
        Indicator.style.transform = "translateX(100px)";
      });
    }
  }
});

// Add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}

// Show cart items on cart.html
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDiv = document.getElementById("cart-total");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerHTML = "";
    return;
  }

  cart.forEach((item) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
      </div>
    `;
    container.appendChild(div);
  });

  totalDiv.innerHTML = `<h3>Total: ₹${total}</h3>
  <button class="btn">Proceed to Checkout</button>`;
}

// Menu Toggle
function menutoggle() {
  const menuItems = document.getElementById("MenuItems");
  if (menuItems) {
    if (menuItems.style.maxHeight == "0px" || menuItems.style.maxHeight === "") {
      menuItems.style.maxHeight = "200px";
    } else {
      menuItems.style.maxHeight = "0px";
    }
  }
}
