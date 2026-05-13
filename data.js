// Kornuty.sk product catalog
// Prices in € per 100g (or per 10g for freeze-dried fruit)

if (typeof window !== 'undefined') {
  window.CATALOG = {
  ovocie: {
    id: 'ovocie',
    name: 'Sušené ovocie',
    short: 'Ovocie',
    unit: 100,
    items: [
      { id: 'ananas', name: 'Ananás kandizovaný', price: 1.79, color: '#F8D77E', icon: '🍍' },
      { id: 'banan_chips', name: 'Banánové chipsy', price: 1.10, color: '#F2D26B', icon: '🍌' },
      { id: 'brusnice', name: 'Brusnice sušené', price: 1.90, color: '#C84A4A', icon: '🫐' },
      { id: 'datle', name: 'Ďatle', price: 1.30, color: '#7A4A2A', icon: '📅' },
      { id: 'figy', name: 'Figy sušené', price: 2.10, color: '#8B4567', icon: '🫐' },
      { id: 'goji', name: 'Goji', price: 2.70, color: '#E8623D', icon: '🍓' },
      { id: 'hrozno_zlate', name: 'Hrozienka zlaté JUMBO', price: 1.60, color: '#D4A857', icon: '🍇' },
      { id: 'hrozno_sult', name: 'Hrozienka Sultánky', price: 1.00, color: '#5A3A2A', icon: '🍇' },
      { id: 'ibistek', name: 'Kandizovaný ibištek', price: 2.75, color: '#C04A6A', icon: '🌸' },
      { id: 'kokos_chips', name: 'Kokosové chipsy', price: 1.30, color: '#F4ECD8', icon: '🥥' },
      { id: 'marhule_nes', name: 'Marhule nesýrené', price: 3.10, color: '#D9924A', icon: '🟠' },
      { id: 'marhule', name: 'Marhule sušené', price: 2.80, color: '#E8A65C', icon: '🟠' },
      { id: 'papaja', name: 'Papája kandizovaná', price: 1.70, color: '#F39E5C', icon: '🧡' },
      { id: 'slivka', name: 'Slivka sušená', price: 1.90, color: '#4A2A4A', icon: '🟣' },
      { id: 'zazvor', name: 'Zázvor kandizovaný', price: 1.60, color: '#E8C57A', icon: '🟡' },
      { id: 'cerne', name: 'Čerešne sladené', price: 2.25, color: '#A02844', icon: '🍒' },
    ],
  },
  orechy: {
    id: 'orechy',
    name: 'Orechy',
    short: 'Orechy',
    unit: 100,
    items: [
      { id: 'arasid', name: 'Arašidy', price: 1.00, color: '#C89870', icon: '🥜' },
      { id: 'kesu', name: 'Kešu', price: 2.20, color: '#E8D7B0', icon: '🥜' },
      { id: 'lieskove', name: 'Lieskové orechy', price: 3.20, color: '#9A6A3A', icon: '🌰' },
      { id: 'makadam', name: 'Makadámové orechy', price: 4.50, color: '#F0E2C0', icon: '🌰' },
      { id: 'mandle', name: 'Mandle', price: 2.00, color: '#D4A878', icon: '🌰' },
      { id: 'mandle_b', name: 'Mandle blanžírované', price: 2.20, color: '#EFD9B4', icon: '🌰' },
      { id: 'para', name: 'Para orechy', price: 4.90, color: '#A57850', icon: '🌰' },
      { id: 'pekan', name: 'Pekanové orechy', price: 3.90, color: '#8A5530', icon: '🌰' },
      { id: 'pinia', name: 'Píniové oriešky', price: 7.90, color: '#E0CD9C', icon: '🌲' },
      { id: 'pistacie', name: 'Pistácie solené', price: 2.80, color: '#A8B868', icon: '🌰' },
      { id: 'vlasske', name: 'Vlašské orechy', price: 1.70, color: '#B08858', icon: '🌰' },
    ],
  },
  cokolada: {
    id: 'cokolada',
    name: 'Čokoládové',
    short: 'Čokoláda',
    unit: 100,
    items: [
      { id: 'arasid_ml', name: 'Arašidy v mliečnej čokoláde', price: 1.90, color: '#7A4A2A', icon: '🍫' },
      { id: 'arasid_jog', name: 'Arašidy v jogurte', price: 1.65, color: '#F4EAD8', icon: '🍫' },
      { id: 'brusn_h', name: 'Brusnice v horkej čokoláde', price: 2.80, color: '#3A1A1A', icon: '🍫' },
      { id: 'cokoocka', name: 'Čokoočká', price: 2.65, color: '#5A2A2A', icon: '🍫' },
      { id: 'hrozno_jog', name: 'Hrozienka v jogurte', price: 1.85, color: '#F0E4D0', icon: '🍫' },
      { id: 'hrozno_ml', name: 'Hrozienka v mliečnej čokoláde', price: 2.10, color: '#6A3A2A', icon: '🍫' },
      { id: 'kavove', name: 'Kávové hrudky', price: 1.55, color: '#3A2218', icon: '☕' },
      { id: 'kesu_h', name: 'Kešu v horkej čokoláde', price: 3.20, color: '#3A2218', icon: '🍫' },
      { id: 'liesk_ml', name: 'Lieskovce v mliečnej čokoláde', price: 3.10, color: '#7A4A2A', icon: '🍫' },
      { id: 'liesk_sk', name: 'Lieskovce v mliečnej čokoláde a škorici', price: 3.20, color: '#8A5530', icon: '🍫' },
      { id: 'mandle_ml', name: 'Mandle v mliečnej čokoláde', price: 2.80, color: '#7A4A2A', icon: '🍫' },
      { id: 'mandle_sk', name: 'Mandle v mliečnej čokoláde a škorici', price: 2.90, color: '#9A6A3A', icon: '🍫' },
      { id: 'mandle_kar', name: 'Mandle v slanom karamele', price: 2.90, color: '#C89058', icon: '🍯' },
      { id: 'mandle_h', name: 'Mandle v horkej čokoláde', price: 3.10, color: '#3A1A1A', icon: '🍫' },
      { id: 'mandle_jah', name: 'Mandle v jahodovej čokoláde', price: 4.00, color: '#E89AA8', icon: '🍫' },
      { id: 'ovoc_zele', name: 'Ovocné želé v čokoláde', price: 1.25, color: '#5A3A2A', icon: '🍫' },
      { id: 'slnecn_c', name: 'Slnečnica v čokoláde', price: 1.50, color: '#5A3A2A', icon: '🍫' },
      { id: 'visne_h', name: 'Višne v horkej čokoláde', price: 2.90, color: '#5A1A1A', icon: '🍫' },
    ],
  },
  cukrovinky: {
    id: 'cukrovinky',
    name: 'Cukrovinky',
    short: 'Cukríky',
    unit: 100,
    items: [
      { id: 'broskyne', name: 'Broskyňové srdiečka', price: 1.20, color: '#F8B68A', icon: '🍬' },
      { id: 'cola', name: 'Cola fľašky', price: 1.14, color: '#7A3A2A', icon: '🍬' },
      { id: 'cer_zele', name: 'Čerešničky', price: 1.30, color: '#C84A4A', icon: '🍬' },
      { id: 'karamel', name: 'Karamelové kocky', price: 1.30, color: '#D89858', icon: '🍯' },
      { id: 'ovocny_k', name: 'Ovocný komprimát', price: 1.25, color: '#E8806A', icon: '🍬' },
      { id: 'kysle_hr', name: 'Kyslé hranolčeky', price: 1.24, color: '#FFD448', icon: '🍬' },
      { id: 'kysle_hus', name: 'Kyslé húsenice', price: 1.20, color: '#9AD058', icon: '🍬' },
      { id: 'kysle_hv', name: 'Kyslé hviezdičky', price: 1.30, color: '#FFA840', icon: '⭐' },
      { id: 'kysle_p', name: 'Kyslé pásiky', price: 1.25, color: '#E84A6A', icon: '🍬' },
      { id: 'malina_z', name: 'Malinové želé', price: 1.24, color: '#D8385A', icon: '🍬' },
      { id: 'mega_med', name: 'Mega medvede', price: 1.20, color: '#F8C868', icon: '🧸' },
      { id: 'melon', name: 'Melónové', price: 1.40, color: '#F58AA0', icon: '🍈' },
      { id: 'mini_med', name: 'Mini medvede', price: 1.20, color: '#F8B048', icon: '🧸' },
      { id: 'mini_zv', name: 'Mini zvieratká', price: 1.24, color: '#FFA458', icon: '🐻' },
      { id: 'neon', name: 'Neónové cukríky', price: 1.20, color: '#FF5AC8', icon: '🍬' },
      { id: 'ostr', name: 'Ostružiny', price: 1.20, color: '#5A2A6A', icon: '🍬' },
      { id: 'ostr_p', name: 'Plastické ostružiny', price: 1.25, color: '#7A3A8A', icon: '🍬' },
      { id: 'ovoc_zele_v', name: 'Veľké ovocné želé', price: 1.30, color: '#E84A6A', icon: '🍬' },
      { id: 'ovo', name: 'Ovo pecky', price: 1.20, color: '#FFD068', icon: '🥚' },
      { id: 'pendrek', name: 'Pendrekové kocky', price: 1.50, color: '#1A1A1A', icon: '🍬' },
      { id: 'sovicky', name: 'Sovičky', price: 1.20, color: '#A858E8', icon: '🦉' },
      { id: 'spuntici', name: 'Špuntíci', price: 1.20, color: '#FF6A78', icon: '🍬' },
      { id: 'tropical', name: 'Tropical', price: 1.25, color: '#FFB048', icon: '🥥' },
      { id: 'zuby', name: 'Zuby', price: 1.40, color: '#FFFFFF', icon: '🦷' },
      { id: 'zabky', name: 'Žabky', price: 1.20, color: '#5AB868', icon: '🐸' },
      { id: 'cerviky', name: 'Červíky', price: 1.20, color: '#E84A6A', icon: '🪱' },
      { id: 'hady', name: 'Hady', price: 1.20, color: '#5AA858', icon: '🐍' },
      { id: 'vajicka', name: 'Vajíčka', price: 1.20, color: '#FFD89A', icon: '🥚' },
    ],
  },
  slane: {
    id: 'slane',
    name: 'Slané',
    short: 'Slané',
    unit: 100,
    items: [
      { id: 'aras_was', name: 'Arašidy wasabi', price: 1.45, color: '#9AB868', icon: '🥜' },
      { id: 'cvikla', name: 'Cvikľové chipsy', price: 2.80, color: '#9A2A4A', icon: '🍟' },
      { id: 'chia', name: 'Chia chipsy', price: 2.80, color: '#5A4A3A', icon: '🍟' },
      { id: 'sezam', name: 'Sezamové chipsy', price: 2.80, color: '#E8D098', icon: '🍟' },
      { id: 'kesu_p', name: 'Kešu pražené solené', price: 2.90, color: '#D8B888', icon: '🥜' },
      { id: 'lan', name: 'Ľanový snack', price: 1.90, color: '#9A6A3A', icon: '🍟' },
      { id: 'soja', name: 'Pražená sója', price: 1.00, color: '#C89860', icon: '🍟' },
      { id: 'mix', name: 'Slaný mix', price: 2.30, color: '#A88858', icon: '🧂' },
      { id: 'zeler', name: 'Zeleninové chipsy', price: 4.80, color: '#E8A858', icon: '🥬' },
    ],
  },
  semienka: {
    id: 'semienka',
    name: 'Semienka',
    short: 'Semienka',
    unit: 100,
    items: [
      { id: 'slnecn', name: 'Slnečnica lúpaná', price: 0.55, color: '#9A7A3A', icon: '🌻' },
      { id: 'tekvica', name: 'Tekvicové jadrá', price: 1.40, color: '#7A9A4A', icon: '🎃' },
    ],
  },
  mrazom: {
    id: 'mrazom',
    name: 'Mrazom sušené ovocie',
    short: 'Mrazom sušené',
    unit: 10,
    exclusive: true, // cannot mix with other categories
    items: [
      { id: 'dracie', name: 'Dračie ovocie', price: 1.15, color: '#E84A8A', icon: '🐉' },
      { id: 'figy_m', name: 'Figy', price: 1.05, color: '#9A4A6A', icon: '🫐' },
      { id: 'jahody_m', name: 'Jahody', price: 1.40, color: '#E83A4A', icon: '🍓' },
      { id: 'maliny_m', name: 'Maliny', price: 1.30, color: '#D8385A', icon: '🫐' },
      { id: 'mango_m', name: 'Mango', price: 0.95, color: '#FFB048', icon: '🥭' },
    ],
  },
};

  window.CATEGORY_ORDER = ['ovocie', 'orechy', 'cokolada', 'cukrovinky', 'slane', 'semienka', 'mrazom'];

  // Base price for one cone
  window.BASE_CONE_PRICE = 1.00;

  // shipping
  window.SHIPPING = 4.00;

  // Build a flat lookup
  window.ITEM_LOOKUP = {};
  Object.values(window.CATALOG).forEach(cat => {
    cat.items.forEach(item => {
      window.ITEM_LOOKUP[item.id] = { ...item, category: cat.id, unit: cat.unit, exclusive: !!cat.exclusive };
    });
  });

  // Capacity tiers (in grams)
  window.CAPACITY_TIERS = [500, 1000, 1500];

  // Get active capacity for a tier
  window.getActiveCapacity = (tier) => window.CAPACITY_TIERS[Math.min(tier, window.CAPACITY_TIERS.length - 1)];
}
