// RailBite Comprehensive Indian Railway Mock Data & Menu Registry

export const TRAINS = [
  {
    train_no: "12951",
    name: "Mumbai Central - New Delhi Rajdhani Express",
    train_type: "Superfast Rajdhani Express",
    source_station_code: "MMCT",
    source_station_name: "Mumbai Central",
    dest_station_code: "NDLS",
    dest_station_name: "New Delhi",
    departure_time: "17:00",
    arrival_time: "08:32",
    duration: "15h 32m",
    speed_kmh: 130,
    coaches_available: ["1A", "2A", "3A", "3E"],
    running_days: ["Daily"],
    rating: 4.8,
    schedules: [
      { station_code: "MMCT", station_name: "Mumbai Central", arrival: "--:--", departure: "17:00", halt_mins: 0, platform: "1", distance_km: 0, eligible: false },
      { station_code: "BVI", station_name: "Borivali", arrival: "17:22", departure: "17:24", halt_mins: 2, platform: "6", distance_km: 30, eligible: false },
      { station_code: "ST", station_name: "Surat", arrival: "19:43", departure: "19:48", halt_mins: 5, platform: "1", distance_km: 263, eligible: true },
      { station_code: "BRC", station_name: "Vadodara Jn", arrival: "21:06", departure: "21:16", halt_mins: 10, platform: "2", distance_km: 392, eligible: true },
      { station_code: "RTM", station_name: "Ratlam Jn", arrival: "00:45", departure: "00:48", halt_mins: 3, platform: "4", distance_km: 653, eligible: true },
      { station_code: "KOTA", station_name: "Kota Jn", arrival: "03:15", departure: "03:20", halt_mins: 5, platform: "1A", distance_km: 920, eligible: true },
      { station_code: "MTJ", station_name: "Mathura Jn", arrival: "06:40", departure: "06:45", halt_mins: 5, platform: "3", distance_km: 1244, eligible: true },
      { station_code: "NDLS", station_name: "New Delhi", arrival: "08:32", departure: "--:--", halt_mins: 0, platform: "2", distance_km: 1384, eligible: false }
    ]
  },
  {
    train_no: "22436",
    name: "New Delhi - Varanasi Vande Bharat Express",
    train_type: "Semi-High Speed Vande Bharat",
    source_station_code: "NDLS",
    source_station_name: "New Delhi",
    dest_station_code: "BSB",
    dest_station_name: "Varanasi Jn",
    departure_time: "06:00",
    arrival_time: "14:00",
    duration: "8h 00m",
    speed_kmh: 140,
    coaches_available: ["EC", "CC"],
    running_days: ["Tue", "Wed", "Fri", "Sat", "Sun"],
    rating: 4.9,
    schedules: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "06:00", halt_mins: 0, platform: "16", distance_km: 0, eligible: false },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "10:08", departure: "10:10", halt_mins: 5, platform: "1", distance_km: 440, eligible: true },
      { station_code: "PRYJ", station_name: "Prayagraj Jn", arrival: "12:08", departure: "12:10", halt_mins: 5, platform: "6", distance_km: 635, eligible: true },
      { station_code: "BSB", station_name: "Varanasi Jn", arrival: "14:00", departure: "--:--", halt_mins: 0, platform: "1", distance_km: 759, eligible: false }
    ]
  },
  {
    train_no: "12002",
    name: "New Delhi - Bhopal Rani Kamalapati Shatabdi",
    train_type: "Superfast Shatabdi Express",
    source_station_code: "NDLS",
    source_station_name: "New Delhi",
    dest_station_code: "RKMP",
    dest_station_name: "Rani Kamalapati (Bhopal)",
    departure_time: "06:00",
    arrival_time: "14:40",
    duration: "8h 40m",
    speed_kmh: 120,
    coaches_available: ["EC", "CC"],
    running_days: ["Daily"],
    rating: 4.7,
    schedules: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "06:00", halt_mins: 0, platform: "1", distance_km: 0, eligible: false },
      { station_code: "MTJ", station_name: "Mathura Jn", arrival: "07:19", departure: "07:20", halt_mins: 3, platform: "1", distance_km: 141, eligible: true },
      { station_code: "AGC", station_name: "Agra Cantt", arrival: "07:50", departure: "07:55", halt_mins: 5, platform: "1", distance_km: 195, eligible: true },
      { station_code: "GWL", station_name: "Gwalior Jn", arrival: "09:23", departure: "09:28", halt_mins: 5, platform: "1", distance_km: 313, eligible: true },
      { station_code: "VGLJ", station_name: "V Lakshmibai Jhansi", arrival: "10:45", departure: "10:50", halt_mins: 5, platform: "2", distance_km: 410, eligible: true },
      { station_code: "BPL", station_name: "Bhopal Jn", arrival: "14:12", departure: "14:15", halt_mins: 3, platform: "1", distance_km: 701, eligible: true },
      { station_code: "RKMP", station_name: "Rani Kamalapati", arrival: "14:40", departure: "--:--", halt_mins: 0, platform: "1", distance_km: 707, eligible: false }
    ]
  },
  {
    train_no: "12628",
    name: "New Delhi - KSR Bengaluru Karnataka Express",
    train_type: "Superfast Express",
    source_station_code: "NDLS",
    source_station_name: "New Delhi",
    dest_station_code: "SBC",
    dest_station_name: "KSR Bengaluru",
    departure_time: "20:20",
    arrival_time: "12:00",
    duration: "39h 40m",
    speed_kmh: 85,
    coaches_available: ["1A", "2A", "3A", "SL"],
    running_days: ["Daily"],
    rating: 4.6,
    schedules: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "20:20", halt_mins: 0, platform: "3", distance_km: 0, eligible: false },
      { station_code: "AGC", station_name: "Agra Cantt", arrival: "22:48", departure: "22:50", halt_mins: 5, platform: "1", distance_km: 195, eligible: true },
      { station_code: "GWL", station_name: "Gwalior Jn", arrival: "00:46", departure: "00:48", halt_mins: 4, platform: "1", distance_km: 313, eligible: true },
      { station_code: "BPL", station_name: "Bhopal Jn", arrival: "06:25", departure: "06:30", halt_mins: 5, platform: "1", distance_km: 701, eligible: true },
      { station_code: "NGP", station_name: "Nagpur Jn", arrival: "12:50", departure: "12:55", halt_mins: 5, platform: "2", distance_km: 1091, eligible: true },
      { station_code: "BPQ", station_name: "Balharshah", arrival: "16:40", departure: "16:45", halt_mins: 5, platform: "1", distance_km: 1300, eligible: true },
      { station_code: "KZJ", station_name: "Kazipet Jn", arrival: "20:08", departure: "20:10", halt_mins: 4, platform: "2", distance_km: 1535, eligible: true },
      { station_code: "SBC", station_name: "KSR Bengaluru", arrival: "12:00", departure: "--:--", halt_mins: 0, platform: "1", distance_km: 2404, eligible: false }
    ]
  },
  {
    train_no: "12810",
    name: "Howrah - Mumbai CSMT Mail Express",
    train_type: "Mail Superfast",
    source_station_code: "HWH",
    source_station_name: "Howrah Jn",
    dest_station_code: "CSMT",
    dest_station_name: "Mumbai CSMT",
    departure_time: "20:05",
    arrival_time: "04:25",
    duration: "32h 20m",
    speed_kmh: 88,
    coaches_available: ["1A", "2A", "3A", "SL"],
    running_days: ["Daily"],
    rating: 4.5,
    schedules: [
      { station_code: "HWH", station_name: "Howrah Jn", arrival: "--:--", departure: "20:05", halt_mins: 0, platform: "19", distance_km: 0, eligible: false },
      { station_code: "KGP", station_name: "Kharagpur Jn", arrival: "21:45", departure: "21:50", halt_mins: 5, platform: "1", distance_km: 115, eligible: true },
      { station_code: "TATA", station_name: "Tatanagar Jn", arrival: "23:45", departure: "23:52", halt_mins: 7, platform: "3", distance_km: 249, eligible: true },
      { station_code: "ROU", station_name: "Rourkela Jn", arrival: "02:08", departure: "02:15", halt_mins: 7, platform: "1", distance_km: 414, eligible: true },
      { station_code: "BSP", station_name: "Bilaspur Jn", arrival: "06:55", departure: "07:10", halt_mins: 15, platform: "1", distance_km: 719, eligible: true },
      { station_code: "R", station_name: "Raipur Jn", arrival: "08:45", departure: "08:50", halt_mins: 5, platform: "1", distance_km: 830, eligible: true },
      { station_code: "NGP", station_name: "Nagpur Jn", arrival: "13:55", departure: "14:00", halt_mins: 5, platform: "3", distance_km: 1132, eligible: true },
      { station_code: "CSMT", station_name: "Mumbai CSMT", arrival: "04:25", departure: "--:--", halt_mins: 0, platform: "18", distance_km: 1968, eligible: false }
    ]
  },
  {
    train_no: "12259",
    name: "Sealdah - Bikaner AC Duronto Express",
    train_type: "AC Duronto Express",
    source_station_code: "SDAH",
    source_station_name: "Sealdah",
    dest_station_code: "BKN",
    dest_station_name: "Bikaner Jn",
    departure_time: "17:00",
    arrival_time: "18:20",
    duration: "25h 20m",
    speed_kmh: 110,
    coaches_available: ["1A", "2A", "3A"],
    running_days: ["Mon", "Wed", "Thu", "Sun"],
    rating: 4.8,
    schedules: [
      { station_code: "SDAH", station_name: "Sealdah", arrival: "--:--", departure: "17:00", halt_mins: 0, platform: "12", distance_km: 0, eligible: false },
      { station_code: "DHN", station_name: "Dhanbad Jn", arrival: "20:50", departure: "20:55", halt_mins: 5, platform: "2", distance_km: 266, eligible: true },
      { station_code: "DDU", station_name: "Pt. Deen Dayal Upadhyaya", arrival: "01:25", departure: "01:35", halt_mins: 10, platform: "4", distance_km: 672, eligible: true },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "05:30", departure: "05:35", halt_mins: 5, platform: "1", distance_km: 1019, eligible: true },
      { station_code: "NDLS", station_name: "New Delhi", arrival: "11:00", departure: "11:15", halt_mins: 15, platform: "7", distance_km: 1459, eligible: true },
      { station_code: "BKN", station_name: "Bikaner Jn", arrival: "18:20", departure: "--:--", halt_mins: 0, platform: "1", distance_km: 1916, eligible: false }
    ]
  }
];

