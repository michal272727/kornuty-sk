const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const { PDFDocument, rgb } = require('pdf-lib');

const removeDiacritics = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
};

async function generateInvoicePDF(session, lineItems, conesList = []) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  let y = height - 50;
  const fontSize = 12;
  const smallFontSize = 10;
  const xSmall = 8;

  // Header
  page.drawText('FAKTÚRA', { x: 50, y, size: 20, color: rgb(0.2, 0.2, 0.2) });
  y -= 40;

  // Seller info
  page.drawText('PREDAJCA:', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;
  page.drawText('Kornuty.sk', { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText('Krupina, Slovakia', { x: 50, y, size: smallFontSize });
  y -= 30;

  // Invoice number and date
  const invoiceNum = `FAK-${session.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(session.created * 1000).toLocaleDateString('sk-SK');

  page.drawText(`Cislo faktury: ${invoiceNum}`, { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(`Datum: ${invoiceDate}`, { x: 50, y, size: smallFontSize });
  y -= 30;

  // Customer info
  page.drawText('ODBERATEL:', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;
  page.drawText(removeDiacritics(session.metadata.name || 'N/A'), { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(removeDiacritics(`${session.metadata.address || ''}, ${session.metadata.zip || ''} ${session.metadata.city || ''}`), { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(`Tel: ${session.metadata.phone || 'N/A'}`, { x: 50, y, size: smallFontSize });
  y -= 30;

  // Line items table
  page.drawText('PREDMET PLNENIA', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;

  // Table headers
  page.drawText('Polozka', { x: 50, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Pocet', { x: 350, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Cena EUR', { x: 450, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  y -= 15;

  // Line items
  lineItems.forEach(item => {
    const description = removeDiacritics(item.description || item.price_data?.product_data?.name || 'Item');
    const unitAmount = item.price_data?.unit_amount || item.price?.unit_amount || 0;
    const price = (unitAmount / 100).toFixed(2);
    const qty = item.quantity || 1;

    page.drawText(description, { x: 50, y, size: smallFontSize });
    page.drawText(qty.toString(), { x: 350, y, size: smallFontSize });
    page.drawText(price, { x: 450, y, size: smallFontSize });
    y -= 15;
  });

  // Add ingredients if available (multi-cone support)
  if (conesList.length > 0 && y > 200) {
    y -= 15;

    conesList.forEach((cone, coneIdx) => {
      if (y < 100) return;

      page.drawText(`Kornút #${cone.index} (Balenie: ${cone.capacity}g, Naplnené: ${cone.totalWeight}g):`, { x: 50, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
      y -= 12;

      cone.ingredients.forEach((ing, ingIdx) => {
        if (y < 100) return;
        const ingText = `${ingIdx + 1}. ${removeDiacritics(ing.name)} - ${ing.weight}g`;
        page.drawText(ingText, { x: 50, y, size: xSmall, color: rgb(0.4, 0.4, 0.4) });
        y -= 10;
      });
      y -= 5;
    });
  }

  y -= 10;

  // Total
  const total = (session.amount_total / 100).toFixed(2);
  page.drawText('SPOLU:', { x: 350, y, size: fontSize, color: rgb(0, 0, 0) });
  page.drawText(`${total} EUR`, { x: 450, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 30;

  // Footer
  page.drawText('Sposob platby: Platobna karta', { x: 50, y, size: smallFontSize, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText('Nie som platca DPH', { x: 50, y, size: smallFontSize, color: rgb(0.5, 0.5, 0.5) });

  return await doc.save();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    // Initialize at runtime, not build-time
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Fetch session from Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer'],
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
      return res.status(500).json({ error: 'Stripe API error: ' + stripeError.message });
    }

    const lineItems = session.line_items?.data || [];
    // Get customer email from multiple sources
    const customerEmail = session.customer_email || session.customer?.email || session.metadata?.email;

    // Parse ingredients from metadata (new multi-cone format)
    let ingredientsList = [];
    let conesList = [];
    try {
      if (session.metadata?.ingredientIds && session.metadata?.ingredientWeights) {
        const ids = session.metadata.ingredientIds.split(',');
        const weights = session.metadata.ingredientWeights.split(',').map(w => parseFloat(w));
        const capacityTiers = session.metadata.capacityTiers ? session.metadata.capacityTiers.split(',').map(t => parseInt(t)) : [];
        const coneItemCounts = session.metadata.coneItemCounts ? session.metadata.coneItemCounts.split(',').map(c => parseInt(c)) : [];

        // Build ingredient lookup from CATALOG
        const CATALOG = {
          ovocie: [
            { id: 'ananas', name: 'Ananás kandizovaný' },
            { id: 'banan_chips', name: 'Banánové chipsy' },
            { id: 'brusnice', name: 'Brusnice sušené' },
            { id: 'datle', name: 'Ďatle' },
            { id: 'figy', name: 'Figy sušené' },
            { id: 'goji', name: 'Goji' },
            { id: 'hrozno_zlate', name: 'Hrozienka zlaté JUMBO' },
            { id: 'hrozno_sult', name: 'Hrozienka Sultánky' },
            { id: 'ibistek', name: 'Kandizovaný ibištek' },
            { id: 'kokos_chips', name: 'Kokosové chipsy' },
            { id: 'marhule_nes', name: 'Marhule nesýrené' },
            { id: 'marhule', name: 'Marhule sušené' },
            { id: 'papaja', name: 'Papája kandizovaná' },
            { id: 'slivka', name: 'Slivka sušená' },
            { id: 'zazvor', name: 'Zázvor kandizovaný' },
            { id: 'cerne', name: 'Čerešne sladené' },
          ],
          orechy: [
            { id: 'arasid', name: 'Arašidy' },
            { id: 'kesu', name: 'Kešu' },
            { id: 'lieskove', name: 'Lieskové orechy' },
            { id: 'makadam', name: 'Makadámové orechy' },
            { id: 'mandle', name: 'Mandle' },
            { id: 'mandle_b', name: 'Mandle blanžírované' },
            { id: 'para', name: 'Para orechy' },
            { id: 'pekan', name: 'Pekanové orechy' },
            { id: 'pinia', name: 'Píniové oriešky' },
            { id: 'pistacie', name: 'Pistácie solené' },
            { id: 'vlasske', name: 'Vlašské orechy' },
          ],
          cokolada: [
            { id: 'arasid_ml', name: 'Arašidy v mliečnej čokoláde' },
            { id: 'arasid_jog', name: 'Arašidy v jogurte' },
            { id: 'brusn_h', name: 'Brusnice v horkej čokoláde' },
            { id: 'cokoocka', name: 'Čokoočká' },
            { id: 'hrozno_jog', name: 'Hrozienka v jogurte' },
            { id: 'hrozno_ml', name: 'Hrozienka v mliečnej čokoláde' },
            { id: 'kavove', name: 'Kávové hrudky' },
            { id: 'kesu_h', name: 'Kešu v horkej čokoláde' },
            { id: 'liesk_ml', name: 'Lieskovce v mliečnej čokoláde' },
            { id: 'liesk_sk', name: 'Lieskovce v mliečnej čokoláde a škorici' },
            { id: 'mandle_ml', name: 'Mandle v mliečnej čokoláde' },
            { id: 'mandle_sk', name: 'Mandle v mliečnej čokoláde a škorici' },
            { id: 'mandle_kar', name: 'Mandle v slanom karamele' },
            { id: 'mandle_h', name: 'Mandle v horkej čokoláde' },
            { id: 'mandle_jah', name: 'Mandle v jahodovej čokoláde' },
            { id: 'ovoc_zele', name: 'Ovocné желé v čokoláde' },
            { id: 'slnecn_c', name: 'Slnečnica v čokoláde' },
            { id: 'visne_h', name: 'Višne v horkej čokoláde' },
          ],
          cukrovinky: [
            { id: 'broskyne', name: 'Broskyňové srdiečka' },
            { id: 'cola', name: 'Cola fľašky' },
            { id: 'cer_zele', name: 'Čerešničky' },
            { id: 'karamel', name: 'Karamelové kocky' },
            { id: 'ovocny_k', name: 'Ovocný komprimát' },
            { id: 'kysle_hr', name: 'Kyslé hranolčeky' },
            { id: 'kysle_hus', name: 'Kyslé húsenice' },
            { id: 'kysle_hv', name: 'Kyslé hviezdičky' },
            { id: 'kysle_p', name: 'Kyslé pásiky' },
            { id: 'malina_z', name: 'Malinové želé' },
            { id: 'mega_med', name: 'Mega medvede' },
            { id: 'melon', name: 'Melónové' },
            { id: 'mini_med', name: 'Mini medvede' },
            { id: 'mini_zv', name: 'Mini zvieratká' },
            { id: 'neon', name: 'Neónové cukríky' },
            { id: 'ostr', name: 'Ostružiny' },
            { id: 'ostr_p', name: 'Plastické ostružiny' },
            { id: 'ovoc_zele_v', name: 'Veľké ovocné želé' },
            { id: 'ovo', name: 'Ovo pecky' },
            { id: 'pendrek', name: 'Pendrekové kocky' },
            { id: 'sovicky', name: 'Sovičky' },
            { id: 'spuntici', name: 'Špuntíci' },
            { id: 'tropical', name: 'Tropical' },
            { id: 'zuby', name: 'Zuby' },
            { id: 'zabky', name: 'Žabky' },
            { id: 'cerviky', name: 'Červíky' },
            { id: 'hady', name: 'Hady' },
            { id: 'vajicka', name: 'Vajíčka' },
          ],
          slane: [
            { id: 'aras_was', name: 'Arašidy wasabi' },
            { id: 'cvikla', name: 'Cvikľové chipsy' },
            { id: 'chia', name: 'Chia chipsy' },
            { id: 'sezam', name: 'Sezamové chipsy' },
            { id: 'kesu_p', name: 'Kešu pražené solené' },
            { id: 'lan', name: 'Ľanový snack' },
            { id: 'soja', name: 'Pražená sója' },
            { id: 'mix', name: 'Slaný mix' },
            { id: 'zeler', name: 'Zeleninové chipsy' },
          ],
          semienka: [
            { id: 'slnecn', name: 'Slnečnica lúpaná' },
            { id: 'tekvica', name: 'Tekvicové jadrá' },
          ],
          mrazom: [
            { id: 'dracie', name: 'Dračie ovocie' },
            { id: 'figy_m', name: 'Figy' },
            { id: 'jahody_m', name: 'Jahody' },
            { id: 'maliny_m', name: 'Maliny' },
            { id: 'mango_m', name: 'Mango' },
          ],
        };

        const lookupMap = {};
        Object.values(CATALOG).forEach(cat => {
          cat.forEach(item => {
            lookupMap[item.id] = item.name;
          });
        });

        ingredientsList = ids.map((id, idx) => ({
          name: lookupMap[id] || id,
          weight: weights[idx],
        }));

        // Reconstruct cones from flattened data
        let ingredientIndex = 0;
        const CAPACITY_TIERS = [500, 1000, 1500];

        conesList = coneItemCounts.map((itemCount, coneIdx) => {
          const coneCapacityTier = capacityTiers[coneIdx] || 0;
          const coneIngredients = [];
          const coneWeight = [];

          for (let i = 0; i < itemCount && ingredientIndex < ids.length; i++) {
            coneIngredients.push({
              name: lookupMap[ids[ingredientIndex]] || ids[ingredientIndex],
              weight: weights[ingredientIndex],
            });
            coneWeight.push(weights[ingredientIndex]);
            ingredientIndex++;
          }

          return {
            index: coneIdx + 1,
            capacity: CAPACITY_TIERS[coneCapacityTier] || 500,
            totalWeight: coneWeight.reduce((a, b) => a + b, 0),
            ingredients: coneIngredients,
          };
        });
      }
    } catch (e) {
      console.log('Could not parse ingredients', e);
      ingredientsList = [];
      conesList = [];
    }

    // Debug logging
    console.log('Session retrieved:', {
      sessionId: sessionId.slice(-8),
      customerEmail,
      metadata: session.metadata,
      customer_email: session.customer_email,
    });

    if (!customerEmail) {
      console.error('No customer email found in session');
      return res.status(400).json({ error: 'No customer email in session' });
    }

    // Generate PDF invoice
    const pdfBytes = await generateInvoicePDF(session, lineItems, conesList);

    // Build ingredients HTML for multiple cones
    const ingredientsHTML = conesList.length > 0 ? `
      <div style="margin: 20px 0;">
        ${conesList.map(cone => `
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
            <h3>📦 Kornút #${cone.index}</h3>
            <p style="margin: 10px 0; color: #666;">
              <strong>Balenie:</strong> ${cone.capacity}g | <strong>Naplnené:</strong> ${cone.totalWeight}g
            </p>
            <p style="margin: 10px 0;"><strong>🎯 Zloženie (v poradí, ako ste si ho vytvorili):</strong></p>
            <ol style="padding-left: 20px; margin: 10px 0;">
              ${cone.ingredients.map((ing, idx) => `
                <li style="padding: 6px 0; margin-bottom: 4px;">
                  <strong>${removeDiacritics(ing.name)}</strong> — <span style="color: #666;">${ing.weight}g</span>
                </li>
              `).join('')}
            </ol>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Send email to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Potvrdenie objednávky — TerasKA`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Ďakujeme za vašu objednávku! 🎉</h2>
          <p>Vaša objednávka bola úspešne spracovaná.</p>

          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Číslo objednávky:</strong> FAK-${sessionId.slice(-8).toUpperCase()}</p>
            <p><strong>Meno:</strong> ${removeDiacritics(session.metadata.name)}</p>
            <p><strong>Adresa doručenia:</strong> ${removeDiacritics(session.metadata.address)}, ${session.metadata.zip} ${removeDiacritics(session.metadata.city)}</p>
            <p><strong>Typ doručenia:</strong> ${session.metadata.delivery === 'pickup' ? 'Osobný odber v Krupine' : 'Kuriér'}</p>
          </div>

          ${ingredientsHTML}

          <div style="margin: 20px 0; padding: 15px; border: 2px solid #ff6b9d; border-radius: 8px;">
            <h3 style="color: #ff6b9d;">Celková cena: ${(session.amount_total / 100).toFixed(2)} EUR</h3>
          </div>

          <p>📎 Faktúra je priložená ako PDF príloha.</p>
          <p>⏱️ Doručenie kuriérom trvá približne 1-3 pracovné dni.</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

          <p style="color: #666; font-size: 12px;">
            Ďakujeme za vašu objednávku!<br/>
            <strong>TerasKA tím</strong>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `faktura-${sessionId.slice(-8)}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    });

    // Build admin ingredients table for multiple cones
    const ingredientsTableHTML = conesList.length > 0 ? `
      ${conesList.map(cone => `
        <div style="margin-bottom: 20px;">
          <h3>📦 Kornút #${cone.index} — Balenie: ${cone.capacity}g (Naplnené: ${cone.totalWeight}g)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #ff6b9d; color: white;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 70%;">Ingrediencia (poradie pridania)</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right; width: 30%;">Hmotnosť (g)</th>
              </tr>
            </thead>
            <tbody>
              ${cone.ingredients.map((ing, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#fff' : '#f9f9f9'};">
                  <td style="border: 1px solid #ddd; padding: 10px;">${idx + 1}. ${removeDiacritics(ing.name)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right;"><strong>${ing.weight}g</strong></td>
                </tr>
              `).join('')}
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td style="border: 1px solid #ddd; padding: 10px;">SPOLU KORNÚT #${cone.index}:</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${cone.totalWeight}g</td>
              </tr>
            </tbody>
          </table>
        </div>
      `).join('')}
    ` : '';

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nová objednávka — TerasKA #${sessionId.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Nová objednávka #${sessionId.slice(-8).toUpperCase()}</h2>

          <h3>Zákazník</h3>
          <p>
            <strong>Meno:</strong> ${session.metadata.name}<br/>
            <strong>Email:</strong> ${customerEmail}<br/>
            <strong>Telefón:</strong> ${session.metadata.phone}
          </p>

          <h3>Doručovacia adresa</h3>
          <p>
            ${session.metadata.address}<br/>
            ${session.metadata.zip} ${session.metadata.city}
          </p>

          <h3>Detaily objednávky</h3>
          <p>
            <strong>Počet kornútov:</strong> ${session.metadata.coneCount}<br/>
            <strong>Typ doručenia:</strong> ${session.metadata.delivery === 'pickup' ? 'Osobný odber v Krupine' : 'Kuriér'}<br/>
            <strong>Suma:</strong> ${(session.amount_total / 100).toFixed(2)} EUR
          </p>

          <h3>Zloženie kornútov</h3>
          ${ingredientsTableHTML}

          <h3>Informácie o Line Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Položka</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Cena</th>
              </tr>
            </thead>
            <tbody>
              ${lineItems.map(item => {
                const description = item.price_data?.product_data?.name || 'Item';
                const price = ((item.price_data?.unit_amount || item.price?.unit_amount || 0) * (item.quantity || 1) / 100).toFixed(2);
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">${removeDiacritics(description)}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${price} EUR</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `,
    });

    res.status(200).json({ success: true, invoiceId: sessionId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
}
