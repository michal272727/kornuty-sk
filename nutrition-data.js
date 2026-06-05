// Nutrition facts for ingredients
if (typeof window !== 'undefined') {
  window.NUTRITION_DATA = {
    kesu: {
      composition: 'Kešu na sucho pražené solené (98,5%), arašídy pizza, mandle udené, arašídy na wasabi, kypracia látka, emulgátor arabská guma',
      origin: 'Česká republika',
      storage: 'V suchu, mimo priameho slnečného žiarenia',
      values: [
        { label: 'Energia', value: '2339 kJ / 581 kcal' },
        { label: 'Tuky', value: '40,5 g' },
        { label: '  z toho nasýtené mastné kyseliny', value: '5,93 g' },
        { label: 'Sacharidy', value: '31,68 g' },
        { label: '  z toho cukry', value: '9,25 g' },
        { label: 'Bielkoviny', value: '16,58 g' },
        { label: 'Vláknina', value: '2,83 g' },
        { label: 'Soľ', value: '1,43 g' },
      ]
    },
    // Ostatné ingrediencie budú zobrazovať len obrázok (fallback)
    // Postupne sa budú dopĺňať s textovými údajmi
  };
}
