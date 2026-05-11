const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const { PDFDocument, rgb } = require('pdf-lib');

async function generateInvoicePDF(session, lineItems) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  let y = height - 50;
  const fontSize = 12;
  const smallFontSize = 10;

  // Header
  page.drawText('FAKTÚRA', { x: 50, y, size: 20, color: rgb(0.2, 0.2, 0.2) });
  y -= 40;

  // Seller info
  page.drawText('PREDAJCA:', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;
  page.drawText('TerasKA s.r.o.', { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText('Majerský rad 1527/77, 963 01 Krupina', { x: 50, y, size: smallFontSize });
  y -= 30;

  // Invoice number and date
  const invoiceNum = `FAK-${session.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(session.created * 1000).toLocaleDateString('sk-SK');

  page.drawText(`Číslo faktúry: ${invoiceNum}`, { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(`Dátum: ${invoiceDate}`, { x: 50, y, size: smallFontSize });
  y -= 30;

  // Customer info
  page.drawText('ODBERATEĽ:', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;
  page.drawText(session.metadata.name || 'N/A', { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(`${session.metadata.address || ''}, ${session.metadata.zip || ''} ${session.metadata.city || ''}`, { x: 50, y, size: smallFontSize });
  y -= 15;
  page.drawText(`Tel: ${session.metadata.phone || 'N/A'}`, { x: 50, y, size: smallFontSize });
  y -= 30;

  // Line items table
  page.drawText('PREDMET PLNENIA', { x: 50, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 20;

  // Table headers
  page.drawText('Položka', { x: 50, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Počet', { x: 350, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Cena EUR', { x: 450, y, size: smallFontSize, color: rgb(0.3, 0.3, 0.3) });
  y -= 15;

  // Line items
  lineItems.forEach(item => {
    const description = item.description || item.price_data.product_data.name;
    const price = (item.price_data.unit_amount / 100).toFixed(2);
    const qty = item.quantity || 1;

    page.drawText(description, { x: 50, y, size: smallFontSize });
    page.drawText(qty.toString(), { x: 350, y, size: smallFontSize });
    page.drawText(price, { x: 450, y, size: smallFontSize });
    y -= 15;
  });

  y -= 10;

  // Total
  const total = (session.amount_total / 100).toFixed(2);
  page.drawText('CELKEM:', { x: 350, y, size: fontSize, color: rgb(0, 0, 0) });
  page.drawText(`${total} EUR`, { x: 450, y, size: fontSize, color: rgb(0, 0, 0) });
  y -= 30;

  // Footer
  page.drawText('Spôsob platby: Platobná karta', { x: 50, y, size: smallFontSize, color: rgb(0.5, 0.5, 0.5) });
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
        expand: ['line_items'],
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
      return res.status(500).json({ error: 'Stripe API error: ' + stripeError.message });
    }

    const lineItems = session.line_items?.data || [];
    const customerEmail = session.customer_email;

    // Generate PDF invoice
    const pdfBytes = await generateInvoicePDF(session, lineItems);

    // Send email to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Potvrdenie objednávky — TerasKA`,
      html: `
        <h2>Ďakujeme za vašu objednávku!</h2>
        <p>Vaša objednávka bola úspešne spracovaná.</p>
        <p><strong>Číslo objednávky:</strong> FAK-${sessionId.slice(-8).toUpperCase()}</p>
        <p><strong>Celková suma:</strong> ${(session.amount_total / 100).toFixed(2)} EUR</p>
        <p>Faktúra je priložená ako PDF príloha.</p>
        <p>Doručenie trvá približne 3 pracovné dni.</p>
        <p>Ďakujeme za vašu objednávku!<br/><strong>TerasKA tím</strong></p>
      `,
      attachments: [
        {
          filename: `faktura-${sessionId.slice(-8)}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nová objednávka — TerasKA`,
      html: `
        <h2>Nová objednávka</h2>
        <p><strong>Meno:</strong> ${session.metadata.name}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Telefón:</strong> ${session.metadata.phone}</p>
        <p><strong>Adresa:</strong> ${session.metadata.address}, ${session.metadata.zip} ${session.metadata.city}</p>
        <p><strong>Doručenie:</strong> ${session.metadata.delivery === 'pickup' ? 'Osobný odber' : 'Kuriér'}</p>
        <p><strong>Počet kornútov:</strong> ${session.metadata.coneCount}</p>
        <p><strong>Suma:</strong> ${(session.amount_total / 100).toFixed(2)} EUR</p>
        <p><strong>Číslo objednávky:</strong> FAK-${sessionId.slice(-8).toUpperCase()}</p>
      `,
    });

    res.status(200).json({ success: true, invoiceId: sessionId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
}
