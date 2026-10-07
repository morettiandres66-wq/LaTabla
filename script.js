const cart = [];

const cartOverlay = document.getElementById("cartOverlay");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const orderSummary = document.getElementById("orderSummary");

const money = value => "$" + value.toLocaleString("es-AR");

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  renderCart();
  openCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🧀</span>
        <p>Tu carrito está vacío.</p>
        <button class="text-link" id="startShopping">Elegir una tabla →</button>
      </div>`;
    document.getElementById("startShopping").addEventListener("click", closeCart);
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <small>${money(item.price)} c/u</small>
          <div class="cart-item-controls">
            <button class="qty-button" data-action="decrease" data-index="${index}">−</button>
            <span>${item.quantity}</span>
            <button class="qty-button" data-action="increase" data-index="${index}">+</button>
            <button class="remove-item" data-action="remove" data-index="${index}">Eliminar</button>
          </div>
        </div>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
    `).join("");
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  checkoutButton.disabled = cart.length === 0;
}

function openCart() {
  cartOverlay.classList.add("open");
  cartOverlay.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartOverlay.classList.remove("open");
  cartOverlay.setAttribute("aria-hidden", "true");
}

function openCheckout() {
  if (!cart.length) return;
  closeCart();

  orderSummary.innerHTML = `
    ${cart.map(item => `
      <div class="summary-line">
        <span>${item.quantity} × ${item.name}</span>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
    `).join("")}
    <hr>
    <div class="summary-line">
      <strong>Total</strong>
      <strong>${cartTotal.textContent}</strong>
    </div>
  `;

  checkoutOverlay.classList.add("open");
  checkoutOverlay.setAttribute("aria-hidden", "false");
}

document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));
  });
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", () => {
  checkoutOverlay.classList.remove("open");
  checkoutOverlay.setAttribute("aria-hidden", "true");
});

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) closeCart();
});

checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) {
    checkoutOverlay.classList.remove("open");
    checkoutOverlay.setAttribute("aria-hidden", "true");
  }
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "increase") cart[index].quantity++;
  if (action === "decrease") {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
  }
  if (action === "remove") cart.splice(index, 1);

  renderCart();
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("buyerName").value.trim();
  if (!name) return;

  event.target.hidden = true;
  document.querySelector(".checkout-modal > h2").hidden = true;
  document.querySelector(".checkout-modal > .eyebrow").hidden = true;
  document.getElementById("successMessage").hidden = false;

  cart.length = 0;
  renderCart();
});

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  document.getElementById("contactMessage").textContent =
    `Gracias${name ? ", " + name : ""}. Esta demo recibió tu consulta correctamente.`;
  event.target.reset();
});

renderCart();
