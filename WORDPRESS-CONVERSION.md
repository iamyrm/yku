# Converting this site to a WordPress theme

This document explains how to turn the static site in this folder into a
WordPress theme **without rewriting the design or the JavaScript**. The CSS, the
component markup and the runtime behaviour (filters, language switch, WhatsApp
form, gallery) are kept; only the places that currently read from
`data/*.js` are replaced by WordPress queries.

> Read [README.md](README.md) first — it describes the data shapes and the
> markup contracts that this guide maps onto WordPress.

---

## 1. Strategy in one paragraph

Keep the theme's front end exactly as it is today: the same `css/` files, the
same `js/` modules, the same component classes. Move **content** out of
`data/livestock.js`, `data/animal-feed.js` and `data/crops.js` into custom post
types, and move **site settings** out of `data/config.js` into a theme options
page. Then replace the JavaScript catalogue renderer with PHP that prints the
*same HTML strings* the renderer produces (or keep `catalogue.js` and feed it a
`wp_localize_script` payload — see §8). Navigation becomes a registered menu,
strings move to a translation layer, and WordPress generates the sitemap,
robots and canonical tags.

---

## 2. Theme file structure

```
yagya-krishi-udhyog/                 (theme root)
├── style.css                        # Theme header only; real CSS stays in css/
├── functions.php                    # Enqueues, theme supports, includes
├── index.php                        # Fallback template
├── front-page.php                   # Home (from index.html)
├── page-about.php                   # About
├── page-farming-practices.php
├── page-contact.php
├── page-privacy-policy.php
├── page-terms-and-conditions.php
├── 404.php                          # From 404.html
├── archive-livestock.php            # livestock/index.html equivalent
├── single-livestock.php             # livestock detail
├── archive-feed_product.php
├── single-feed_product.php
├── archive-crop.php
├── single-crop.php
├── taxonomy-livestock_category.php
├── taxonomy-feed_category.php
├── taxonomy-crop_category.php
├── header.php                       # <head> + skip link + <div id="site-header">
├── footer.php                       # <div id="site-footer"> + scripts
├── template-parts/
│   ├── card-livestock.php
│   ├── card-feed.php
│   ├── card-crop.php
│   ├── detail-gallery.php
│   ├── spec-table.php
│   ├── controls.php                 # The filter/search/sort bar
│   └── cta-band.php
├── inc/
│   ├── post-types.php
│   ├── taxonomies.php
│   ├── meta-fields.php
│   ├── settings.php                 # Options page for config.js values
│   ├── navigation.php               # Header/footer markup (was navigation.js)
│   ├── enqueue.php
│   └── i18n.php
├── css/        (copied unchanged)
├── js/         (copied, see §8)
├── data/       (kept only for translations.js, see §9)
└── assets/     (images, unchanged)
```

Copy `css/`, `js/`, `data/translations.js` and `assets/` across unchanged. The
`.html` files become the PHP templates listed above.

---

## 3. Register content types

`inc/post-types.php` — one CPT per catalogue section. Use `slug`-friendly
rewrites so URLs stay identical to the static site
(`/livestock/pigs/`, `/animal-feed/pig-grower-mash/`, `/crops/rice/`).

| Static data | CPT | Suggested slug | Archive URL |
| --- | --- | --- | --- |
| `YK_LIVESTOCK` | `livestock` | `livestock` | `/livestock/` |
| `YK_FEED` | `feed_product` | `animal-feed` | `/animal-feed/` |
| `YK_CROPS` | `crop` | `crops` | `/crops/` |

```php
register_post_type( 'livestock', array(
    'label'        => __( 'Livestock', 'yku' ),
    'public'       => true,
    'has_archive'  => 'livestock',
    'rewrite'      => array( 'slug' => 'livestock', 'with_front' => false ),
    'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
) );
```

Register the same for `feed_product` (`slug => 'animal-feed'`) and `crop`
(`slug => 'crops'`). The post **title** holds the English name; the Nepali name
and the rest of the bilingual fields come from meta (§5).

### Taxonomies (`inc/taxonomies.php`)

| Static data | Taxonomy | Attach to | Terms |
| --- | --- | --- | --- |
| `YK_LIVESTOCK_CATEGORIES` | `livestock_category` | `livestock` | pigs, goats, cattle, buffaloes, poultry |
| `YK_FEED_CATEGORIES` | `feed_category` | `feed_product` | pig, cattle, poultry, goat, other |
| `YK_CROP_CATEGORIES` | `crop_category` | `crop` | grain, cash, vegetable … |
| `YK_SEASONS` | `crop_season` | `crop` | monsoon, winter, spring, year-round |

