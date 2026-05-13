const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const { PDFDocument, rgb } = require('pdf-lib');

const removeDiacritics = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
};

async function generateInvoicePDF(session, lineItems, ingredientsList = []) {
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

  // Add ingredients if available
  if (ingredientsList.length > 0 && y > 200) {
    y -= 15;
    page.drawText('Zlozenije kornuta:', { x: 50, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
    y -= 12;

    ingredientsList.forEach(ing => {
      if (y < 100) return;
      page.drawText('  - ' + removeDiacritics(ing.name), { x: 50, y, size: xSmall, color: rgb(0.4, 0.4, 0.4) });
      y -= 10;
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

    // Parse ingredients from metadata
    let ingredientsList = [];
    try {
      if (session.metadata?.ingredients) {
        ingredientsList = JSON.parse(session.metadata.ingredients);
      }
    } catch (e) {
      console.log('Could not parse ingredients');
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
    const pdfBytes = await generateInvoicePDF(session, lineItems, ingredientsList);

    // Build ingredients HTML
    const ingredientsHTML = ingredientsList.length > 0 ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
        <h3>Zloženie vášho kornútu:</h3>
        <ul style="list-style: none; padding: 0;">
          ${ingredientsList.map(ing => `
            <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
              <strong>${removeDiacritics(ing.name)}</strong>
            </li>
          `).join('')}
        </ul>
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

    // Build admin ingredients table
    const ingredientsTableHTML = ingredientsList.length > 0 ? `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Ingrediencia</th>
          </tr>
        </thead>
        <tbody>
          ${ingredientsList.map(ing => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">${removeDiacritics(ing.name)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
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