export const STATIONS = [
  { code: "ST", name: "Surat", city: "Surat", state: "Gujarat", platforms: 4, icon: "🏭" },
  { code: "BRC", name: "Vadodara Jn", city: "Vadodara", state: "Gujarat", platforms: 7, icon: "🏛️" },
  { code: "KOTA", name: "Kota Jn", city: "Kota", state: "Rajasthan", platforms: 4, icon: "📚" },
  { code: "RTM", name: "Ratlam Jn", city: "Ratlam", state: "Madhya Pradesh", platforms: 7, icon: "🚂" },
  { code: "MTJ", name: "Mathura Jn", city: "Mathura", state: "Uttar Pradesh", platforms: 9, icon: "🛕" },
  { code: "AGC", name: "Agra Cantt", city: "Agra", state: "Uttar Pradesh", platforms: 6, icon: "🕌" },
  { code: "GWL", name: "Gwalior Jn", city: "Gwalior", state: "Madhya Pradesh", platforms: 5, icon: "🏰" },
  { code: "BPL", name: "Bhopal Jn", city: "Bhopal", state: "Madhya Pradesh", platforms: 6, icon: "🌊" },
  { code: "CNB", name: "Kanpur Central", city: "Kanpur", state: "Uttar Pradesh", platforms: 10, icon: "🏭" },
  { code: "PRYJ", name: "Prayagraj Jn", city: "Prayagraj", state: "Uttar Pradesh", platforms: 10, icon: "🕉️" },
  { code: "NGP", name: "Nagpur Jn", city: "Nagpur", state: "Maharashtra", platforms: 8, icon: "🍊" },
  { code: "DDU", name: "Pt. Deen Dayal Upadhyaya", city: "Mughalsarai", state: "Uttar Pradesh", platforms: 8, icon: "🛤️" }
];