Set `'hierarchical' => true` for category taxonomies and `false` for seasons.

---

## 4. Template mapping

| Static file | WordPress template | Notes |
| --- | --- | --- |
| `index.html` | `front-page.php` | Home preview lists use `WP_Query` with `posts_per_page` matching `data-limit`. |
| `livestock/index.html` | `archive-livestock.php` | Filter bar = `template-parts/controls.php`; grid = `WP_Query` + `card-livestock.php`. |
| `livestock/<slug>/index.html` | `single-livestock.php` | `#detail-root` content = `template-parts/detail-gallery.php` + `spec-table.php` + notices + actions. |
| `animal-feed/index.html` | `archive-feed_product.php` | Category chips = `get_terms( 'feed_category' )`. |
| `animal-feed/<slug>/index.html` | `single-feed_product.php` | |
| `crops/index.html` | `archive-crop.php` | Season chips = `crop_season` terms. |
| `crops/<slug>/index.html` | `single-crop.php` | |
| `about/`, `farming-practices/` | `page-about.php`, `page-farming-practices.php` | Standard pages, editable body. |
| `contact/index.html` | `page-contact.php` | Keep the form; see §10. |
| `privacy-policy/`, `terms-and-conditions/` | `page-*.php` | Prefer real WP pages so the owner can edit them. |
| `404.html` | `404.php` | |

**Reuse the exact markup.** For each card, copy the HTML string currently in
`js/catalogue.js` (`catCard`, `feedRow`, `specTable`, `detailActions`,
`relatedBlock`) into a PHP partial and swap the variables for `get_the_title()`,
`get_field()`, `get_term()` etc. Keeping identical classes guarantees the CSS
and any remaining JS continue to work.

---

## 5. Bilingual fields

The site is EN/NE everywhere. There are two clean options:

### Option A — one post, two languages in meta (matches the current site)

Store every bilingual string as a pair of meta keys. Simplest is ACF with a
"Text" field per language, or a small repeater. Field names mirror the data
shape:

```
name_en        name_ne
short_en       short_ne
description_en description_ne
notes_en       notes_ne
seo_title_en   seo_title_ne
seo_description_en seo_description_ne
```

Non-translatable fields are single values:

```
category (taxonomy term)   availability (select: available|seasonal|coming_soon|unavailable)
image (image field)        gallery (gallery field)
feed: product_type_en/ne, brand_en/ne, package_size_en/ne, price_en/ne, suitable_for_en/ne
crop: seasons (term), planting_period_en/ne, harvest_period_en/ne
```

Helper (mirrors `window.YK_UTIL.bi`):

```php
function yku_bi( $en, $ne ) {
    return ( function_exists( 'get_locale' ) && 0 === strpos( get_locale(), 'ne' ) && $ne )
        ? $ne : $en;
}
```

Swap the runtime language switch for WordPress's own locale so the *server* can
render the right language (better for SEO and for no-JS visitors), or keep the
client-side switch and localise via `wp_localize_script` (§8).

### Option B — Polylang / WPML

Create a translated post per language and let the plugin handle the language
switch and hreflang. Use this if the owner needs a full admin translation
workflow. Do **not** mix Option A and B.

---

## 6. Theme setup and menus (`functions.php`)

```php
add_action( 'after_setup_theme', function () {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption' ) );
    register_nav_menus( array(
        'primary' => __( 'Primary navigation', 'yku' ),
        'footer'  => __( 'Footer navigation', 'yku' ),
    ) );
} );
```

The current header/footer are injected by `js/navigation.js`. In WordPress,
either:

* **Keep the JS** (thinnest migration): leave `#site-header` / `#site-footer`
  mounts, keep `navigation.js`, and feed it data with `wp_localize_script`
  (§8). You also need `body` `data-base` (set to `''` because WP URLs are
  absolute) and `data-page`.
* **Move to PHP** (recommended long term): port the strings in
  `js/navigation.js` (`renderHeader`, `renderFooter`, `dropdown`, `drawer`) into
  `inc/navigation.php` using `wp_nav_menu()`, and drop the `data-base` prefixing
  in favour of `home_url()`. Keep the same class names so `components.css`
  still applies.

