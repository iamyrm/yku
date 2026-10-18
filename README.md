# Yagya Krishi Udhyog — bilingual business website

A production-ready, responsive, bilingual (English + Nepali) static website for
**Yagya Krishi Udhyog** — a Nepali agricultural business working in livestock,
animal-feed dealership and seasonal crops.

The site is built with plain HTML, CSS and vanilla JavaScript (no build step,
no framework, no bundler). GSAP/ScrollTrigger and Swiper are loaded from a CDN
and used sparingly for reveals and the farm gallery.

> **Placeholder content:** all catalogue entries, availability labels, images and
> the `example.com` domain are placeholders. Replace them with confirmed
> information from the business owner before launch. No prices, certifications,
> statistics or testimonials are invented anywhere in the site.

---

## 1. Quick start

No tooling required. Open `index.html` directly, or serve the folder over HTTP
(recommended, because the site uses absolute-ish relative paths and `fetch`-free
but path-sensitive assets):

```bash
# Python 3
python -m http.server 8080

# or Node
npx serve .
```

Then open <http://localhost:8080/>.

---

## 2. Folder structure

```
yagya-krishi-udhyog/
├── index.html                     # Home
├── 404.html                       # Not-found page (noindex)
├── robots.txt                     # Crawler rules + sitemap reference
├── sitemap.xml                    # All indexable URLs
├── README.md
├── WORDPRESS-CONVERSION.md
│
├── about/index.html               # About the business
├── livestock/
│   ├── index.html                 # Livestock category index (filter/search/sort)
│   ├── pigs/index.html            # 5 detail pages
│   ├── goats/index.html
│   ├── cattle/index.html
│   ├── buffaloes/index.html
│   └── poultry/index.html
├── animal-feed/
│   ├── index.html                 # Feed products (category chips + filters)
│   ├── pig-grower-mash/index.html # 9 product detail pages
│   ├── pig-finisher-pellets/index.html
│   ├── cattle-concentrate-mix/index.html
│   ├── cattle-dairy-ration/index.html
│   ├── poultry-layer-mash/index.html
│   ├── poultry-starter-crumble/index.html
│   ├── goat-feed-mixture/index.html
│   ├── goat-feed-pellets/index.html
│   └── livestock-mineral-mixture/index.html
├── crops/
│   ├── index.html                 # Crop index (season + category filters)
│   ├── rice/index.html            # 6 detail pages
│   ├── wheat/index.html
│   ├── maize/index.html
│   ├── potato/index.html
│   ├── mustard/index.html
│   └── seasonal-vegetables/index.html
├── farming-practices/index.html   # How the farm works
├── contact/index.html             # WhatsApp lead form + contact details
├── privacy-policy/index.html
├── terms-and-conditions/index.html
│
├── css/
│   ├── variables.css              # Design tokens (colour, type, spacing, radii)
│   ├── reset.css                  # Normalise + a11y primitives
│   ├── typography.css             # Type scale, headings, prose
│   ├── layout.css                 # Containers, grids, sections, header/footer shell
│   ├── components.css             # Every UI component (authoritative vocabulary)
│   ├── animations.css             # Reveal states + reduced-motion fallbacks
│   └── responsive.css             # Breakpoints: 481 / 768 / 1024 / 1280
│
├── js/
│   ├── i18n.js                    # window.Lang — dictionary engine (EN/NE)
│   ├── navigation.js              # Header/footer injection, menus, drawer, helpers
│   ├── catalogue.js               # Renders cards, feed rows, detail pages
│   ├── filters.js                 # Search/sort/category/season/availability + URL state
│   ├── contact.js                 # WhatsApp lead form: validation, prefill, draft
│   ├── gallery.js                 # Swiper (mobile) + accessible lightbox
│   ├── animations.js              # GSAP reveals (skipped for reduced motion)
│   └── main.js                    # Boot order + language-change re-render
│
├── data/
│   ├── config.js                  # Site settings: domain, phone, WhatsApp, defaults
│   ├── translations.js            # EN + NE dictionary (every UI string)
│   ├── livestock.js               # Livestock categories + items
│   ├── animal-feed.js             # Feed categories + products
│   └── crops.js                   # Crop categories, seasons + items
│
└── assets/
    └── images/
        ├── logo/logo.png          # Replace with the real logo
        ├── livestock/*.svg        # Placeholder illustrations
        ├── animal-feed/*.svg
        ├── crops/*.svg
        ├── gallery/*.svg
        ├── hero-farm.svg
        ├── about-team.svg
        └── practices.svg
```

