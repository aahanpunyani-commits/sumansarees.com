// Data: example products
const PRODUCTS = [
  {
    id: 1,
    title: "Kanjivaram Silk — Crimson Gold",
    fabric: "Silk",
    occasion: "Wedding",
    price: 18999,
    color: "Red",
    image: "https://images.unsplash.com/photo-1520975922305-8d62b8390b91?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Chanderi Handloom — Ivory Whisper",
    fabric: "Linen",
    occasion: "Handloom",
    price: 7999,
    color: "Ivory",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231655?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Banarasi Silk — Emerald Weave",
    fabric: "Silk",
    occasion: "Festive",
    price: 13999,
    color: "Green",
    image: "https://images.unsplash.com/photo-1617195734771-f50a33a1c678?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Georgette — Midnight Sequins",
    fabric: "Georgette",
    occasion: "Party",
    price: 5999,
    color: "Black",
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Cotton — Summer Breeze",
    fabric: "Cotton",
    occasion: "Casual",
    price: 2499,
    color: "Blue",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Tussar Silk — Sand Dune",
    fabric: "Silk",
    occasion: "Festive",
    price: 8999,
    color: "Beige",
    image: "https://images.unsplash.com/photo-1555529771-35a38b572b0e?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Organzas — Rosé Glow",
    fabric: "Georgette",
    occasion: "Party",
    price: 7499,
    color: "Pink",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Handloom Cotton — Indigo Block",
    fabric: "Cotton",
    occasion: "Handloom",
    price: 4999,
    color: "Indigo",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Soft Silk — Sunrise Ember",
    fabric: "Silk",
    occasion: "Wedding",
    price: 15999,
    color: "Orange",
    image: "https://images.unsplash.com/photo-1540573130331-62b2a012fa6c?q=80&w=1400&auto=format&fit=crop"
  }
];

const state = {
  fabric: "All",
  occasion: "All",
  price: "All",
  search: "",
  cart: []
};