Either way, preserve these class names: `.site-header`, `.header-inner`,
`.brand`, `.primary-nav .nav-list .nav-item .nav-link`, `.header-actions`,
`.lang-switch`, `.menu-toggle`, `.mobile-drawer`, `.mobile-nav`,
`.mobile-subnav`, `.site-footer`, `.footer-grid`, `.footer-col`,
`.footer-bottom`.

---

## 7. Settings page (`inc/settings.php`)

`data/config.js` maps to a **Theme Options** page (`acf_add_options_page()` or
`register_setting()`). Fields:

| Config key | Option | Type |
| --- | --- | --- |
| `siteDomain` | *(not needed)* | WordPress supplies it via `home_url()`. |
| `phoneDisplay` | `yku_phone_display` | text |
| `phoneTel` | `yku_phone_tel` | text |
| `whatsappNumber` | `yku_whatsapp` | text (digits only) |
| `defaultLang` | `yku_default_lang` | select en/ne |
| `businessName` | `yku_business_name_en/_ne` | text pair |
| `locationLabel` | `yku_location_en/_ne` | text pair |

Expose them to JS as described in §8 so `contact.js` and `navigation.js` keep
working unchanged.

---

## 8. Keeping the JavaScript working

The JS modules read globals set by `data/*.js`. Reproduce those globals from
WordPress with `wp_localize_script()` (or `wp_add_inline_script()`):

```php
wp_localize_script( 'yku-app', 'YK_CONFIG', array(
    'siteDomain'     => home_url(),
    'phoneDisplay'   => $phone_display,
    'phoneTel'       => $phone_tel,
    'whatsappNumber' => $whatsapp,
    'defaultLang'    => $default_lang,
    'storageKey'     => 'yk_lang',
    'draftKey'       => 'yk_enquiry_draft',
    'businessName'   => array( 'en' => $name_en, 'ne' => $name_ne ),
    'locationLabel'  => array( 'en' => $loc_en,  'ne' => $loc_ne ),
) );
```

Two migration choices for the catalogue:

* **Server-rendered (recommended):** print the cards, spec table, related items
  and detail gallery in PHP, and only let `filters.js` filter the *existing*
  DOM. You can then drop `catalogue.js` entirely. Filtering stays client-side
  and instant; the URL state (`?q=`, `?sort=`, `?category=`, `?season=`,
  `?availability=`) keeps working because `filters.js` only touches the DOM and
  `history.replaceState`.
* **Client-rendered (fastest port):** convert each queried post into the item
  object the renderer expects and `wp_localize_script( 'yku-app', 'YK_LIVESTOCK', $items )`
  (plus `YK_FEED`, `YK_CROPS`, `YK_LIVESTOCK_CATEGORIES`, `YK_FEED_CATEGORIES`,
  `YK_CROPS_CATEGORIES`, `YK_SEASONS`). `catalogue.js` then works as-is. This is
  the least code to write but leaves filtering/rendering on the client.

Either way, keep the script **order and deferral** from `README.md §3`.

Enqueue example (`inc/enqueue.php`):

```php
add_action( 'wp_enqueue_scripts', function () {
    $uri = get_template_directory_uri();
    wp_enqueue_style( 'yku-fonts',
        'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap',
        array(), null );
    wp_enqueue_style( 'yku-swiper',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), null );
    foreach ( array( 'variables', 'reset', 'typography', 'layout', 'components', 'animations', 'responsive' ) as $sheet ) {
        wp_enqueue_style( "yku-$sheet", "$uri/css/$sheet.css", array(), null );
    }

    wp_enqueue_script( 'yku-gsap',
        'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'yku-gsap-st',
        'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', array( 'yku-gsap' ), null, true );
    wp_enqueue_script( 'yku-swiper',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), null, true );

    wp_enqueue_script( 'yku-i18n',        "$uri/js/i18n.js",        array(), null, true );
    wp_enqueue_script( 'yku-navigation',  "$uri/js/navigation.js",  array( 'yku-i18n' ), null, true );
    wp_enqueue_script( 'yku-catalogue',   "$uri/js/catalogue.js",   array( 'yku-navigation' ), null, true );
    wp_enqueue_script( 'yku-filters',     "$uri/js/filters.js",     array( 'yku-catalogue' ), null, true );
    wp_enqueue_script( 'yku-contact',     "$uri/js/contact.js",     array( 'yku-filters' ), null, true );
    wp_enqueue_script( 'yku-gallery',     "$uri/js/gallery.js",     array( 'yku-contact' ), null, true );
    wp_enqueue_script( 'yku-animations',  "$uri/js/animations.js",  array( 'yku-gallery' ), null, true );
    wp_enqueue_script( 'yku-app',         "$uri/js/main.js",        array( 'yku-animations' ), null, true );
} );
```

