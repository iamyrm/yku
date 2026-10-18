/* ==========================================================================
   Crops and seasonal produce data
   --------------------------------------------------------------------------
   PLACEHOLDER CONTENT: planting and harvest periods below are indicative
   sample information for demonstrating the layout. Seasonal cycles change
   every year and actual availability must be confirmed with the farm.

   Seasons: spring | summer | monsoon | autumn | winter
   A crop may carry more than one season tag.

   WordPress mapping: custom post type "crop" with taxonomies "crop_category"
   and "season".
   ========================================================================== */

window.YK_SEASONS = [
  { key: "spring", label: { en: "Spring", ne: "वसन्त ऋतु" } },
  { key: "summer", label: { en: "Summer", ne: "ग्रीष्म ऋतु" } },
  { key: "monsoon", label: { en: "Monsoon", ne: "वर्षा ऋतु" } },
  { key: "autumn", label: { en: "Autumn", ne: "शरद ऋतु" } },
  { key: "winter", label: { en: "Winter", ne: "हेमन्त ऋतु" } },
];

window.YK_CROP_CATEGORIES = [
  { key: "cereals", label: { en: "Cereals", ne: "अन्नबाली" } },
  { key: "oilseeds", label: { en: "Oilseeds", ne: "तेलहन बाली" } },
  { key: "vegetables", label: { en: "Vegetables", ne: "तरकारी बाली" } },
];