export const RESTAURANTS = [
  {
    id: "rest_1",
    name: "Haldiram's Express",
    station_codes: ["ST", "BRC", "KOTA", "AGC", "CNB", "MTJ"],
    cuisine: "North Indian, Thali, Snacks & Sweets",
    rating: 4.7,
    reviews_count: 1420,
    delivery_time: "15-20 min before arrival",
    min_order: 149,
    is_pure_veg: true,
    fssai_no: "10014011001890",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    badge: "IRCTC Top Seller",
    prep_time: "12 mins"
  },
  {
    id: "rest_2",
    name: "Domino's Pizza Train Delivery",
    station_codes: ["ST", "BRC", "KOTA", "AGC", "BPL", "CNB", "NGP", "MTJ"],
    cuisine: "Pizzas, Garlic Bread, Pasta, Desserts",
    rating: 4.6,
    reviews_count: 2890,
    delivery_time: "Guaranteed Hot at Coach Gate",
    min_order: 199,
    is_pure_veg: false,
    fssai_no: "10017011004123",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80",
    badge: "Official Brand Partner",
    prep_time: "15 mins"
  },
  {
    id: "rest_3",
    name: "Behrouz Royal Biryani",
    station_codes: ["ST", "BRC", "KOTA", "BPL", "CNB", "NGP"],
    cuisine: "Royal Hyderabadi & Awadhi Biryanis, Kebabs",
    rating: 4.8,
    reviews_count: 1950,
    delivery_time: "Delivered in Royal Insulated Box",
    min_order: 249,
    is_pure_veg: false,
    fssai_no: "10019022009845",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
    badge: "Gourmet Certified",
    prep_time: "18 mins"
  },
  {
    id: "rest_4",
    name: "Saravana Bhavan South Express",
    station_codes: ["ST", "BRC", "NGP", "BPL"],
    cuisine: "Authentic South Indian, Dosa, Idli, Filter Coffee",
    rating: 4.9,
    reviews_count: 2100,
    delivery_time: "Freshly Steamed & Packed",
    min_order: 120,
    is_pure_veg: true,
    fssai_no: "10013042001156",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
    badge: "100% Pure Veg",
    prep_time: "10 mins"
  },
  {
    id: "rest_5",
    name: "Faasos Rolls & Bowls",
    station_codes: ["KOTA", "ST", "BRC", "AGC", "CNB"],
    cuisine: "Wraps, Meal Bowls, Biryani & Beverages",
    rating: 4.5,
    reviews_count: 980,
    delivery_time: "Spill-Proof Warm Packaging",
    min_order: 149,
    is_pure_veg: false,
    fssai_no: "10018021003456",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80",
    badge: "Quick Bite Special",
    prep_time: "10 mins"
  },
  {
    id: "rest_6",
    name: "Bikanervala Heritage Kitchen",
    station_codes: ["MTJ", "AGC", "KOTA", "CNB"],
    cuisine: "Rajasthani Thalis, Dal Baati, Sweets, Chaat",
    rating: 4.7,
    reviews_count: 1350,
    delivery_time: "15 min prior to arrival",
    min_order: 150,
    is_pure_veg: true,
    fssai_no: "10016011002234",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    badge: "Jain Food Specialist",
    prep_time: "15 mins"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Delights", icon: "✨" },
  { id: "thali", name: "Royal Thalis", icon: "🍱" },
  { id: "biryani", name: "Biryani & Rice", icon: "🍚" },
  { id: "pizza", name: "Pizza & Fast Food", icon: "🍕" },
  { id: "south_indian", name: "South Indian", icon: "🥞" },
  { id: "north_indian", name: "North Indian Gravies", icon: "🥘" },
  { id: "jain", name: "Jain & Satvik", icon: "🌿" },
  { id: "snacks", name: "Chaat & Starters", icon: "🥟" },
  { id: "beverages", name: "Chai & Drinks", icon: "☕" },
  { id: "dessert", name: "Desserts & Sweets", icon: "🍧" }
];

export const MENU_ITEMS = [
  {
    id: "dish_1",
    restaurant_id: "rest_1",
    name: "Royal Maharaja Special Veg Thali",
    category: "thali",
    price: 249,
    rating: 4.9,
    reviews_count: 850,
    dietary: "veg", // veg | non-veg | jain | egg
    is_jain_available: true,
    spice_level: 2, // 1: Mild, 2: Medium, 3: Spicy
    calories: "680 kcal",
    portion: "Serves 1-2 (Full Meal Box)",
    description: "Paneer Butter Masala, Dal Makhani, Seasonal Subzi, 4 Butter Phulkas, Jeera Rice, Gulab Jamun, Papad, Raita & Pickle in a spill-proof tray.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Butter Roti (2 pcs)", price: 35 },
      { name: "Upgrade to Garlic Naan", price: 40 },
      { name: "Extra Gulab Jamun (2 pcs)", price: 45 },
      { name: "Jain Preparation (No Onion / Garlic)", price: 0 }
    ]
  },
  {
    id: "dish_2",
    restaurant_id: "rest_3",
    name: "Shahi Dum Gosht Biryani (Mutton)",
    category: "biryani",
    price: 369,
    rating: 4.9,
    reviews_count: 620,
    dietary: "nonveg",
    is_jain_available: false,
    spice_level: 3,
    calories: "740 kcal",
    portion: "Serves 1 (500g Handi Box)",
    description: "Tender pieces of succulent mutton marinated in royal Awadhi spices, layered with aromatic long-grain basmati rice and slow-cooked in sealed handi. Served with Mirchi ka Salan & Burani Raita.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Boiled Egg", price: 20 },
      { name: "Extra Burani Raita", price: 30 },
      { name: "Shahi Tukda Dessert", price: 60 }
    ]
  },
  {
    id: "dish_3",
    restaurant_id: "rest_3",
    name: "Zaikedaar Paneer Dum Biryani",
    category: "biryani",
    price: 269,
    rating: 4.8,
    reviews_count: 510,
    dietary: "veg",
    is_jain_available: true,
    spice_level: 2,
    calories: "590 kcal",
    portion: "Serves 1 (500g)",
    description: "Fresh cottage cheese cubes spiced with roasted whole spices and layered with fragrant saffron basmati rice. Accompanied by mint raita & salan.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Paneer Cubes (4 pcs)", price: 50 },
      { name: "Extra Mint Raita", price: 25 },
      { name: "Jain Preparation", price: 0 }
    ]
  },
  {
    id: "dish_4",
    restaurant_id: "rest_2",
    name: "Farmhouse Cheese Burst Pizza (Medium)",
    category: "pizza",
    price: 389,
    rating: 4.7,
    reviews_count: 940,
    dietary: "veg",
    is_jain_available: false,
    spice_level: 1,
    calories: "820 kcal",
    portion: "6 Slices (Serves 2)",
    description: "Loaded with crisp capsicum, juicy tomatoes, grilled mushrooms and golden corn with molten mozzarella oozing from the crust.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Stuffed Garlic Breadsticks", price: 119 },
      { name: "Cheesy Dip Cup", price: 30 },
      { name: "Choco Lava Cake", price: 99 },
      { name: "Pepsi 500ml Can", price: 50 }
    ]
  },
  {
    id: "dish_5",
    restaurant_id: "rest_2",
    name: "Non-Veg Supreme Pizza + Chicken Wings",
    category: "pizza",
    price: 459,
    rating: 4.8,
    reviews_count: 730,
    dietary: "nonveg",
    is_jain_available: false,
    spice_level: 2,
    calories: "910 kcal",
    portion: "Medium Pizza + 4 Wings",
    description: "Loaded with herb grilled chicken, peri-peri chicken chunks, spicy chicken sausage, black olives, onions and melted cheese.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    is_bestseller: false,
    customizations: [
      { name: "Extra Cheese Topping", price: 60 },
      { name: "Spicy Peri Peri Dip", price: 35 },
      { name: "Red Bull Energy Drink", price: 125 }
    ]
  },
  {
    id: "dish_6",
    restaurant_id: "rest_4",
    name: "Masala Dosa with Ghee Roast & 3 Chutneys",
    category: "south_indian",
    price: 139,
    rating: 4.9,
    reviews_count: 1120,
    dietary: "veg",
    is_jain_available: true,
    spice_level: 2,
    calories: "420 kcal",
    portion: "1 Jumbo Dosa + 200ml Sambar",
    description: "Crispy golden crepe smeared with pure aromatic desi ghee, stuffed with spiced potato masala. Served with piping hot drumstick sambar, coconut chutney, tomato chutney & coriander chutney.",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Crispy Medu Vada (1 pc)", price: 35 },
      { name: "Authentic Filter Kaapi Flask (200ml)", price: 45 },
      { name: "Jain Potato-Free Masala (Raw Banana)", price: 0 }
    ]
  },
  {
    id: "dish_7",
    restaurant_id: "rest_4",
    name: "Steamed Button Idli (4 pcs) + Medu Vada (2 pcs) Platter",
    category: "south_indian",
    price: 129,
    rating: 4.8,
    reviews_count: 890,
    dietary: "veg",
    is_jain_available: true,
    spice_level: 1,
    calories: "360 kcal",
    portion: "4 Idlis + 2 Vadas",
    description: "Ultra-soft melt-in-mouth steamed rice idlis paired with crunchy golden medu vadas, served with steaming sambar and fresh coconut chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    is_bestseller: false,
    customizations: [
      { name: "Ghee Podi Sprinkle", price: 25 },
      { name: "Extra Sambar Bowl", price: 20 },
      { name: "Filter Coffee", price: 45 }
    ]
  },
  {
    id: "dish_8",
    restaurant_id: "rest_1",
    name: "Paneer Lababdar with 3 Lachha Parathas",
    category: "north_indian",
    price: 219,
    rating: 4.7,
    reviews_count: 420,
    dietary: "veg",
    is_jain_available: true,
    spice_level: 2,
    calories: "620 kcal",
    portion: "Serves 1",
    description: "Charred paneer cubes cooked in a rich, creamy tomato and cashew nut gravy, garnished with grated cheese and fresh coriander. Served with 3 multi-layered flaky whole wheat parathas.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    is_bestseller: false,
    customizations: [
      { name: "Extra Lachha Paratha", price: 30 },
      { name: "Boondi Raita Cup", price: 35 },
      { name: "Sweet Lassi (300ml)", price: 55 }
    ]
  },
  {
    id: "dish_9",
    restaurant_id: "rest_5",
    name: "Double Paneer Overload Tikka Wrap",
    category: "snacks",
    price: 159,
    rating: 4.6,
    reviews_count: 590,
    dietary: "veg",
    is_jain_available: false,
    spice_level: 2,
    calories: "450 kcal",
    portion: "1 Jumbo Wrap",
    description: "Generous chunks of smoky tandoori paneer tossed in chipotle mint mayo and pickled crunchy onions, wrapped in a soft flaky paratha.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Add Melting Cheese Slice", price: 25 },
      { name: "Masala French Fries Box", price: 69 },
      { name: "Thums Up 300ml Can", price: 40 }
    ]
  },
  {
    id: "dish_10",
    restaurant_id: "rest_5",
    name: "Classic Chicken Bhuna Jumbo Roll",
    category: "snacks",
    price: 179,
    rating: 4.7,
    reviews_count: 640,
    dietary: "nonveg",
    is_jain_available: false,
    spice_level: 3,
    calories: "510 kcal",
    portion: "1 Jumbo Roll",
    description: "Slow-cooked spicy bhuna chicken folded with egg coating inside a golden crisp paratha with spicy green chutney and lemon drizzle.",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Chicken Chunks", price: 45 },
      { name: "Extra Egg Coating", price: 20 },
      { name: "Cold Coffee Shake", price: 79 }
    ]
  },
  {
    id: "dish_11",
    restaurant_id: "rest_6",
    name: "Pure Satvik Jain Special Thali (No Onion/Garlic)",
    category: "jain",
    price: 239,
    rating: 4.9,
    reviews_count: 780,
    dietary: "jain",
    is_jain_available: true,
    spice_level: 1,
    calories: "580 kcal",
    portion: "Full Satvik Meal Tray",
    description: "Strict 100% Jain preparation: Paneer Malai Kofta (no root veggies), Desi Moong Dal, Lauki Chana Dal, 4 Tawa Rotis with pure cow ghee, Saffron Jeera Rice, Sweet Rasgulla & Roasted Papad.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Tawa Roti with Ghee (2 pcs)", price: 25 },
      { name: "Jain Curd / Dahi Cup", price: 30 },
      { name: "Special Jain Kesar Peda (2 pcs)", price: 45 }
    ]
  },
  {
    id: "dish_12",
    restaurant_id: "rest_1",
    name: "Kulhad Masala Chai Flask (Serves 3) + Samosas (2 pcs)",
    category: "beverages",
    price: 99,
    rating: 4.8,
    reviews_count: 1450,
    dietary: "veg",
    is_jain_available: false,
    spice_level: 1,
    calories: "320 kcal",
    portion: "400ml Thermal Flask + 2 Crispy Samosas",
    description: "Freshly brewed adrak-elaichi railway special masala chai packed in heat-retaining thermal flask. Comes with 2 golden flaky potato-pea samosas with tamarind chutney.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Samosa (2 pcs)", price: 40 },
      { name: "Jalebi (100g hot & crisp)", price: 50 },
      { name: "No Sugar Chai Request", price: 0 }
    ]
  },
  {
    id: "dish_13",
    restaurant_id: "rest_6",
    name: "Hot Gulab Jamun with Rabri (2 pcs)",
    category: "dessert",
    price: 89,
    rating: 4.9,
    reviews_count: 530,
    dietary: "veg",
    is_jain_available: true,
    spice_level: 1,
    calories: "340 kcal",
    portion: "2 Pieces with Creamy Rabri",
    description: "Soft melt-in-mouth khoya gulab jamuns dunked in rose-saffron cardamom syrup, topped with thick malai rabri and pistachios.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    is_bestseller: false,
    customizations: [
      { name: "Add 1 Extra Jamun", price: 30 }
    ]
  },
  {
    id: "dish_14",
    restaurant_id: "rest_1",
    name: "Amritsari Chole Bhature (2 pcs)",
    category: "north_indian",
    price: 169,
    rating: 4.8,
    reviews_count: 670,
    dietary: "veg",
    is_jain_available: false,
    spice_level: 3,
    calories: "650 kcal",
    portion: "2 Fluffy Bhaturas + Chole Bowl",
    description: "Spicy dark Amritsari pindi chole simmered in rich Punjabi spices, served with 2 balloon bhaturas, pickled green chillies, onions and mint chutney.",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
    is_bestseller: true,
    customizations: [
      { name: "Extra Bhatura (1 pc)", price: 45 },
      { name: "Punjabi Sweet Lassi", price: 55 }
    ]
  }
];

