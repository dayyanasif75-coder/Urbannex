# URBANNEX
Modern multi-category e-commerce frontend with **WhatsApp ordering** — HTML5, CSS3, vanilla JS, Bootstrap 5, GSAP.

## Pages
`index.html` (hero, categories, trending, new arrivals, deals + countdown, promo parallax), `shop.html` (search, category/price filters, sort, pagination, wishlist view), `product.html` (gallery, options, tabs, related).

## Features
Order on WhatsApp (cards, quick view, product page, deals) · Wishlist (localStorage) · Quick View modal · Toasts · GSAP + ScrollTrigger reveals · `prefers-reduced-motion` support · Responsive 320px–1920px · No cart system by design.

## Configure
Change the business number once in `js/products.js`: `const WHATSAPP_NUMBER = "923001234567";`
Product images are inline SVG placeholders; replace `image`/`gallery` with files in `assets/images/`.

## Run / Deploy
Open `index.html`, or push to GitHub → Settings → Pages → deploy from `main` / root.

## Future improvements
About, Contact, Login/Signup, cookie consent, real product photography.