window.YK_CROPS = [
  {
    id: "crop-001",
    slug: "rice",
    name: { en: "Rice", ne: "धान" },
    categoryKey: "cereals",
    category: { en: "Cereals", ne: "अन्नबाली" },
    seasons: ["monsoon"],
    plantingPeriod: { en: "June – July (indicative)", ne: "जेठ – साउन (सांकेतिक)" },
    harvestPeriod: { en: "October – November (indicative)", ne: "असोज – कात्तिक (सांकेतिक)" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "Rice is the main monsoon-season crop cultivated on a seasonal cycle at Yagya Krishi Udhyog. Planting and harvesting follow the annual rainfall pattern, so paddy and rice availability changes through the year. Current stock and any produce for sale are confirmed directly on enquiry.",
      ne: "धान यज्ञ कृषि उद्योगमा मौसमअनुसार खेतिने मुख्य वर्षा ऋतुको बाली हो। रोपाइँ र कटान वार्षिक वर्षाअनुसार हुने हुँदा धान र चामलको उपलब्धता वर्षभरि परिवर्तन हुन्छ। हालको स्टक र बिक्रीका लागि उपलब्ध उपज सोधपुछ गर्दा प्रत्यक्ष पुष्टि गरिन्छ।",
    },
    image: "assets/images/crops/rice.svg",
    gallery: ["assets/images/crops/rice.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Rice Cultivation — Yagya Krishi Udhyog", ne: "धान खेती — यज्ञ कृषि उद्योग" },
      description: {
        en: "Monsoon rice cultivation at Yagya Krishi Udhyog. Seasonal crop information and produce enquiries.",
        ne: "यज्ञ कृषि उद्योगमा वर्षा ऋतुको धान खेती। मौसमी बाली जानकारी र उपज सम्बन्धी सोधपुछ।",
      },
    },
  },
  {
    id: "crop-002",
    slug: "wheat",
    name: { en: "Wheat", ne: "गहुँ" },
    categoryKey: "cereals",
    category: { en: "Cereals", ne: "अन्नबाली" },
    seasons: ["winter"],
    plantingPeriod: { en: "October – November (indicative)", ne: "असोज – कात्तिक (सांकेतिक)" },
    harvestPeriod: { en: "March – April (indicative)", ne: "चैत – वैशाख (सांकेतिक)" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "Wheat is grown as a winter-season crop, following the rice cycle on the farm's seasonal calendar. Harvest timing and produce availability depend on the year's conditions; ask us what is currently in store before planning a purchase.",
      ne: "गहुँ फार्मको मौसमी तालिकाअनुसार धानपछि हेमन्त ऋतुको बालीका रूपमा लगाइन्छ। कटानको समय र उपजको उपलब्धता त्यस वर्षको अवस्थामा निर्भर हुन्छ; खरिद योजना बनाउनुअघि अहिले के भण्डारमा छ भनी सोध्नुहोस्।",
    },
    image: "assets/images/crops/wheat.svg",
    gallery: ["assets/images/crops/wheat.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Wheat Cultivation — Yagya Krishi Udhyog", ne: "गहुँ खेती — यज्ञ कृषि उद्योग" },
      description: {
        en: "Winter wheat cultivation at Yagya Krishi Udhyog. Seasonal information and produce enquiries.",
        ne: "यज्ञ कृषि उद्योगमा हेमन्त ऋतुको गहुँ खेती। मौसमी जानकारी र उपज सम्बन्धी सोधपुछ।",
      },
    },
  },
  {
    id: "crop-003",
    slug: "maize",
    name: { en: "Maize", ne: "मकै" },
    categoryKey: "cereals",
    category: { en: "Cereals", ne: "अन्नबाली" },
    seasons: ["spring", "autumn"],
    plantingPeriod: { en: "March – April, or July – August (indicative)", ne: "चैत – वैशाख वा साउन – भदौ (सांकेतिक)" },
    harvestPeriod: { en: "June – July, or October – November (indicative)", ne: "जेठ – साउन वा असोज – कात्तिक (सांकेतिक)" },
    availability: "available",
    placeholder: true,
    description: {
      en: "Maize is cultivated in more than one window across the year, which makes it one of the more regularly available crops on the farm. Actual cob and grain availability is confirmed per season — please enquire for current produce.",
      ne: "मकै वर्षको विभिन्न समयमा लगाइने हुँदा यो फार्ममा नियमित रूपमा उपलब्ध हुने बालीहरूमध्ये एक हो। भुट्टा र दानाको वास्तविक उपलब्धता मौसमअनुसार पुष्टि गरिन्छ — हालको उपजका लागि सोधपुछ गर्नुहोस्।",
    },
    image: "assets/images/crops/maize.svg",
    gallery: ["assets/images/crops/maize.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Maize Cultivation — Yagya Krishi Udhyog", ne: "मकै खेती — यज्ञ कृषि उद्योग" },
      description: {
        en: "Maize cultivation across seasons at Yagya Krishi Udhyog. Crop information and produce enquiries.",
        ne: "यज्ञ कृषि उद्योगमा विभिन्न मौसममा मकै खेती। बाली जानकारी र उपज सम्बन्धी सोधपुछ।",
      },
    },
  },
  {
    id: "crop-004",
    slug: "potato",
    name: { en: "Potato", ne: "आलु" },
    categoryKey: "vegetables",
    category: { en: "Vegetables", ne: "तरकारी बाली" },
    seasons: ["winter"],
    plantingPeriod: { en: "September – October (indicative)", ne: "भदौ – असोज (सांकेतिक)" },
    harvestPeriod: { en: "January – February (indicative)", ne: "माघ – फागुन (सांकेतिक)" },
    availability: "available",
    placeholder: true,
    description: {
      en: "Potato is the farm's main winter vegetable crop, planted after the monsoon and harvested before spring. Availability of produce for sale varies with the harvest, so contact us for what is on hand right now.",
      ne: "आलु फार्मको मुख्य हेमन्त ऋतुको तरकारी बाली हो, जुन वर्षापछि रोपेर वसन्तअघि कटान गरिन्छ। बिक्रीका लागि उपजको उपलब्धता कटानअनुसार फरक हुन्छ, अहिले के छ जान्न हामसँग सम्पर्क गर्नुहोस्।",
    },
    image: "assets/images/crops/potato.svg",
    gallery: ["assets/images/crops/potato.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Potato Cultivation — Yagya Krishi Udhyog", ne: "आलु खेती — यज्ञ कृषि उद्योग" },
      description: {
        en: "Winter potato cultivation at Yagya Krishi Udhyog. Seasonal crop details and produce enquiries.",
        ne: "यज्ञ कृषि उद्योगमा हेमन्त ऋतुको आलु खेती। मौसमी बाली विवरण र उपज सम्बन्धी सोधपुछ।",
      },
    },
  },
  {
    id: "crop-005",
    slug: "mustard",
    name: { en: "Mustard", ne: "तोरी" },
    categoryKey: "oilseeds",
    category: { en: "Oilseeds", ne: "तेलहन बाली" },
    seasons: ["winter"],
    plantingPeriod: { en: "October – November (indicative)", ne: "असोज – कात्तिक (सांकेतिक)" },
    harvestPeriod: { en: "March – April (indicative)", ne: "चैत – वैशाख (सांकेतिक)" },
    availability: "seasonal",
    placeholder: true,
    description: {
      en: "Mustard is grown as an oilseed crop during the winter season and is part of the farm's crop rotation. Seed and produce availability is seasonal; enquire for details of the current harvest.",
      ne: "तोरी हेमन्त ऋतुमा तेलहन बालीका रूपमा लगाइने र फार्मको बाली फेरिको अंग हो। बीउ र उपजको उपलब्धता मौसमी हुन्छ; हालको कटानको विवरणका लागि सोधपुछ गर्नुहोस्।",
    },
    image: "assets/images/crops/mustard.svg",
    gallery: ["assets/images/crops/mustard.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Mustard Cultivation — Yagya Krishi Udhyog", ne: "तोरी खेती — यज्ञ कृषि उद्योग" },
      description: {
        en: "Winter mustard cultivation at Yagya Krishi Udhyog. Oilseed crop information and enquiries.",
        ne: "यज्ञ कृषि उद्योगमा हेमन्त ऋतुको तोरी खेती। तेलहन बाली जानकारी र सोधपुछ।",
      },
    },
  },
  {
    id: "crop-006",
    slug: "seasonal-vegetables",
    name: { en: "Seasonal Vegetables", ne: "मौसमी तरकारी" },
    categoryKey: "vegetables",
    category: { en: "Vegetables", ne: "तरकारी बाली" },
    seasons: ["spring", "autumn", "winter"],
    plantingPeriod: { en: "Updated with each planting cycle", ne: "हरेक रोपाइँ चक्रसँगै अद्यावधिक" },
    harvestPeriod: { en: "Updated with each harvest cycle", ne: "हरेक कटान चक्रसँगै अद्यावधिक" },
    availability: "coming_soon",
    placeholder: true,
    description: {
      en: "A rotating selection of seasonal vegetables grown according to the planting calendar. The specific vegetables, their growing stages and availability are published as each cycle begins — contact us to learn what is currently in the field.",
      ne: "रोपाइँ पात्रोअनुसार लगाइने विभिन्न मौसमी तरकारीहरूको परिवर्तनशील सूची। निश्चित तरकारी, तिनको बढ्दो अवस्था र उपलब्धता चक्र सुरु भएपछि प्रकाशित गरिन्छ — अहिले खेतमा के छ जान्न हामसँग सम्पर्क गर्नुहोस्।",
    },
    image: "assets/images/crops/vegetables.svg",
    gallery: ["assets/images/crops/vegetables.svg", "assets/images/crops/field.svg"],
    seo: {
      title: { en: "Seasonal Vegetables — Yagya Krishi Udhyog", ne: "मौसमी तरकारी — यज्ञ कृषि उद्योग" },
      description: {
        en: "Seasonal vegetables grown by Yagya Krishi Udhyog according to the planting calendar.",
        ne: "यज्ञ कृषि उद्योगले रोपाइँ पात्रोअनुसार लगाउने मौसमी तरकारी।",
      },
    },
  },
];
