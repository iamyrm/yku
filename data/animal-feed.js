/* ==========================================================================
   Animal feed catalogue data
   --------------------------------------------------------------------------
   BUSINESS MODEL: Yagya Krishi Udhyog purchases feed products from
   wholesalers and resells them to customers. The farm does NOT manufacture
   feed. Product entries below are SAMPLE/PLACEHOLDER listings that
   demonstrate the layout — names, brands, package sizes, prices and
   availability must be confirmed by the owner before publication.

   WordPress mapping: custom post type "feed_product" with a
   "feed_category" taxonomy. Meta keys mirror the fields below
   (brand, product_type, package_size, price, availability ...).
   ========================================================================== */

window.YK_FEED_CATEGORIES = [
  { key: "pig", label: { en: "Pig Feed", ne: "बँगुरा पशुआहार" } },
  { key: "cattle", label: { en: "Cattle and Buffalo Feed", ne: "गाईभैँसी पशुआहार" } },
  { key: "poultry", label: { en: "Poultry Feed", ne: "मुर्गी पशुआहार" } },
  { key: "goat", label: { en: "Goat Feed", ne: "बाख्रा पशुआहार" } },
  { key: "other", label: { en: "Other Feed Products", ne: "अन्य पशुआहार" } },
];

window.YK_FEED = [
  {
    id: "feed-001",
    slug: "pig-grower-mash",
    name: { en: "Pig Feed — Grower Mash", ne: "बँगुरा पशुआहार — बढ्दो मिश्रण" },
    categoryKey: "pig",
    category: { en: "Pig Feed", ne: "बँगुरा पशुआहार" },
    productType: { en: "Mash feed", ne: "म्यास" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Pigs", ne: "बँगुरा" },
    availability: "available",
    placeholder: true,
    description: {
      en: "A mash-type pig feed offered through our feed distribution service. Sourced from a wholesaler and supplied to farmers and farms — this listing is a sample entry, and packaging, brand and pricing should be confirmed directly with us before ordering.",
      ne: "हाम्रो पशुआहार वितरण सेवाअन्तर्गत उपलब्ध गराइने म्यास प्रकारको बँगुरा पशुआहार। थोक व्यापारीबाट प्राप्त गरी किसान र फार्महरूलाई आपूर्ति गरिन्छ — यो नमूना प्रविष्टि हो, र ढुवानी, ब्रान्ड र मूल्य अर्डर गर्नुअघि प्रत्यक्ष हामसँग पुष्टि गर्नुपर्छ।",
    },
    image: "assets/images/animal-feed/pig-feed.svg",
    gallery: [
      "assets/images/animal-feed/pig-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Pig Feed Supply — Yagya Krishi Udhyog", ne: "बँगुरा पशुआहार आपूर्ति — यज्ञ कृषि उद्योग" },
      description: {
        en: "Pig feed supplied by Yagya Krishi Udhyog as an agricultural feed dealer in Nepal. Enquire for availability and current pricing.",
        ne: "कृषित्मक पशुआहार विक्रेताका रूपमा यज्ञ कृषि उद्योगबाट आपूर्ति हुने बँगुरा पशुआहार। उपलब्धता र हालको मूल्यका लागि सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    id: "feed-002",
    slug: "pig-finisher-pellets",
    name: { en: "Pig Feed — Fattening Pellets", ne: "बँगुरा पशुआहार — तौल बढाउने पेलेट" },
    categoryKey: "pig",
    category: { en: "Pig Feed", ne: "बँगुरा पशुआहार" },
    productType: { en: "Pellet feed", ne: "पेलेट" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Pigs", ne: "बँगुरा" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "A pellet-form pig feed used in the later feeding stage, supplied through our wholesale purchase and resale channel. This is sample catalogue content — product brand, pack size and price are confirmed only on enquiry.",
      ne: "पछिल्लो खुवाइ चरणमा प्रयोग हुने पेलेट रूपको बँगुरा पशुआहार, हाम्रो थोक खरिद र पुनर्विक्रय माध्यमबाट आपूर्ति हुन्छ। यो नमूना सूची सामग्री हो — ब्रान्ड, प्याकेट साइज र मूल्य सोधपुछ गर्दा मात्र पुष्टि हुन्छ।",
    },
    image: "assets/images/animal-feed/pig-feed.svg",
    gallery: [
      "assets/images/animal-feed/pig-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Pig Feed Pellets — Yagya Krishi Udhyog", ne: "बँगुरा पशुआहार पेलेट — यज्ञ कृषि उद्योग" },
      description: {
        en: "Pellet pig feed distributed by Yagya Krishi Udhyog. Ask about availability, pack sizes and current prices.",
        ne: "यज्ञ कृषि उद्योगबाट वितरित पेलेट बँगुरा पशुआहार। उपलब्धता, प्याकेट साइज र हालको मूल्यबारे सोध्नुहोस्।",
      },
    },
  },
  {
    id: "feed-003",
    slug: "cattle-concentrate-mix",
    name: { en: "Cattle & Buffalo Feed — Concentrate Mix", ne: "गाईभैँसी पशुआहार — केन्द्रित मिश्रण" },
    categoryKey: "cattle",
    category: { en: "Cattle and Buffalo Feed", ne: "गाईभैँसी पशुआहार" },
    productType: { en: "Concentrate mix", ne: "केन्द्रित मिश्रण" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Cows and buffaloes", ne: "गाई र भैँसी" },
    availability: "available",
    placeholder: true,
    description: {
      en: "A concentrate feed mix for cows and buffaloes, part of the feed range we purchase from wholesalers and supply to local farmers. This sample listing carries no verified specifications — brand, composition and price are shared on enquiry.",
      ne: "गाई र भैँसीका लागि केन्द्रित पशुआहार मिश्रण, जुन हामीले थोक व्यापारीबाट खरिद गरी स्थानीय किसानलाई आपूर्ति गर्ने पशुआहार श्रृंखलाको अंग हो। यस नमूना प्रविष्टिमा प्रमाणित विनिर्देश छैन — ब्रान्ड, संरचना र मूल्य सोधपुछ गर्दा दिइन्छ।",
    },
    image: "assets/images/animal-feed/cattle-feed.svg",
    gallery: [
      "assets/images/animal-feed/cattle-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Cattle & Buffalo Feed Supply — Yagya Krishi Udhyog", ne: "गाईभैँसी पशुआहार आपूर्ति — यज्ञ कृषि उद्योग" },
      description: {
        en: "Cattle and buffalo feed supplied by Yagya Krishi Udhyog. Browse the feed catalogue and enquire for current availability.",
        ne: "यज्ञ कृषि उद्योगबाट आपूर्ति हुने गाईभैँसी पशुआहार। पशुआहार सूची हेर्नुहोस् र हालको उपलब्धताका लागि सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    id: "feed-004",
    slug: "cattle-dairy-ration",
    name: { en: "Cattle Feed — Dairy Ration Mix", ne: "गाई पशुआहार — दुधारु मिश्रण" },
    categoryKey: "cattle",
    category: { en: "Cattle and Buffalo Feed", ne: "गाईभैँसी पशुआहार" },
    productType: { en: "Mixed ration", ne: "मिश्रित खुराक" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Dairy cows", ne: "दुधारु गाई" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "A mixed ration feed for dairy cattle, resold by Yagya Krishi Udhyog through its feed dealership. Sample entry: exact brand, composition, pack size and price are confirmed directly with the farm.",
      ne: "दुधारु गाईका लागि मिश्रित खुराक, जुन यज्ञ कृषि उद्योगले आफ्नो पशुआहार डिलरशिपमार्फत पुनर्विक्रय गर्दछ। नमूना प्रविष्टि: सट्टा ब्रान्ड, संरचना, प्याकेट साइज र मूल्य फार्मसँगै प्रत्यक्ष पुष्टि गरिन्छ।",
    },
    image: "assets/images/animal-feed/cattle-feed.svg",
    gallery: [
      "assets/images/animal-feed/cattle-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Dairy Cattle Feed — Yagya Krishi Udhyog", ne: "दुधारु गाई पशुआहार — यज्ञ कृषि उद्योग" },
      description: {
        en: "Dairy cattle feed available through Yagya Krishi Udhyog's feed distribution service in Nepal.",
        ne: "नेपालमा यज्ञ कृषि उद्योगको पशुआहार वितरण सेवामार्फत उपलब्ध दुधारु गाई पशुआहार।",
      },
    },
  },
  {
    id: "feed-005",
    slug: "poultry-layer-mash",
    name: { en: "Poultry Feed — Layer Mash", ne: "मुर्गी पशुआहार — अण्डा दिने मिश्रण" },
    categoryKey: "poultry",
    category: { en: "Poultry Feed", ne: "मुर्गी पशुआहार" },
    productType: { en: "Mash feed", ne: "म्यास" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Layers (hens)", ne: "अण्डा दिने मुर्गी" },
    availability: "available",
    placeholder: true,
    description: {
      en: "Layer mash for laying hens, one of the poultry feed lines we stock through wholesale purchase. This is sample catalogue content; brand, pack size and current price are provided on enquiry rather than published online.",
      ne: "अण्डा दिने मुर्गीका लागि लेयर म्यास, जुन हामीले थोक खरिदमार्फत राख्ने पोल्ट्री पशुआहार श्रृंखलाहरूमध्ये एक हो। यो नमूना सूची सामग्री हो; ब्रान्ड, प्याकेट साइज र हालको मूल्य अनलाइन नराखी सोधपुछ गर्दा दिइन्छ।",
    },
    image: "assets/images/animal-feed/poultry-feed.svg",
    gallery: [
      "assets/images/animal-feed/poultry-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Poultry Layer Feed — Yagya Krishi Udhyog", ne: "पोल्ट्री लेयर पशुआहार — यज्ञ कृषि उद्योग" },
      description: {
        en: "Layer mash and poultry feed supplied by Yagya Krishi Udhyog. Enquire for availability and pricing.",
        ne: "यज्ञ कृषि उद्योगबाट आपूर्ति हुने लेयर म्यास र पोल्ट्री पशुआहार। उपलब्धता र मूल्यका लागि सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    id: "feed-006",
    slug: "poultry-starter-crumble",
    name: { en: "Poultry Feed — Starter Crumble", ne: "मुर्गी पशुआहार — सुरुवाती गुँडो" },
    categoryKey: "poultry",
    category: { en: "Poultry Feed", ne: "मुर्गी पशुआहार" },
    productType: { en: "Crumble feed", ne: "गुँडो" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Young chicks", ne: "बालक मुर्गी" },
    availability: "available",
    placeholder: true,
    description: {
      en: "Starter crumble feed for young birds, distributed by Yagya Krishi Udhyog from wholesale stock. Sample listing — confirm brand, package size and price with us before purchase.",
      ne: "बालक मुर्गीका लागि सुरुवाती गुँडो, जुन यज्ञ कृषि उद्योगले थोक स्टकबाट वितरण गर्दछ। नमूना सूची — किन्नुअघि ब्रान्ड, प्याकेट साइज र मूल्य हामसँग पुष्टि गर्नुहोस्।",
    },
    image: "assets/images/animal-feed/poultry-feed.svg",
    gallery: [
      "assets/images/animal-feed/poultry-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Poultry Starter Feed — Yagya Krishi Udhyog", ne: "पोल्ट्री सुरुवाती पशुआहार — यज्ञ कृषि उद्योग" },
      description: {
        en: "Starter feed for young poultry, supplied by Yagya Krishi Udhyog. Ask about current stock and pricing.",
        ne: "यज्ञ कृषि उद्योगबाट आपूर्ति हुने बालक मुर्गीका लागि सुरुवाती पशुआहार। हालको स्टक र मूल्यबारे सोध्नुहोस्।",
      },
    },
  },
  {
    id: "feed-007",
    slug: "goat-feed-mixture",
    name: { en: "Goat Feed — Mixture", ne: "बाख्रा पशुआहार — मिश्रण" },
    categoryKey: "goat",
    category: { en: "Goat Feed", ne: "बाख्रा पशुआहार" },
    productType: { en: "Mixed feed", ne: "मिश्रित मिश्रण" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Goats", ne: "बाख्रा" },
    availability: "coming_soon",
    placeholder: true,
    description: {
      en: "A mixed goat feed added to our catalogue as distribution expands. This sample entry will be updated with real brand, packaging and pricing information once confirmed by the supplier and the business owner.",
      ne: "वितरण विस्तारसँगै हाम्रो सूचीमा थपिएको मिश्रित बाख्रा पशुआहार। आपूर्तिकर्ता र व्यवसाय मालिकबाट पुष्टि भएपछि यो नमूना प्रविष्टिमा वास्तविक ब्रान्ड, प्याकेजिङ र मूल्य अद्यावधिक गरिनेछ।",
    },
    image: "assets/images/animal-feed/goat-feed.svg",
    gallery: [
      "assets/images/animal-feed/goat-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Goat Feed Supply — Yagya Krishi Udhyog", ne: "बाख्रा पशुआहार आपूर्ति — यज्ञ कृषि उद्योग" },
      description: {
        en: "Goat feed supplied by Yagya Krishi Udhyog. Enquire to learn when stock becomes available.",
        ne: "यज्ञ कृषि उद्योगबाट आपूर्ति हुने बाख्रा पशुआहार। स्टक कहिले उपलब्ध हुन्छ जान्न सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    id: "feed-008",
    slug: "goat-feed-pellets",
    name: { en: "Goat Feed — Pellets", ne: "बाख्रा पशुआहार — पेलेट" },
    categoryKey: "goat",
    category: { en: "Goat Feed", ne: "बाख्रा पशुआहार" },
    productType: { en: "Pellet feed", ne: "पेलेट" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Goats", ne: "बाख्रा" },
    availability: "unavailable",
    placeholder: true,
    description: {
      en: "Pellet-form goat feed listed as part of the catalogue expansion. Sample content only — contact the farm to ask whether this product is currently stocked.",
      ne: "सूची विस्तारका रूपमा सूचीकृत पेलेट रूपको बाख्रा पशुआहार। केवल नमूना सामग्री — यो उत्पादन अहिले स्टकमा छ कि छैन जान्न फार्मसँग सम्पर्क गर्नुहोस्।",
    },
    image: "assets/images/animal-feed/goat-feed.svg",
    gallery: [
      "assets/images/animal-feed/goat-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Goat Feed Pellets — Yagya Krishi Udhyog", ne: "बाख्रा पशुआहार पेलेट — यज्ञ कृषि उद्योग" },
      description: {
        en: "Pellet goat feed in the Yagya Krishi Udhyog catalogue. Check availability directly before visiting.",
        ne: "यज्ञ कृषि उद्योगको सूचीमा रहेको पेलेट बाख्रा पशुआहार। नजानु अघि उपलब्धता प्रत्यक्ष जाँच गर्नुहोस्।",
      },
    },
  },
  {
    id: "feed-009",
    slug: "livestock-mineral-mixture",
    name: { en: "Mineral Mixture for Livestock", ne: "पशुका लागि खनिज मिश्रण" },
    categoryKey: "other",
    category: { en: "Other Feed Products", ne: "अन्य पशुआहार" },
    productType: { en: "Supplement", ne: "पूरक" },
    brand: null,
    packageSize: null,
    price: null,
    suitableFor: { en: "Cattle, goats and pigs", ne: "गाई, बाख्रा र बँगुरा" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "A mineral supplement distributed alongside our regular feed range. This placeholder entry demonstrates how additional feed products will appear as the catalogue grows; details are confirmed on enquiry.",
      ne: "हाम्रो नियमित पशुआहार श्रृंखलासँगै वितरण गरिने खनिज पूरक। यो प्लेसहोल्डर प्रविष्टिले सूची बढ्दै जाँदा अतिरिक्त पशुआहार उत्पादनहरू कसरी देखिन्छ भनी देखाउँछ; विवरण सोधपुछ गर्दा पुष्टि गरिन्छ।",
    },
    image: "assets/images/animal-feed/other-feed.svg",
    gallery: [
      "assets/images/animal-feed/other-feed.svg",
      "assets/images/animal-feed/feed-bags.svg",
    ],
    seo: {
      title: { en: "Livestock Mineral Mixture — Yagya Krishi Udhyog", ne: "पशु खनिज मिश्रण — यज्ञ कृषि उद्योग" },
      description: {
        en: "Mineral mixture and supplementary feed products supplied by Yagya Krishi Udhyog.",
        ne: "यज्ञ कृषि उद्योगबाट आपूर्ति हुने खनिज मिश्रण र पूरक पशुआहार उत्पादनहरू।",
      },
    },
  },
];