export const COUPONS = [
  {
    code: "RAILBITE50",
    discount: 50,
    type: "flat",
    min_order: 299,
    description: "₹50 FLAT off on orders above ₹299",
    tag: "POPULAR"
  },
  {
    code: "FIRSTMEAL",
    discount: 20,
    type: "percentage",
    max_discount: 100,
    min_order: 199,
    description: "20% OFF up to ₹100 for your first train food order",
    tag: "NEW USER"
  },
  {
    code: "VANDE100",
    discount: 100,
    type: "flat",
    min_order: 499,
    description: "₹100 FLAT off on orders above ₹499",
    tag: "SPECIAL"
  },
  {
    code: "FREECHAI",
    discount: 40,
    type: "flat",
    min_order: 249,
    description: "Free Chai Discount (₹40 OFF on any order over ₹249)",
    tag: "INSTANT"
  }
];

export const MOCK_PNRS = {
  "8429104820": {
    pnr: "8429104820",
    train_no: "12951",
    train_name: "Mumbai Central - New Delhi Rajdhani Express",
    passenger_name: "Aakash Sharma",
    phone: "9876543210",
    email: "aakash.sharma@example.com",
    coach: "B4",
    berth: "42",
    berth_type: "Lower Berth",
    boarding: "MMCT",
    destination: "NDLS",
    date_of_journey: "2026-08-26",
    status: "CNF / B4-42"
  },
  "4521908731": {
    pnr: "4521908731",
    train_no: "22436",
    train_name: "New Delhi - Varanasi Vande Bharat Express",
    passenger_name: "Priya Sundaram",
    phone: "9811223344",
    email: "priya.s@example.com",
    coach: "C2",
    berth: "18",
    berth_type: "Window Seat",
    boarding: "NDLS",
    destination: "BSB",
    date_of_journey: "2026-08-26",
    status: "CNF / C2-18"
  },
  "6214589023": {
    pnr: "6214589023",
    train_no: "12002",
    train_name: "New Delhi - Bhopal Shatabdi Express",
    passenger_name: "Vikram Malhotra",
    phone: "9988776655",
    email: "vikram.m@example.com",
    coach: "EC",
    berth: "08",
    berth_type: "Aisle Seat",
    boarding: "NDLS",
    destination: "RKMP",
    date_of_journey: "2026-08-26",
    status: "CNF / EC-08"
  }
};
