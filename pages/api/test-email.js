const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send test email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Kornuty App',
      html: `
        <h2>✅ Test Email Works!</h2>
        <p>SMTP is properly configured on the server.</p>
        <p><strong>From:</strong> ${process.env.SMTP_USER}</p>
        <p><strong>To:</strong> ${process.env.ADMIN_EMAIL}</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
}
