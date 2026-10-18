/* ==========================================================================
   Livestock catalogue data
   --------------------------------------------------------------------------
   PLACEHOLDER CONTENT: descriptions and availability labels below are sample
   entries for layout demonstration. Replace them with confirmed information
   from the business owner. Image paths are relative to the site root — the
   render layer prefixes them with the page's base path automatically.

   WordPress mapping: custom post type "livestock" with a "livestock_category"
   taxonomy. Each field below corresponds to a post meta key.
   ========================================================================== */

window.YK_LIVESTOCK_CATEGORIES = [
  {
    key: "pigs",
    label: { en: "Pig farming", ne: "बँगुरा पालन" },
  },
  {
    key: "goats",
    label: { en: "Goat farming", ne: "बाख्रा पालन" },
  },
  {
    key: "cattle",
    label: { en: "Cow farming", ne: "गाई पालन" },
  },
  {
    key: "buffaloes",
    label: { en: "Buffalo farming", ne: "भैँसी पालन" },
  },
  {
    key: "poultry",
    label: { en: "Poultry farming", ne: "मुर्गी पालन" },
  },
];

window.YK_LIVESTOCK = [
  {
    slug: "pigs",
    name: { en: "Pigs", ne: "बँगुरा" },
    categoryKey: "pigs",
    category: { en: "Pig farming", ne: "बँगुरा पालन" },
    short: {
      en: "Managed pig farming as part of the farm's livestock activities.",
      ne: "फार्मका पशुपालन गतिविधिका अंगभूत व्यवस्थित बँगुरा पालन।",
    },
    description: {
      en: "Yagya Krishi Udhyog raises pigs as one of its core livestock activities. Animals are kept in a managed farm environment and looked after through regular feeding and cleaning routines. Availability for sale depends on the stock actually present at the time of enquiry, so please contact us to confirm what is available now.",
      ne: "यज्ञ कृषि उद्योगले आफ्ना मुख्य पशुपालन गतिविधिहरूमध्ये एकका रूपमा बँगुरा पाल्दछ। जनावरहरूलाई व्यवस्थित फार्म वातावरणमा राखेर नियमित खुवाउने र सरसफाइको कामले हेरचाह गरिन्छ। बिक्रीका लागि उपलब्धता सोधपुछ गर्ने बेलाको वास्तविक स्टकमा निर्भर हुन्छ, त्यसैले अहिले के उपलब्ध छ भनी पुष्टि गर्न हामसँग सम्पर्क गर्नुहोस्।",
    },
    image: "assets/images/livestock/pig.svg",
    gallery: [
      "assets/images/livestock/pig.svg",
      "assets/images/gallery/farm-environment.svg",
    ],
    availability: "available",
    notes: {
      en: "Sample listing. Age, weight, breed and pricing details are shown only when confirmed by the owner.",
      ne: "नमूना सूची। उमेर, तौल, नस्ल र मूल्यसम्बन्धी विवरण मालिकले पुष्टि गरेपछि मात्र देखाइन्छ।",
    },
    seo: {
      title: { en: "Pig Farming — Yagya Krishi Udhyog", ne: "बँगुरा पालन — यज्ञ कृषि उद्योग" },
      description: {
        en: "Pig farming at Yagya Krishi Udhyog. Learn about our pig rearing activities and enquire about current availability.",
        ne: "यज्ञ कृषि उद्योगमा बँगुरा पालन। हाम्रा बँगुरा पालन गतिविधिबारे जान्नुहोस् र हालको उपलब्धताबारे सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    slug: "goats",
    name: { en: "Goats", ne: "बाख्रा" },
    categoryKey: "goats",
    category: { en: "Goat farming", ne: "बाख्रा पालन" },
    short: {
      en: "Goat rearing for the farm's livestock programme.",
      ne: "फार्मको पशुपालन कार्यक्रमका लागि बाख्रा पालन।",
    },
    description: {
      en: "Goat farming is one of the regular livestock activities carried out at Yagya Krishi Udhyog. Goats are raised in a clean, organised setting with attention to routine feeding. Stock moves through the year, so goat availability for sale should be confirmed directly before visiting.",
      ne: "बाख्रा पालन यज्ञ कृषि उद्योगमा नियमित रूपमा सञ्चालन हुने पशुपालन गतिविधिहरूमध्ये एक हो। बाख्राहरूलाई सरसफाइ र व्यवस्था भएको ठाउँमा नियमित खुवाइका साथ पालिन्छ। स्टक वर्षभरि परिवर्तन हुने हुनाले बिक्रीका लागि बाख्राको उपलब्धता नजानु अघि प्रत्यक्ष पुष्टि गर्नुपर्छ।",
    },
    image: "assets/images/livestock/goat.svg",
    gallery: [
      "assets/images/livestock/goat.svg",
      "assets/images/gallery/farm-environment.svg",
    ],
    availability: "available",
    notes: {
      en: "Sample listing. Enquire for current stock — not every category is always available for sale.",
      ne: "नमूना सूची। हालको स्टकका लागि सोधपुछ गर्नुहोस् — हरेक श्रेणी सधैं बिक्रीका लागि उपलब्ध हुँदैन।",
    },
    seo: {
      title: { en: "Goat Farming — Yagya Krishi Udhyog", ne: "बाख्रा पालन — यज्ञ कृषि उद्योग" },
      description: {
        en: "Goat farming at Yagya Krishi Udhyog. Read about our goat rearing activities and enquire about availability.",
        ne: "यज्ञ कृषि उद्योगमा बाख्रा पालन। हाम्रा बाख्रा पालन गतिविधिबारे पढ्नुहोस् र उपलब्धताबारे सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    slug: "cattle",
    name: { en: "Cows", ne: "गाई" },
    categoryKey: "cattle",
    category: { en: "Cow farming", ne: "गाई पालन" },
    short: {
      en: "Cattle raised as part of the farm's day-to-day work.",
      ne: "फार्मको दैनिक कामका अंगभूत पालिएका गाईहरू।",
    },
    description: {
      en: "Cattle farming is a standing activity at Yagya Krishi Udhyog, covering cows looked after alongside the farm's other livestock. Animals are fed and managed through regular daily routines. Any sale of cattle depends on actual availability, which we confirm on request.",
      ne: "गाई पालन यज्ञ कृषि उद्योगमा निरन्तर रूपमा चल्ने गतिविधि हो, जसमा फार्मका अन्य पशुसँगै हेरचाह गरिएका गाईहरू पर्छन्। जनावरहरूलाई दैनिक नियमित रूपमा खुवाइ र व्यवस्थापन गरिन्छ। गाईको बिक्री वास्तविक उपलब्धतामा निर्भर हुन्छ, जुन हामीले बेग्लै सोधेमा पुष्टि गर्छौं।",
    },
    image: "assets/images/livestock/cow.svg",
    gallery: [
      "assets/images/livestock/cow.svg",
      "assets/images/gallery/farm-environment.svg",
    ],
    availability: "seasonal",
    notes: {
      en: "Sample listing. Please enquire about current cattle availability before visiting.",
      ne: "नमूना सूची। नजिकै नआउनु अघि हालको गाईको उपलब्धताबारे सोधपुछ गर्नुहोस्।",
    },
    seo: {
      title: { en: "Cow Farming — Yagya Krishi Udhyog", ne: "गाई पालन — यज्ञ कृषि उद्योग" },
      description: {
        en: "Cow and cattle farming at Yagya Krishi Udhyog. Learn about our cattle rearing and ask about current availability.",
        ne: "यज्ञ कृषि उद्योगमा गाई पालन। हाम्रो गाई पालनबारे जान्नुहोस् र हालको उपलब्धताबारे सोध्नुहोस्।",
      },
    },
  },
  {
    slug: "buffaloes",
    name: { en: "Buffaloes", ne: "भैँसी" },
    categoryKey: "buffaloes",
    category: { en: "Buffalo farming", ne: "भैँसी पालन" },
    short: {
      en: "Buffalo rearing within the farm's livestock activities.",
      ne: "फार्मका पशुपालन गतिविधिभित्र भैँसी पालन।",
    },
    description: {
      en: "Buffalo farming runs alongside the farm's cattle, goat, pig and poultry work. Buffaloes are kept in the same managed environment and follow the same daily feeding routines. Buffalo availability changes over time — contact us to find out what is currently on offer.",
      ne: "भैँसी पालन फार्मको गाई, बाख्रा, बँगुरा र मुर्गी पालनसँगै चल्छ। भैँसीहरूलाई उही व्यवस्थित वातावरणमा राखेर उही दैनिक खुवाइ नियम पालिन्छ। भैँसीको उपलब्धता समयसँगै परिवर्तन हुन्छ — अहिले के उपलब्ध छ जान्न हामसँग सम्पर्क गर्नुहोस्।",
    },
    image: "assets/images/livestock/buffalo.svg",
    gallery: [
      "assets/images/livestock/buffalo.svg",
      "assets/images/gallery/farm-environment.svg",
    ],
    availability: "coming_soon",
    notes: {
      en: "Sample listing. Update this label as real availability becomes known.",
      ne: "नमूना सूची। वास्तविक उपलब्धता थाहा भएपछि यो लेबल अद्यावधिक गर्नुहोस्।",
    },
    seo: {
      title: { en: "Buffalo Farming — Yagya Krishi Udhyog", ne: "भैँसी पालन — यज्ञ कृषि उद्योग" },
      description: {
        en: "Buffalo farming at Yagya Krishi Udhyog. Read about our buffalo rearing and enquire about current availability.",
        ne: "यज्ञ कृषि उद्योगमा भैँसी पालन। हाम्रो भैँसी पालनबारे पढ्नुहोस् र हालको उपलब्धताबारे सोधपुछ गर्नुहोस्।",
      },
    },
  },
  {
    slug: "poultry",
    name: { en: "Chickens", ne: "मुर्गी" },
    categoryKey: "poultry",
    category: { en: "Poultry farming", ne: "मुर्गी पालन" },
    short: {
      en: "Poultry kept in a managed, regularly cleaned setup.",
      ne: "व्यवस्थित र नियमित सरसफाइ हुने ठाउँमा राखिएको पोल्ट्री।",
    },
    description: {
      en: "Poultry farming at Yagya Krishi Udhyog covers chickens raised in a managed environment with regular cleaning and feeding routines. Birds are kept as part of the farm's mixed livestock activities. Availability of poultry for sale varies, so please enquire for current stock.",
      ne: "यज्ञ कृषि उद्योगमा पोल्ट्री पालन अन्तर्गत नियमित सरसफाइ र खुवाइका साथ व्यवस्थित वातावरणमा मुर्गी पालिन्छ। पोल्ट्रीहरू फार्मको मिश्रित पशुपालन गतिविधिका अंगका रूपमा राखिन्छन्। बिक्रीका लागि पोल्ट्रीको उपलब्धता फरक हुन सक्छ, त्यसैले हालको स्टकका लागि सोधपुछ गर्नुहोस्।",
    },
    image: "assets/images/livestock/poultry.svg",
    gallery: [
      "assets/images/livestock/poultry.svg",
      "assets/images/gallery/farm-environment.svg",
    ],
    availability: "available",
    notes: {
      en: "Sample listing. Confirm current poultry stock directly with the farm.",
      ne: "नमूना सूची। हालको पोल्ट्री स्टक फार्मसँगै प्रत्यक्ष पुष्टि गर्नुहोस्।",
    },
    seo: {
      title: { en: "Poultry Farming — Yagya Krishi Udhyog", ne: "मुर्गी पालन — यज्ञ कृषि उद्योग" },
      description: {
        en: "Poultry and chicken farming at Yagya Krishi Udhyog. Learn about our poultry activities and enquire about stock.",
        ne: "यज्ञ कृषि उद्योगमा मुर्गी पालन। हाम्रा पोल्ट्री गतिविधिबारे जान्नुहोस् र स्टकका लागि सोधपुछ गर्नुहोस्।",
      },
    },
  },
];