const els = {
  productsGrid: document.getElementById("productsGrid"),
  fabricFilter: document.getElementById("fabricFilter"),
  occasionFilter: document.getElementById("occasionFilter"),
  priceFilter: document.getElementById("priceFilter"),
  searchInput: document.getElementById("searchInput"),
  clearFilters: document.getElementById("clearFilters"),
  cartBtn: document.getElementById("cartBtn"),
  cartDrawer: document.getElementById("cartDrawer"),
  closeCart: document.getElementById("closeCart"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartCount: document.getElementById("cartCount"),
  year: document.getElementById("year"),
  newsletterBtn: document.getElementById("newsletterBtn"),
  newsletterEmail: document.getElementById("newsletterEmail"),
  newsletterStatus: document.getElementById("newsletterStatus"),
  contactForm: document.getElementById("contactForm"),
  formStatus: document.getElementById("formStatus"),
  hamburger: document.getElementById("hamburger"),
  navLinks: document.querySelector(".nav-links")
};

// Render products
function renderProducts() {
  const filtered = PRODUCTS.filter(p => {
    const fabricOk = state.fabric === "All" || p.fabric === state.fabric;
    const occasionOk = state.occasion === "All" || p.occasion === state.occasion;
    const priceOk = (() => {
      if (state.price === "All") return true;
      const [min, max] = state.price.split("-").map(Number);
      return p.price >= min && p.price <= max;
    })();
    const searchOk = state.search.trim() === "" || (
      (p.title + " " + p.color + " " + p.fabric + " " + p.occasion)
        .toLowerCase().includes(state.search.toLowerCase())
    );
    return fabricOk && occasionOk && priceOk && searchOk;
  });

  els.productsGrid.innerHTML = filtered.map(p => productCardHTML(p)).join("") || "<p>No products match your filters.</p>";
  // attach add-to-cart listeners
  filtered.forEach(p => {
    const btn = document.querySelector(`button[data-add="${p.id}"]`);
    btn?.addEventListener("click", () => addToCart(p));
  });
}

function productCardHTML(p) {
  return `
    <div class="product-card">
      <div class="product-card__img" style="background-image:url('${p.image}');"></div>
      <div class="product-card__body">
        <div class="product-card__title">${p.title}</div>
        <div class="product-card__meta">${p.fabric} • ${p.occasion} • ${p.color}</div>
        <div class="product-card__price">₹${p.price.toLocaleString()}</div>
        <div class="product-card__actions">
          <button class="btn btn-outline" data-add="${p.id}">Add to cart</button>
          <button class="btn btn-light">View</button>
        </div>
      </div>
    </div>
  `;
}

// Cart logic
function addToCart(p) {
  const existing = state.cart.find(i => i.id === p.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
  updateCartUI();
}

function updateCartUI() {
  els.cartCount.textContent = state.cart.reduce((sum, i) => sum + i.qty, 0);
  els.cartItems.innerHTML = state.cart.length
    ? state.cart.map(i => `
      <div class="row" style="display:flex;justify-content:space-between;align-items:center;border:1px solid #eee;border-radius:8px;padding:10px">
        <div>
          <div style="font-weight:700">${i.title}</div>
          <div style="color:#6a6a6a">Qty: ${i.qty}</div>
        </div>
        <div>
          <div>₹${(i.price * i.qty).toLocaleString()}</div>
          <button class="btn btn-light" data-dec="${i.id}">-</button>
          <button class="btn btn-light" data-inc="${i.id}">+</button>
          <button class="btn btn-outline" data-rem="${i.id}">Remove</button>
        </div>
      </div>
    `).join("")
    : "<p>Your cart is empty.</p>";

  const total = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  els.cartTotal.textContent = total.toLocaleString();

  // listeners for cart item updates
  state.cart.forEach(i => {
    document.querySelector(`button[data-inc="${i.id}"]`)?.addEventListener("click", () => { i.qty += 1; updateCartUI(); });
    document.querySelector(`button[data-dec="${i.id}"]`)?.addEventListener("click", () => { i.qty = Math.max(1, i.qty - 1); updateCartUI(); });
    document.querySelector(`button[data-rem="${i.id}"]`)?.addEventListener("click", () => {
      state.cart = state.cart.filter(x => x.id !== i.id);
      updateCartUI();
    });
  });
}

// Filters handlers
els.fabricFilter.addEventListener("change", e => { state.fabric = e.target.value; renderProducts(); });
els.occasionFilter.addEventListener("change", e => { state.occasion = e.target.value; renderProducts(); });
els.priceFilter.addEventListener("change", e => { state.price = e.target.value; renderProducts(); });
els.searchInput.addEventListener("input", e => { state.search = e.target.value; renderProducts(); });
els.clearFilters.addEventListener("click", () => {
  state.fabric = "All"; state.occasion = "All"; state.price = "All"; state.search = "";
  els.fabricFilter.value = "All"; els.occasionFilter.value = "All"; els.priceFilter.value = "All"; els.searchInput.value = "";
  renderProducts();
});

// Collections quick-filter
document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => {
    const val = card.getAttribute("data-filter");
    els.occasionFilter.value = val;
    state.occasion = val;
    renderProducts();
    window.location.hash = "#shop";
  });
});

// Cart drawer
els.cartBtn.addEventListener("click", () => { els.cartDrawer.setAttribute("aria-hidden", "false"); });
els.closeCart.addEventListener("click", () => { els.cartDrawer.setAttribute("aria-hidden", "true"); });
els.cartDrawer.querySelector(".cart-drawer__backdrop").addEventListener("click", () => { els.cartDrawer.setAttribute("aria-hidden", "true"); });

// Footer year
els.year.textContent = new Date().getFullYear();

// Newsletter
els.newsletterBtn.addEventListener("click", () => {
  const email = els.newsletterEmail.value.trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    els.newsletterStatus.textContent = "Please enter a valid email.";
    els.newsletterStatus.style.color = "#ff5959";
    return;
  }
  els.newsletterStatus.textContent = "Thanks for subscribing!";
  els.newsletterStatus.style.color = "var(--gold)";
  els.newsletterEmail.value = "";
});

// Contact form validation (front-end demo)
els.contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  let ok = true;
  ok &= setError(name, name.value.trim() ? "" : "Name is required");
  ok &= setError(email, /^\S+@\S+\.\S+$/.test(email.value) ? "" : "Enter a valid email");
  ok &= setError(message, message.value.trim() ? "" : "Message is required");

  if (ok) {
    els.formStatus.textContent = "Message sent! We'll get back to you soon.";
    e.target.reset();
    setTimeout(() => els.formStatus.textContent = "", 4000);
  }
});

function setError(input, msg){
  const el = document.querySelector(`[data-error-for="${input.id}"]`);
  el.textContent = msg || "";
  return !msg;
}

// Mobile nav
els.hamburger.addEventListener("click", () => {
  const isOpen = getComputedStyle(els.navLinks).display !== "none";
  els.navLinks.style.display = isOpen ? "none" : "flex";
});

// Initial render
renderProducts();
updateCartUI();