If you keep client-side rendering, `wp_localize_script` the catalogue arrays
onto `yku-app` before it prints (order matters: localise after the handle is
registered).

---

## 9. UI strings and i18n (`inc/i18n.php`)

`data/translations.js` holds every UI string as `window.YK_TRANSLATIONS`.
Two conversion paths:

1. **Keep the dictionary.** Copy `data/translations.js` unchanged and keep
   `i18n.js` handling `data-i18n` attributes. Fastest, and identical behaviour.
   The language switch stays client-side.
2. **Move to `__()` calls.** Convert each key to a `gettext` call in the PHP
   templates (`esc_html__( 'Livestock', 'yku' )`) and ship `languages/yku-en_US.po`
   + `languages/yku-ne_NP.po`. WordPress then drives the language via
   `get_locale()`. This is the canonical approach and pairs well with Option B
   for content translation.

If you keep the client-side switch, register it with WP so `<html lang>` and
`<title>` stay in sync (the current `i18n.js` already updates both).

---

## 10. Contact form and WhatsApp

`js/contact.js` builds a `wa.me` deep link from the form. Nothing about that
needs WordPress:

* Keep `page-contact.php` with the same `<form class="enquiry-form">` markup
  and field names so `contact.js` finds them.
* Keep the `?interest=livestock|feed|crops&item=<name>` deep link on catalogue
  "Enquire" buttons — with server-rendered cards, generate that link in PHP.
* Draft persistence (`localStorage`) and validation stay client-side.

If the owner later wants the enquiry **stored** as well, add a `wp_ajax_` handler
that saves a private `enquiry` post (or sends `wp_mail()`), while keeping the
WhatsApp hand-off as the primary action. Never present the form as having *sent*
a message when it only opened WhatsApp.

---

## 11. SEO, robots and the sitemap

Remove the static `sitemap.xml` / `robots.txt` and let a plugin handle them:

* **Rank Math** or **Yoast SEO** generate the XML sitemap, robots rules,
  canonical tags and Open Graph tags.
* Set the CPTs and taxonomies to be included in the sitemap; keep `404` noindex.
* Add the schema the static pages imply: `Organization` (site-wide),
  `BreadcrumbList` (detail pages), and `Product`/`Offer` only where the owner
  can confirm real prices — do **not** emit prices that are not confirmed.

The per-page `<title>`/meta currently written by `setDetailMeta()` in
`catalogue.js` should be replaced by Rank Math/Yoast output (i.e. drop that
function when you go server-rendered).

---

## 12. Migration checklist

1. Copy `css/`, `js/`, `data/translations.js`, `assets/` into the theme.
2. Register the three CPTs and four taxonomies; flush permalinks.
3. Create the option fields and map every value from `data/config.js`.
4. Add the bilingual meta fields (§5) and import each array from
   `data/livestock.js`, `data/animal-feed.js`, `data/crops.js` as posts:
   title = English name, meta = the rest, taxonomy = `categoryKey`/seasons.
5. Build the PHP templates by copying the card/spec/gallery HTML strings out of
   `catalogue.js` so the markup is byte-for-byte compatible with the CSS.
6. Choose client-rendered or server-rendered catalogue (§8) and remove the
   now-unused code path.
7. Convert header/footer to `wp_nav_menu()` **or** keep `navigation.js` and
   localise its data.
8. Decide i18n strategy (§4 Option A/B, §9) and wire the language switch.
9. Replace canonical/OG/robots/sitemap with the SEO plugin's output.
10. Re-test on a real phone: language switch, filters, detail galleries, the
    WhatsApp hand-off, and the 404 page.
11. Re-verify the privacy policy and terms with the owner before launch.

---

## 13. What NOT to change

* **Class names.** `components.css` is the contract; the PHP templates must
  emit the same classes the JS renderer does.
* **Script order.** Keep the deferred order from `README.md §3`.
* **Honesty rules.** No invented prices, testimonials, certifications or
  statistics. Feed products must stay presented as a **dealer/reseller**
  offering; sample data must remain clearly marked as placeholder until the
  owner confirms it.
* **Accessibility toggles.** Keep using `is-open` / `is-visible` / inline
  `style.display` (with `aria-expanded`/`aria-pressed`) rather than the `hidden`
  attribute where author CSS sets `display`.
