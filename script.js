// script.js

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