Pages are **directory URLs** (`/livestock/pigs/`) served by an `index.html` in
each folder. Internal links always point at `…/index.html` explicitly so the
site works from `file://`, any sub-path, and a standard web server alike.

---

## 3. How the site is wired

Every page shares the same skeleton:

```html
<body data-page="livestock-detail" data-base="../../">
  <a class="skip-link" href="#main-content" …>Skip to content</a>
  <div id="site-header"></div>   <!-- filled by js/navigation.js -->
  <main id="main-content"> … </main>
  <div id="site-footer"></div>   <!-- filled by js/navigation.js -->
  …deferred scripts…
</body>
```

* `data-base` is the path back to the site root (`""`, `"../"` or `"../../"`).
  Every link/asset generated by JavaScript is prefixed with it.
* `data-page` tells the navigation module which section to mark active and
  drives section-specific behaviour.
* The header and footer are **injected** once, so navigation is edited in one
  place: `js/navigation.js`.

Script load order is fixed and all scripts are deferred:

```
gsap → ScrollTrigger → Swiper → config.js → translations.js →
livestock.js → animal-feed.js → crops.js →
i18n.js → navigation.js → catalogue.js → filters.js →
contact.js → gallery.js → animations.js → main.js
```

`main.js` boots in this order: `Lang.boot()` → navigation → catalogue →
filters → contact → gallery → accordions → animations, then listens for the
`yk:langchange` event to re-render all data-driven regions.

---

## 4. Editing content

### Business details

Edit `data/config.js`:

| Key | Purpose |
| --- | --- |
| `siteDomain` | Production origin (no trailing slash). Used for canonical + OG URLs. |
| `phoneDisplay` / `phoneTel` | Number as shown / `tel:` value. |
| `whatsappNumber` | Digits only, used to build `https://wa.me/<number>`. |
| `defaultLang` | `"en"` or `"ne"` on first visit. |

### Catalogue items

Each item in `data/livestock.js`, `data/animal-feed.js` and `data/crops.js` uses
bilingual `{ en, ne }` objects:

```js
{
  slug: "pigs",                       // URL segment → /livestock/pigs/
  name: { en: "Pigs", ne: "बँगुरा" },
  categoryKey: "pigs",
  category: { en: "Pig farming", ne: "बँगुरा पालन" },
  short: { en: "…", ne: "…" },        // card / intro line
  description: { en: "…", ne: "…" },  // full paragraph
  image: "assets/images/livestock/pig.svg",
  gallery: ["assets/images/livestock/pig.svg", "assets/images/gallery/farm-environment.svg"],
  availability: "available",          // available | seasonal | coming_soon | unavailable
  notes: { en: "…", ne: "…" },        // optional spec row
  seo: {
    title: { en: "…", ne: "…" },      // page <title>
    description: { en: "…", ne: "…" } // meta description
  }
}
```

Feed products add `productType`, `brand`, `packageSize`, `price`, `suitableFor`
and a `placeholder` flag. Crops add `seasons` (keys from `YK_SEASONS`),
`plantingPeriod` and `harvestPeriod`.

**Adding a new item** requires two steps: append the object to the array in the
data file, and create the matching `…/<slug>/index.html` detail page. The
simplest way is to copy an existing detail page in the same section and change
the two `data-*` attributes on `#detail-root`:

```html
<div class="detail-grid" id="detail-root"
     data-detail-type="livestock"
     data-detail-slug="pigs"></div>
```

Everything else on the page (breadcrumbs, gallery, spec table, notices, action
buttons, related items, page title and meta) is generated from the data.

### UI strings and translations

Every interface string lives in `data/translations.js` as a flat
`key → string` map per language. Mark up any element with one of:

| Attribute | Effect |
| --- | --- |
| `data-i18n` | Replaces text content |
| `data-i18n-html` | Replaces inner HTML (for strings containing links) |
| `data-i18n-content` | Sets the element's `content` attribute (meta tags) |
| `data-i18n-ph` | Sets `placeholder` |
| `data-i18n-alt` | Sets `alt` |
| `data-i18n-title` | Sets `title` |
| `data-i18n-aria` | Sets `aria-label` |

Strings support `{name}` interpolation, e.g. `feed.count_products` uses
`{count}`. When adding a key, add it to **both** `en` and `ne` — the language
switch falls back to English if a Nepali string is missing.

