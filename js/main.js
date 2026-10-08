/* ===== URBANNEX shared UI ===== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "Rs. " + n.toLocaleString("en-US");
const find = id => PRODUCTS.find(p => p.id === +id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };
const stars = r => [1,2,3,4,5].map(i => `<i class="bi bi-star${r >= i ? "-fill" : r >= i - .5 ? "-half" : ""}"></i>`).join("");
function toast(msg) {
  let w = $("#toasts"); if (!w) { w = document.createElement("div"); w.id = "toasts"; w.setAttribute("aria-live", "polite"); document.body.append(w); }
  const t = document.createElement("div"); t.className = "toast-u"; t.textContent = msg; w.append(t);
  setTimeout(() => t.classList.add("out"), 2400); setTimeout(() => t.remove(), 2800);
}
const wl = () => store.get("urb_wishlist", []);
function toggleWish(id) {
  let l = wl(); const on = !l.includes(id); l = on ? [...l, id] : l.filter(x => x !== id); store.set("urb_wishlist", l);
  $$(`[data-wish="${id}"]`).forEach(b => { b.classList.toggle("on", on); b.innerHTML = `<i class="bi bi-heart${on ? "-fill" : ""}"></i>`; });
  wishCount(); toast(on ? "Added to wishlist" : "Removed from wishlist");
  if (typeof onWishChange === "function") onWishChange();
}
const wishCount = () => $$(".wl-count").forEach(e => { e.textContent = wl().length; e.hidden = !wl().length; });
function openWA(text) { window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener"); }
function orderWA(p, o = {}) {
  const url = new URL(p.url, location.href).href;
  const lines = ["Hello URBANNEX 👋", "I would like to order this product:", `Product: ${p.name}`, `Price: ${money(p.price)}`];
  if (o.color) lines.push(`Color: ${o.color}`); if (o.size) lines.push(`Size: ${o.size}`);
  lines.push(`Quantity: ${o.qty || 1}`, `Product link: ${url}`, "Please provide me with availability and delivery details.", "Thank you.");
  openWA(lines.join("\n"));
}
function card(p) {
  const on = wl().includes(p.id), stock = p.stock === 0 ? `<span class="stock out">Out of stock</span>` : p.stock < 10 ? `<span class="stock low">Only ${p.stock} left</span>` : `<span class="stock">In stock</span>`;
  return `<div class="col-6 col-md-4 col-lg-3"><article class="pcard reveal"><div class="pimg"><a href="${p.url}" tabindex="-1"><img loading="lazy" width="400" height="400" src="${p.image}" alt="${p.name}"></a>
  <span class="badge-d">-${p.discount}%</span>${p.badge ? `<span class="badge-n">${p.badge}</span>` : ""}
  <button class="wish ${on ? "on" : ""}" data-wish="${p.id}" aria-label="Toggle wishlist for ${p.name}"><i class="bi bi-heart${on ? "-fill" : ""}"></i></button>
  <button class="qv" data-qv="${p.id}">Quick View</button></div>
  <div class="pbody"><small class="cat">${p.category}</small><h3><a href="${p.url}">${p.name}</a></h3>
  <div class="rate">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
  <div class="price"><b>${money(p.price)}</b> <del>${money(p.oldPrice)}</del></div>${stock}
  <button class="wa" data-wa="${p.id}"><i class="bi bi-whatsapp"></i> Order on WhatsApp</button></div></article></div>`;
}
const renderGrid = (sel, list) => { const g = $(sel); if (g) { g.innerHTML = list.map(card).join(""); reveal(); } };
function quickView(id) {
  const p = find(id); let m = $("#qvModal");
  if (!m) { document.body.insertAdjacentHTML("beforeend", `<div class="modal fade" id="qvModal" tabindex="-1" aria-labelledby="qvTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><button class="btn-close m-3 position-absolute end-0" style="z-index:2" data-bs-dismiss="modal" aria-label="Close"></button><div class="modal-body p-3 p-md-4"></div></div></div></div>`); m = $("#qvModal"); }
  $(".modal-body", m).innerHTML = `<div class="row g-4 align-items-center"><div class="col-md-6"><img class="w-100 rounded-3" src="${p.image}" alt="${p.name}"></div><div class="col-md-6"><small class="cat">${p.category}</small><h2 id="qvTitle" class="h4 fw-bold">${p.name}</h2><div class="rate">${stars(p.rating)} <span>${p.rating}</span></div>
  <div class="price my-2"><b>${money(p.price)}</b> <del>${money(p.oldPrice)}</del></div><p class="text-muted small">${p.description}</p>
  <label class="small fw-semibold">Quantity <input id="qvQty" type="number" min="1" max="10" value="1" class="form-control form-control-sm d-inline-block ms-2" style="width:80px"></label>
  <div class="d-grid gap-2 mt-3"><button class="wa" id="qvWa"><i class="bi bi-whatsapp"></i> Order on WhatsApp</button><a class="btn btn-outline-dark" href="${p.url}">View Details</a></div></div></div>`;
  $("#qvWa").onclick = () => orderWA(p, { qty: Math.max(1, +$("#qvQty").value || 1), color: p.colors[0], size: p.sizes[0] });
  bootstrap.Modal.getOrCreateInstance(m).show();
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-wish],[data-qv],[data-wa]"); if (!t) return;
  if (t.dataset.wish) toggleWish(+t.dataset.wish);
  else if (t.dataset.qv) quickView(t.dataset.qv);
  else if (t.dataset.wa) { const p = find(t.dataset.wa); if (!reduce && window.gsap) gsap.fromTo(t, { scale: .94 }, { scale: 1, duration: .35, ease: "back.out(3)" }); orderWA(p, { color: p.colors[0], size: p.sizes[0] }); }
});
function layout() {
  const links = [["Home","index.html"],["Shop","shop.html"],["Categories","index.html#categories"],["New Arrivals","index.html#new"],["Deals","index.html#deals"],["About","index.html#about"],["Contact","#contact"]];
  const here = location.pathname.split("/").pop() || "index.html";
  $("#hdr").innerHTML = `<nav class="navbar navbar-expand-lg unav" id="nav"><div class="container"><a class="navbar-brand" href="index.html">URBAN<span>NEX</span></a>
  <div class="d-flex align-items-center gap-1 order-lg-3"><a class="ibtn" href="shop.html?focus=1" aria-label="Search"><i class="bi bi-search"></i></a><a class="ibtn position-relative" href="shop.html?wish=1" aria-label="Wishlist"><i class="bi bi-heart"></i><span class="wl-count" hidden>0</span></a>
  <a class="ibtn d-none d-sm-inline-flex" href="#contact" aria-label="Account"><i class="bi bi-person"></i></a>
  <button class="navbar-toggler ms-1" data-bs-toggle="collapse" data-bs-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle menu"><i class="bi bi-list fs-2"></i></button></div>
  <div class="collapse navbar-collapse justify-content-center" id="menu"><ul class="navbar-nav">${links.map(([n, h]) => `<li class="nav-item"><a class="nav-link ${h === here ? "active" : ""}" href="${h}">${n}</a></li>`).join("")}</ul></div></div></nav>`;
  $("#ftr").innerHTML = `<footer class="ufoot" id="contact"><div class="container"><div class="row g-4"><div class="col-lg-4"><div class="navbar-brand text-white">URBAN<span>NEX</span></div><p class="mt-2">Modern Essentials. Everyday Style.</p><p class="small">hello@urbannex.com · +92 300 0000000 · Karachi, Pakistan</p>
  <form id="news" class="d-flex gap-2"><label class="visually-hidden" for="nm">Email</label><input id="nm" type="email" required class="form-control" placeholder="Your email"><button class="btn btn-gold">Join</button></form></div>
  <div class="col-6 col-lg-2"><h4>Shop</h4><a href="shop.html">All Products</a><a href="index.html#new">New Arrivals</a><a href="index.html#deals">Deals</a></div>
  <div class="col-6 col-lg-2"><h4>Customer Care</h4><a href="#" data-chat>Contact Us</a><a href="#" data-chat>Shipping</a><a href="#" data-chat>Returns</a></div>
  <div class="col-6 col-lg-2"><h4>Company</h4><a href="index.html#about">About</a><a href="#">Privacy Policy</a><a href="#">Terms</a></div>
  <div class="col-6 col-lg-2"><h4>Follow</h4><span class="soc"><i class="bi bi-instagram"></i><i class="bi bi-facebook"></i><i class="bi bi-tiktok"></i></span></div></div>
  <p class="copy">© 2026 URBANNEX. All Rights Reserved.</p></div></footer>
  <button class="wa-float" data-chat><i class="bi bi-whatsapp"></i><span>Chat with us</span></button>`;
  $$("[data-chat]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openWA("Hello URBANNEX 👋 I need help with a product."); }));
  $("#news").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Thanks for subscribing!"); });
  const onScroll = () => $("#nav").classList.toggle("scrolled", scrollY > 20); onScroll(); addEventListener("scroll", onScroll, { passive: true });
  wishCount();
}
function reveal() {
  if (reduce || !window.gsap) return; gsap.registerPlugin(ScrollTrigger);
  const els = $$(".reveal:not(.r)"); els.forEach(e => e.classList.add("r")); if (!els.length) return;
  gsap.set(els, { opacity: 0, y: 28 });
  ScrollTrigger.batch(els, { start: "top 92%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .55, stagger: .07, ease: "power2.out" }) });
}
document.addEventListener("DOMContentLoaded", () => { layout(); reveal(); setTimeout(() => $("#loader") && $("#loader").remove(), 700); });
