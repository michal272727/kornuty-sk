const Stripe = require('stripe');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { cartItems, coneCount, delivery, payment, orderInfo } = req.body;

    // Calculate price
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.weight / item.unit);
    }, 0);

    const deliveryFee = delivery === 'pickup' ? 0 : 4.00;
    const total = (subtotal * coneCount + deliveryFee) * 100; // in cents

    // Create line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tvoj kornút (${coneCount}×)`,
            description: `${cartItems.length} ingrediencií, ${cartItems.reduce((s, i) => s + i.weight, 0)}g`,
          },
          unit_amount: Math.round(subtotal * coneCount * 100),
        },
        quantity: 1,
      }
    ];

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Doručenie kuriérom',
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: orderInfo.email,
      metadata: {
        name: orderInfo.name,
        phone: orderInfo.phone,
        address: orderInfo.address,
        city: orderInfo.city,
        zip: orderInfo.zip,
        delivery,
        coneCount,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