### Images

All current images are brand-coloured SVG placeholders. To use photographs,
drop the real files into `assets/images/**` and update the `image`/`gallery`
paths in the data files (relative to the site root, no leading slash). Keep a
4:3 ratio for catalogue images; the CSS crops with `object-fit: cover`.

---

## 5. Design system

Tokens live in `css/variables.css`; components consume them only.

| Token | Value | Use |
| --- | --- | --- |
| `--c-primary` | `#2D5C20` | Brand green |
| `--c-primary-dark` | `#214619` | Hover / emphasis |
| `--c-surface-green` | `#F1F5ED` | Soft green panels |
| `--c-bg` | `#FAFAF6` | Off-white page background |
| `--c-text` | `#20251F` | Body text |
| `--c-text-muted` | `#666D63` | Secondary text |
| `--c-border` | `#E1E5DC` | Hairlines |

Typography: **Manrope** for Latin, **Noto Sans Devanagari** for Nepali, both
loaded from Google Fonts. Layouts are editorial and asymmetric; there are no
gradients, glass effects, neon accents or a dark theme. Motion is subtle and
fully disabled under `prefers-reduced-motion: reduce`.

---

## 6. The lead form (WhatsApp)

`contact/index.html` collects a lead and hands it to WhatsApp — the site never
pretends a message was sent by itself.

* **Required fields** are validated in the browser (GDPR-free, no backend).
* A pre-filled message is composed in the **currently selected language** and
  opened via `https://wa.me/9779804331857?text=…` in a new tab.
* If the pop-up is blocked, the page shows a fallback link and a clear notice —
  it never claims the message was delivered.
* The form **remembers a draft** in `localStorage` (`yk_enquiry_draft`) and
  clears it after a successful hand-off.
* Catalogue "Enquire" buttons deep-link into the form with
  `?interest=livestock|feed|crops&item=<name>`, so the item is pre-selected.

---

## 7. Language switching

* Default language and the persistence key are set in `data/config.js`.
* The choice is stored in `localStorage` and restored on the next visit.
* The `<html lang>` attribute, page title/meta, form labels, validation
  messages, legal pages and `alt`/`aria` text all switch together.
* Data-driven regions (cards, filters, details) are re-rendered on change; the
  change is announced to screen readers through a live region.

---

## 8. Accessibility

* Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link on
  every page.
* Visible focus rings, keyboard-operable menus, drawer with focus trap, and an
  accessible lightbox.
* The mobile sub-navigation, lightbox and form feedback are toggled with
  classes/`aria` rather than the `hidden` attribute, so both keyboard and
  screen-reader state stay correct.
* Colour contrast targets WCAG AA. Motion respects `prefers-reduced-motion`.

---

## 9. SEO

* Unique `<title>` and meta description per page; detail pages set theirs from
  the item's `seo` object.
* Canonical link, Open Graph and Twitter card tags on every page; `404.html` is
  `noindex, follow`.
* `sitemap.xml` lists every indexable URL; `robots.txt` references it and
  allows the major AI crawlers.
* `lang` attribute follows the selected language.

**Before launch:** replace `https://example.com` in `data/config.js`,
`sitemap.xml`, `robots.txt` and each page's canonical/OG tags with the real
domain, and point `<meta property="og:image">` at a real share image.

---

## 10. Deployment

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or classic shared hosting). There is no build step.

Checklist:

1. Set the real domain in `data/config.js`, `sitemap.xml`, `robots.txt` and
   page canonicals.
2. Replace `assets/images/logo/logo.png` with the real logo (and favicon).
3. Replace placeholder catalogue text, availability and images.
4. Confirm the phone number and WhatsApp number.
5. Re-verify the privacy policy and terms reflect the real business.
6. Test the lead form on a real phone and confirm the WhatsApp hand-off.

---

## 11. Browser support

Evergreen Chrome, Edge, Firefox and Safari, plus mobile browsers. Uses modern
CSS (custom properties, `clamp()`, grid, `aspect-ratio`) and ES5-level
JavaScript, so it also degrades gracefully on older browsers.

---

## 12. WordPress

See **[WORDPRESS-CONVERSION.md](WORDPRESS-CONVERSION.md)** for a step-by-step
plan to convert this static site into a WordPress theme (custom post types,
taxonomies, fields, template mapping and i18n options).
