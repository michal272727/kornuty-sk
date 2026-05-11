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
      { id: 'ananas', name: 'Ananás kandizovaný', price: 1.79, color: '#F8D77E' },
      { id: 'banan_chips', name: 'Banánové chipsy', price: 1.10, color: '#F2D26B' },
      { id: 'brusnice', name: 'Brusnice sušené', price: 1.90, color: '#C84A4A' },
      { id: 'datle', name: 'Ďatle', price: 1.30, color: '#7A4A2A' },
      { id: 'figy', name: 'Figy sušené', price: 2.10, color: '#8B4567' },
      { id: 'goji', name: 'Goji', price: 2.70, color: '#E8623D' },
      { id: 'hrozno_zlate', name: 'Hrozienka zlaté JUMBO', price: 1.60, color: '#D4A857' },
      { id: 'hrozno_sult', name: 'Hrozienka Sultánky', price: 1.00, color: '#5A3A2A' },
      { id: 'ibistek', name: 'Kandizovaný ibištek', price: 2.75, color: '#C04A6A' },
      { id: 'kokos_chips', name: 'Kokosové chipsy', price: 1.30, color: '#F4ECD8' },
      { id: 'marhule_nes', name: 'Marhule nesýrené', price: 3.10, color: '#D9924A' },
      { id: 'marhule', name: 'Marhule sušené', price: 2.80, color: '#E8A65C' },
      { id: 'papaja', name: 'Papája kandizovaná', price: 1.70, color: '#F39E5C' },
      { id: 'slivka', name: 'Slivka sušená', price: 1.90, color: '#4A2A4A' },
      { id: 'zazvor', name: 'Zázvor kandizovaný', price: 1.60, color: '#E8C57A' },
      { id: 'cerne', name: 'Čerešne sladené', price: 2.25, color: '#A02844' },
    ],
  },
  orechy: {
    id: 'orechy',
    name: 'Orechy',
    short: 'Orechy',
    unit: 100,
    items: [
      { id: 'arasid', name: 'Arašidy', price: 1.00, color: '#C89870' },
      { id: 'kesu', name: 'Kešu', price: 2.20, color: '#E8D7B0' },
      { id: 'lieskove', name: 'Lieskové orechy', price: 3.20, color: '#9A6A3A' },
      { id: 'makadam', name: 'Makadámové orechy', price: 4.50, color: '#F0E2C0' },
      { id: 'mandle', name: 'Mandle', price: 2.00, color: '#D4A878' },
      { id: 'mandle_b', name: 'Mandle blanžírované', price: 2.20, color: '#EFD9B4' },
      { id: 'para', name: 'Para orechy', price: 4.90, color: '#A57850' },
      { id: 'pekan', name: 'Pekanové orechy', price: 3.90, color: '#8A5530' },
      { id: 'pinia', name: 'Píniové oriešky', price: 7.90, color: '#E0CD9C' },
      { id: 'pistacie', name: 'Pistácie solené', price: 2.80, color: '#A8B868' },
      { id: 'vlasske', name: 'Vlašské orechy', price: 1.70, color: '#B08858' },
    ],
  },
  cokolada: {
    id: 'cokolada',
    name: 'Čokoládové',
    short: 'Čokoláda',
    unit: 100,
    items: [
      { id: 'arasid_ml', name: 'Arašidy v mliečnej čokoláde', price: 1.90, color: '#7A4A2A' },
      { id: 'arasid_jog', name: 'Arašidy v jogurte', price: 1.65, color: '#F4EAD8' },
      { id: 'brusn_h', name: 'Brusnice v horkej čokoláde', price: 2.80, color: '#3A1A1A' },
      { id: 'cokoocka', name: 'Čokoočká', price: 2.65, color: '#5A2A2A' },
      { id: 'hrozno_jog', name: 'Hrozienka v jogurte', price: 1.85, color: '#F0E4D0' },
      { id: 'hrozno_ml', name: 'Hrozienka v mliečnej čokoláde', price: 2.10, color: '#6A3A2A' },
      { id: 'kavove', name: 'Kávové hrudky', price: 1.55, color: '#3A2218' },
      { id: 'kesu_h', name: 'Kešu v horkej čokoláde', price: 3.20, color: '#3A2218' },
      { id: 'liesk_ml', name: 'Lieskovce v mliečnej čokoláde', price: 3.10, color: '#7A4A2A' },
      { id: 'liesk_sk', name: 'Lieskovce v mliečnej čokoláde a škorici', price: 3.20, color: '#8A5530' },
      { id: 'mandle_ml', name: 'Mandle v mliečnej čokoláde', price: 2.80, color: '#7A4A2A' },
      { id: 'mandle_sk', name: 'Mandle v mliečnej čokoláde a škorici', price: 2.90, color: '#9A6A3A' },
      { id: 'mandle_kar', name: 'Mandle v slanom karamele', price: 2.90, color: '#C89058' },
      { id: 'mandle_h', name: 'Mandle v horkej čokoláde', price: 3.10, color: '#3A1A1A' },
      { id: 'mandle_jah', name: 'Mandle v jahodovej čokoláde', price: 4.00, color: '#E89AA8' },
      { id: 'ovoc_zele', name: 'Ovocné želé v čokoláde', price: 1.25, color: '#5A3A2A' },
      { id: 'slnecn_c', name: 'Slnečnica v čokoláde', price: 1.50, color: '#5A3A2A' },
      { id: 'visne_h', name: 'Višne v horkej čokoláde', price: 2.90, color: '#5A1A1A' },
    ],
  },
  cukrovinky: {
    id: 'cukrovinky',
    name: 'Cukrovinky',
    short: 'Cukríky',
    unit: 100,
    items: [
      { id: 'broskyne', name: 'Broskyňové srdiečka', price: 1.20, color: '#F8B68A' },
      { id: 'cola', name: 'Cola fľašky', price: 1.14, color: '#7A3A2A' },
      { id: 'cer_zele', name: 'Čerešničky', price: 1.30, color: '#C84A4A' },
      { id: 'karamel', name: 'Karamelové kocky', price: 1.30, color: '#D89858' },
      { id: 'ovocny_k', name: 'Ovocný komprimát', price: 1.25, color: '#E8806A' },
      { id: 'kysle_hr', name: 'Kyslé hranolčeky', price: 1.24, color: '#FFD448' },
      { id: 'kysle_hus', name: 'Kyslé húsenice', price: 1.20, color: '#9AD058' },
      { id: 'kysle_hv', name: 'Kyslé hviezdičky', price: 1.30, color: '#FFA840' },
      { id: 'kysle_p', name: 'Kyslé pásiky', price: 1.25, color: '#E84A6A' },
      { id: 'malina_z', name: 'Malinové želé', price: 1.24, color: '#D8385A' },
      { id: 'mega_med', name: 'Mega medvede', price: 1.20, color: '#F8C868' },
      { id: 'melon', name: 'Melónové', price: 1.40, color: '#F58AA0' },
      { id: 'mini_med', name: 'Mini medvede', price: 1.20, color: '#F8B048' },
      { id: 'mini_zv', name: 'Mini zvieratká', price: 1.24, color: '#FFA458' },
      { id: 'neon', name: 'Neónové cukríky', price: 1.20, color: '#FF5AC8' },
      { id: 'ostr', name: 'Ostružiny', price: 1.20, color: '#5A2A6A' },
      { id: 'ostr_p', name: 'Plastické ostružiny', price: 1.25, color: '#7A3A8A' },
      { id: 'ovoc_zele_v', name: 'Veľké ovocné želé', price: 1.30, color: '#E84A6A' },
      { id: 'ovo', name: 'Ovo pecky', price: 1.20, color: '#FFD068' },
      { id: 'pendrek', name: 'Pendrekové kocky', price: 1.50, color: '#1A1A1A' },
      { id: 'sovicky', name: 'Sovičky', price: 1.20, color: '#A858E8' },
      { id: 'spuntici', name: 'Špuntíci', price: 1.20, color: '#FF6A78' },
      { id: 'tropical', name: 'Tropical', price: 1.25, color: '#FFB048' },
      { id: 'zuby', name: 'Zuby', price: 1.40, color: '#FFFFFF' },
      { id: 'zabky', name: 'Žabky', price: 1.20, color: '#5AB868' },
      { id: 'cerviky', name: 'Červíky', price: 1.20, color: '#E84A6A' },
      { id: 'hady', name: 'Hady', price: 1.20, color: '#5AA858' },
      { id: 'vajicka', name: 'Vajíčka', price: 1.20, color: '#FFD89A' },
    ],
  },
  slane: {
    id: 'slane',
    name: 'Slané',
    short: 'Slané',
    unit: 100,
    items: [
      { id: 'aras_was', name: 'Arašidy wasabi', price: 1.45, color: '#9AB868' },
      { id: 'cvikla', name: 'Cvikľové chipsy', price: 2.80, color: '#9A2A4A' },
      { id: 'chia', name: 'Chia chipsy', price: 2.80, color: '#5A4A3A' },
      { id: 'sezam', name: 'Sezamové chipsy', price: 2.80, color: '#E8D098' },
      { id: 'kesu_p', name: 'Kešu pražené solené', price: 2.90, color: '#D8B888' },
      { id: 'lan', name: 'Ľanový snack', price: 1.90, color: '#9A6A3A' },
      { id: 'soja', name: 'Pražená sója', price: 1.00, color: '#C89860' },
      { id: 'mix', name: 'Slaný mix', price: 2.30, color: '#A88858' },
      { id: 'zeler', name: 'Zeleninové chipsy', price: 4.80, color: '#E8A858' },
    ],
  },
  semienka: {
    id: 'semienka',
    name: 'Semienka',
    short: 'Semienka',
    unit: 100,
    items: [
      { id: 'slnecn', name: 'Slnečnica lúpaná', price: 0.55, color: '#9A7A3A' },
      { id: 'tekvica', name: 'Tekvicové jadrá', price: 1.40, color: '#7A9A4A' },
    ],
  },
  mrazom: {
    id: 'mrazom',
    name: 'Mrazom sušené ovocie',
    short: 'Mrazom sušené',
    unit: 10,
    exclusive: true, // cannot mix with other categories
    items: [
      { id: 'dracie', name: 'Dračie ovocie', price: 1.15, color: '#E84A8A' },
      { id: 'figy_m', name: 'Figy', price: 1.05, color: '#9A4A6A' },
      { id: 'jahody_m', name: 'Jahody', price: 1.40, color: '#E83A4A' },
      { id: 'maliny_m', name: 'Maliny', price: 1.30, color: '#D8385A' },
      { id: 'mango_m', name: 'Mango', price: 0.95, color: '#FFB048' },
    ],
  },
};

  window.CATEGORY_ORDER = ['ovocie', 'orechy', 'cokolada', 'cukrovinky', 'slane', 'semienka', 'mrazom'];

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
