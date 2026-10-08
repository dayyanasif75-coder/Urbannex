/* ===== URBANNEX config & data ===== */
const WHATSAPP_NUMBER = "923001234567"; // international format, no + or spaces. Change ONLY here.
const CATS = ["Fashion","Electronics","Shoes","Watches","Beauty","Home","Accessories","Gadgets"];
const CAT_STYLE = {Fashion:["#1a1a1a","#c9a24b","👕"],Electronics:["#23262b","#6b8cae","🎧"],Shoes:["#2b2b2b","#b08d57","👟"],Watches:["#111111","#d4af37","⌚"],Beauty:["#e9d5cf","#a8745f","🧴"],Home:["#d9d6cc","#7c7a6c","🕯️"],Accessories:["#3a2f26","#c9a24b","👜"],Gadgets:["#1f2a35","#4fa3a5","🔌"]};
// Placeholder art (inline SVG, never breaks). Replace `image`/`gallery` with real files in /assets/images.
function art(cat, v = 0) {
  const [a, b, i] = CAT_STYLE[cat];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='${v%2}' y1='0' x2='${1-v%2}' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><circle cx='${120+v*80}' cy='${90+v*40}' r='${90+v*10}' fill='#fff' opacity='.1'/><text x='200' y='235' font-size='130' text-anchor='middle'>${i}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const RAW = `Urban Classic Oversized T-Shirt|Fashion|2499|3999|4.6
Premium Chronograph Watch|Watches|8999|14999|4.8
SonicBeat Wireless Earbuds|Electronics|4999|7999|4.5
FlexFit Running Shoes|Shoes|5499|8999|4.7
Urban Leather Backpack|Accessories|6499|9999|4.6
FastCharge USB-C Charger 65W|Gadgets|1899|2999|4.4
Minimalist Smart Watch|Watches|7499|11999|4.5
Premium Everyday Hoodie|Fashion|3499|5999|4.7
Slim Fit Chino Trousers|Fashion|2999|4499|4.3
Linen Summer Shirt|Fashion|2799|3999|4.4
Women's Wrap Midi Dress|Fashion|4299|6999|4.6
Essential Zip Jacket|Fashion|5999|8999|4.5
Court Leather Sneakers|Shoes|6999|10999|4.7
Trail Hiker Boots|Shoes|8499|12999|4.6
Everyday Slide Sandals|Shoes|1499|2499|4.2
Heritage Automatic Watch|Watches|18999|25999|4.9
Steel Link Quartz Watch|Watches|4299|6499|4.3
ANC Over-Ear Headphones|Electronics|12999|18999|4.8
Portable Bluetooth Speaker|Electronics|3999|5999|4.5
4K Action Camera|Electronics|15999|22999|4.4
Hydrating Face Serum 30ml|Beauty|1799|2499|4.6
Oud & Amber Eau de Parfum|Beauty|5999|8499|4.8
Beard Care Grooming Kit|Beauty|2299|3299|4.5
Ceramic Aroma Diffuser|Home|2899|3999|4.4
Soy Wax Candle Set|Home|1599|2299|4.6
Woven Throw Blanket|Home|3299|4999|4.5
Minimal Leather Wallet|Accessories|1999|2999|4.5
Polarized Aviator Sunglasses|Accessories|2499|3999|4.4
Canvas Weekender Tote|Accessories|2999|4499|4.3
MagSafe Wireless Charging Pad|Gadgets|2799|3999|4.5
20,000mAh Power Bank|Gadgets|3499|4999|4.6
Smart LED Desk Lamp|Gadgets|3999|5499|4.4`;
const PRODUCTS = RAW.split("\n").map((l, n) => {
  const [name, category, price, old, rating] = l.split("|");
  const id = n + 1, p = +price, o = +old;
  return { id, name, category, price: p, oldPrice: o, discount: Math.round(100 - p / o * 100), rating: +rating,
    reviews: 40 + (id * 37) % 260, image: art(category, 0), gallery: [art(category, 0), art(category, 1), art(category, 2)],
    description: `${name} — designed for modern living with durable materials, a refined finish and everyday comfort. Backed by URBANNEX quality checks.`,
    stock: id % 9 === 0 ? 0 : id % 5 === 0 ? 4 : 30, badge: id % 4 === 0 ? "New" : id % 3 === 0 ? "Best Seller" : "",
    colors: ["Black","Charcoal","Sand"], sizes: category === "Fashion" ? ["S","M","L","XL"] : category === "Shoes" ? ["40","41","42","43","44"] : [],
    url: `product.html?id=${id}` };
});
