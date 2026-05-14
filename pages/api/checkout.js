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
    const { cones, delivery, payment, orderInfo } = req.body;

    // Calculate totals
    const subtotal = cones.reduce((sum, cone) => {
      return sum + cone.items.reduce((s, item) => {
        const itemData = global.ITEM_LOOKUP && global.ITEM_LOOKUP[item.id];
        if (!itemData) return s;
        const weight = item.weights ? item.weights.reduce((a, b) => a + b, 0) : item.weight;
        return s + (itemData.price * weight / itemData.unit);
      }, 0) + (global.BASE_CONE_PRICE || 2.00);
    }, 0);

    const deliveryFee = delivery === 'pickup' ? 0 : 4.00;

    // Create line items for Stripe - one per cone
    const line_items = cones.map((cone, idx) => {
      const conePrice = cone.items.reduce((s, item) => {
        const itemData = global.ITEM_LOOKUP && global.ITEM_LOOKUP[item.id];
        if (!itemData) return s;
        const weight = item.weights ? item.weights.reduce((a, b) => a + b, 0) : item.weight;
        return s + (itemData.price * weight / itemData.unit);
      }, 0) + (global.BASE_CONE_PRICE || 2.00);

      const itemCount = cone.items.length;
      const totalWeight = cone.items.reduce((s, item) => {
        const weight = item.weights ? item.weights.reduce((a, b) => a + b, 0) : item.weight;
        return s + weight;
      }, 0);

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Kornút #${idx + 1}`,
            description: `${itemCount} ingrediencií, ${totalWeight}g`,
          },
          unit_amount: Math.round(conePrice * 100),
        },
        quantity: 1,
      };
    });

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

    // Prepare metadata
    const ingredientIds = [];
    const ingredientWeights = [];
    const capacityTiers = [];
    const coneItemCounts = [];

    cones.forEach(cone => {
      coneItemCounts.push(cone.items.length);
      cone.items.forEach(item => {
        ingredientIds.push(item.id);
        ingredientWeights.push(item.weights ? item.weights.reduce((a, b) => a + b, 0) : item.weight);
      });
      capacityTiers.push(cone.capacityTier);
    });

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
        coneCount: cones.length,
        ingredientIds: ingredientIds.join(','),
        ingredientWeights: ingredientWeights.join(','),
        capacityTiers: capacityTiers.join(','),
        coneItemCounts: coneItemCounts.join(','),
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
