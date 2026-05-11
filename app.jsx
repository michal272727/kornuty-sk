'use client';

import React from 'react';
import {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
} from './tweaks-panel';
import { ConeViz } from './cone-viz';

// Main Kornuty.sk app — interactive prototype
// Mobile-first, multi-screen flow: Welcome → Builder → Cart → Checkout → Done

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const SCREENS = ['welcome', 'builder', 'cart', 'checkout', 'success'];

// LocalStorage helpers
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem('kornuty:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('kornuty:' + k, JSON.stringify(v)); } catch {} },
};

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Theme tweaks
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "direction": "candy",
    "showTweaks": true,
    "wholeNum": false
  }/*EDITMODE-END*/);

  const direction = tweaks.direction || 'candy'; // 'candy' | 'editorial' | 'modernist'

  const [screen, setScreen] = useState('welcome');
  const [cart, setCart] = useState([]); // [{ id, weight }]
  const [capacityTier, setCapacityTier] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(LS.get('deliveryMethod', 'courier'));

  // Restore from localStorage after hydration
  useEffect(() => {
    if (hydrated) {
      const savedScreen = LS.get('screen', 'welcome');
      const savedCart = LS.get('cart', []);
      const savedTier = LS.get('capacityTier', 0);
      if (savedScreen !== 'welcome') setScreen(savedScreen);
      if (savedCart.length > 0) setCart(savedCart);
      if (savedTier > 0) setCapacityTier(savedTier);
    }
  }, [hydrated]);

  // Handle Stripe success redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (sessionId) {
        setScreen('success');
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        }).catch(err => console.error('Email send error:', err));
        // Clear URL
        window.history.replaceState({}, '', '/');
        // Keep cart for display, but mark as completed
        LS.set('completedOrder', true);
      }
    }
  }, []);
  const [activeCategory, setActiveCategory] = useState('cokolada');
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderInfo, setOrderInfo] = useState(LS.get('orderInfo', { name: '', email: '', phone: '', address: '', city: '', zip: '' }));
  const [coneCount, setConeCount] = useState(1);
  const [showFullCelebration, setShowFullCelebration] = useState(false);

  useEffect(() => LS.set('screen', screen), [screen]);
  useEffect(() => LS.set('cart', cart), [cart]);
  useEffect(() => LS.set('capacityTier', capacityTier), [capacityTier]);
  useEffect(() => LS.set('orderInfo', orderInfo), [orderInfo]);
  useEffect(() => LS.set('deliveryMethod', deliveryMethod), [deliveryMethod]);

  // Cart helpers
  const cartItems = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return cart.map(c => ({ ...window.ITEM_LOOKUP[c.id], weight: c.weight }));
  }, [cart]);
  const totalWeight = cart.reduce((s, c) => s + c.weight, 0);
  const subtotal = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    return cartItems.reduce((s, i) => s + (i.price * i.weight / i.unit), 0);
  }, [cartItems]);
  const capacity = useMemo(() => {
    if (typeof window === 'undefined') return 500;
    return window.getActiveCapacity(capacityTier);
  }, [capacityTier]);
  const fillPct = Math.min(totalWeight / capacity, 1);
  const isFull = totalWeight >= capacity;
  const canUpgrade = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return capacityTier < window.CAPACITY_TIERS.length - 1;
  }, [capacityTier]);
  const nextCapacity = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return canUpgrade ? window.CAPACITY_TIERS[capacityTier + 1] : null;
  }, [canUpgrade, capacityTier]);

  // Trigger celebration when crossing into full state
  const wasFullRef = useRef(false);
  useEffect(() => {
    if (isFull && !wasFullRef.current && totalWeight > 0) {
      setShowFullCelebration(true);
      setTimeout(() => setShowFullCelebration(false), 2200);
    }
    wasFullRef.current = isFull;
  }, [isFull, totalWeight]);

  const upgradeCapacity = () => {
    if (canUpgrade) setCapacityTier(t => t + 1);
  };

  const hasMrazom = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return cart.some(c => window.ITEM_LOOKUP[c.id]?.exclusive);
  }, [cart]);
  const hasNonMrazom = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return cart.some(c => !window.ITEM_LOOKUP[c.id]?.exclusive);
  }, [cart]);

  // Filter categories: if cart has mrazom items, only mrazom available; if has non-mrazom, mrazom locked
  const isCategoryLocked = (catId) => {
    if (cart.length === 0) return false;
    if (catId === 'mrazom') return hasNonMrazom;
    return hasMrazom;
  };

  const addItem = useCallback((id, weight = 20) => {
    if (typeof window === 'undefined') return;
    const currentTotal = cart.reduce((s, c) => s + c.weight, 0);
    const currentCap = window.getActiveCapacity(capacityTier);
    // Auto-upgrade if would overflow
    if (currentTotal + weight > currentCap) {
      if (capacityTier < window.CAPACITY_TIERS.length - 1) {
        // bump to next tier that can hold the new total
        let newTier = capacityTier;
        while (newTier < window.CAPACITY_TIERS.length - 1 && window.CAPACITY_TIERS[newTier] < currentTotal + weight) {
          newTier++;
        }
        setCapacityTier(newTier);
      } else {
        setToast('Maximálny kornút (1500g). Viac sa nezmestí.');
        setTimeout(() => setToast(null), 2200);
        return;
      }
    }
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, weight: c.weight + weight } : c);
      return [...prev, { id, weight }];
    });
    setRecentlyAdded(id);
    setAnimatingId(id);
    setLastAddedId(id);
    setTimeout(() => setAnimatingId(null), 600);
    setTimeout(() => setRecentlyAdded(null), 1500);
    setTimeout(() => setLastAddedId(null), 1200);
  }, [cart, capacityTier, setCart, setCapacityTier, setToast, setRecentlyAdded, setAnimatingId, setLastAddedId]);

  const getOptimalTier = useCallback((newTotal) => {
    if (typeof window === 'undefined') return capacityTier;
    let optimalTier = 0;
    for (let i = 0; i < window.CAPACITY_TIERS.length; i++) {
      if (window.CAPACITY_TIERS[i] >= newTotal) {
        optimalTier = i;
        break;
      }
    }
    return optimalTier;
  }, [capacityTier]);

  const removeItem = (id) => {
    setCart(prev => {
      const updated = prev.filter(c => c.id !== id);
      const newTotal = updated.reduce((s, c) => s + c.weight, 0);
      const optimalTier = getOptimalTier(newTotal);
      if (optimalTier < capacityTier) {
        setCapacityTier(optimalTier);
      }
      return updated;
    });
  };

  const updateWeight = (id, weight) => {
    if (weight <= 0) {
      removeItem(id);
    } else {
      setCart(prev => {
        const updated = prev.map(c => c.id === id ? { ...c, weight } : c);
        const newTotal = updated.reduce((s, c) => s + c.weight, 0);
        const optimalTier = getOptimalTier(newTotal);
        if (optimalTier < capacityTier) {
          setCapacityTier(optimalTier);
        }
        return updated;
      });
    }
  };

  const clearCart = () => { setCart([]); setCapacityTier(0); };

  // Direction class on root
  return (
    <div className={`app dir-${direction}`}>
      {toast && <div className="toast">{toast}</div>}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Vizuálny smer" />
        <TweakRadio
          label="Smer"
          value={direction}
          options={['candy', 'editorial', 'modernist']}
          onChange={(v) => setTweak('direction', v)}
        />
      </TweaksPanel>

      <div className="screen-stack" suppressHydrationWarning>
        {(!hydrated || screen === 'welcome') && <WelcomeScreen onStart={() => setScreen('builder')} direction={direction} cart={cart} setScreen={setScreen} />}
        {hydrated && screen === 'builder' && (
          <BuilderScreen
            cart={cart}
            cartItems={cartItems}
            totalWeight={totalWeight}
            subtotal={subtotal}
            capacityTier={capacityTier}
            capacity={capacity}
            fillPct={fillPct}
            isFull={isFull}
            canUpgrade={canUpgrade}
            nextCapacity={nextCapacity}
            upgradeCapacity={upgradeCapacity}
            showFullCelebration={showFullCelebration}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            isCategoryLocked={isCategoryLocked}
            hasMrazom={hasMrazom}
            addItem={addItem}
            removeItem={removeItem}
            updateWeight={updateWeight}
            recentlyAdded={recentlyAdded}
            animatingId={animatingId}
            lastAddedId={lastAddedId}
            onBack={() => setScreen('welcome')}
            onContinue={() => setScreen('cart')}
            direction={direction}
          />
        )}
        {hydrated && screen === 'cart' && (
          <CartScreen
            cart={cart}
            cartItems={cartItems}
            totalWeight={totalWeight}
            subtotal={subtotal}
            capacityTier={capacityTier}
            updateWeight={updateWeight}
            removeItem={removeItem}
            clearCart={clearCart}
            coneCount={coneCount}
            setConeCount={setConeCount}
            onBack={() => setScreen('builder')}
            onContinue={() => setScreen('checkout')}
            direction={direction}
          />
        )}
        {hydrated && screen === 'checkout' && (
          <CheckoutScreen
            subtotal={subtotal * coneCount}
            coneCount={coneCount}
            orderInfo={orderInfo}
            setOrderInfo={setOrderInfo}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            onBack={() => setScreen('cart')}
            onComplete={() => setScreen('success')}
            direction={direction}
            cart={cart}
            cartItems={cartItems}
          />
        )}
        {hydrated && screen === 'success' && (
          <SuccessScreen
            cartItems={cartItems}
            coneCount={coneCount}
            subtotal={subtotal * coneCount}
            total={subtotal * coneCount + (deliveryMethod === 'pickup' ? 0 : window.SHIPPING)}
            shipping={deliveryMethod === 'pickup' ? 0 : window.SHIPPING}
            deliveryMethod={deliveryMethod}
            orderInfo={orderInfo}
            onRestart={() => { setCart([]); LS.set('cart', []); setScreen('welcome'); setDeliveryMethod('courier'); }}
            direction={direction}
          />
        )}
      </div>
    </div>
  );
}

// ============ WELCOME ============
function WelcomeScreen({ onStart, direction, cart, setScreen }) {
  return (
    <div className="screen welcome" data-screen-label="Welcome">
      <div className="welcome-bg">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div className="welcome-content">
        <div className="brand-badge">
          <SparkleIcon /> kornuty.sk
        </div>

        <div className="welcome-cone">
          <ConeViz items={[
            { id: 'demo-1', color: '#F4A8B8', weight: 30 },
            { id: 'demo-2', color: '#F8C868', weight: 30 },
            { id: 'demo-3', color: '#9AC56A', weight: 30 },
            { id: 'demo-4', color: '#A858E8', weight: 30 },
            { id: 'demo-5', color: '#5BD8C8', weight: 30 },
          ]} size="lg" />
        </div>

        <h1 className="welcome-h1">
          Vytvor si <em>vlastný</em><br/>sladký kornút
        </h1>
        <p className="welcome-sub">
          Vyber si zo 100+ ingrediencií. Navrhni, namixuj, daruj.
        </p>

        <button className="btn-primary btn-lg" onClick={onStart}>
          Začať miešať
          <ArrowIcon />
        </button>

        {cart.length > 0 && (
          <button className="btn-ghost" onClick={() => setScreen('cart')}>
            Pokračovať v rozpracovanom · {cart.length}
          </button>
        )}

        <div className="welcome-features">
          <Feature icon={<TruckIcon />} label="Doručenie do 3 dní" />
          <Feature icon={<HeartIcon />} label="Ručne balené" />
          <Feature icon={<LeafIcon />} label="Bez konzervantov" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

// ============ BUILDER ============
function BuilderScreen({
  cart, cartItems, totalWeight, subtotal,
  capacityTier, capacity, fillPct, isFull, canUpgrade, nextCapacity, upgradeCapacity, showFullCelebration,
  activeCategory, setActiveCategory, isCategoryLocked, hasMrazom,
  addItem, removeItem, updateWeight, recentlyAdded, animatingId, lastAddedId,
  onBack, onContinue, direction,
}) {
  const cat = window.CATALOG[activeCategory];
  const [search, setSearch] = useState('');

  const visibleItems = cat.items.filter(it =>
    !search || it.name.toLowerCase().includes(search.toLowerCase())
  );

  const inCartIds = new Set(cart.map(c => c.id));

  return (
    <div className="screen builder" data-screen-label="Builder">
      <header className="builder-header">
        <button className="icon-btn" onClick={onBack}><BackIcon /></button>
        <div className="builder-title-wrap">
          <div className="builder-title">Tvoj kornút</div>
          <div className="builder-meta">
            {cart.length > 0
              ? `${cart.length} ingrediencí · ${totalWeight}g`
              : 'pridaj ingredienciu'}
          </div>
        </div>
        <button className="icon-btn cart-btn" onClick={onContinue}>
          <BagIcon />
          {cart.length > 0 && <span className="cart-dot">{cart.length}</span>}
        </button>
      </header>

      {/* Cone preview */}
      <div className={`cone-preview ${isFull ? 'full' : ''}`}>
        <div className="cone-preview-inner">
          <ConeViz items={cartItems} size="md" capacityTier={capacityTier} lastAddedId={lastAddedId} />
        </div>
        <div className="cone-stats">
          <div className="stat">
            <div className="stat-label">Naplnené</div>
            <div className="stat-value">{totalWeight}<span className="stat-unit">/{capacity}g</span></div>
            <div className="capacity-bar">
              <div className="capacity-fill" style={{ width: `${fillPct * 100}%` }} />
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <div className="stat-label">Cena</div>
            <div className="stat-value">{subtotal.toFixed(2)}<span className="stat-unit">€</span></div>
          </div>
        </div>
      </div>

      {/* Full celebration banner — sticky, persuasive upgrade */}
      {isFull && canUpgrade && (
        <div className={`upgrade-banner ${showFullCelebration ? 'celebrate' : ''}`}>
          <div className="upgrade-icon"><SparkleIcon /></div>
          <div className="upgrade-text">
            <strong>Kornút je plný! 🎉</strong>
            <p>Chceš ešte viac dobrôt? Zväčši si ho na <b>{nextCapacity}g</b>.</p>
          </div>
          <button className="upgrade-btn" onClick={upgradeCapacity}>
            Zväčšiť
            <ArrowIcon />
          </button>
        </div>
      )}
      {isFull && !canUpgrade && (
        <div className="upgrade-banner maxed">
          <div className="upgrade-icon"><SparkleIcon /></div>
          <div className="upgrade-text">
            <strong>Maximálny kornút!</strong>
            <p>{capacity}g — viac sa už nezmestí.</p>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="cat-tabs">
        {window.CATEGORY_ORDER.map(cid => {
          const c = window.CATALOG[cid];
          const locked = isCategoryLocked(cid);
          return (
            <button
              key={cid}
              className={`cat-tab ${activeCategory === cid ? 'active' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => !locked && setActiveCategory(cid)}
              disabled={locked}
              title={locked ? 'Nedá sa kombinovať' : c.name}
            >
              <div className="cat-tab-icon">
                <CategoryIcon id={cid} />
              </div>
              <span className="cat-tab-label">{c.short}</span>
              {locked && <span className="lock-pill"><LockIcon /></span>}
            </button>
          );
        })}
      </div>

      {/* Mrazom warning banner */}
      {activeCategory === 'mrazom' && (
        <div className="info-banner">
          <SparkleIcon />
          <div>
            <strong>Mrazom sušené ovocie</strong>
            <p>Cena za 10g. Nedá sa kombinovať s inými produktmi — vlastný kornút.</p>
          </div>
        </div>
      )}
      {hasMrazom && activeCategory !== 'mrazom' && (
        <div className="info-banner warning">
          <div>
            <strong>Mrazom sušené sa nemieša</strong>
            <p>Najprv dokonči mrazom kornút, alebo začni odznova.</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-wrap">
        <SearchIcon />
        <input
          className="search-input"
          placeholder={`Hľadať v ${cat.short.toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Items grid */}
      <div className="items-grid">
        {visibleItems.map(item => {
          const inCart = inCartIds.has(item.id);
          const cartEntry = cart.find(c => c.id === item.id);
          return (
            <ItemCard
              key={item.id}
              item={item}
              unit={cat.unit}
              inCart={inCart}
              weight={cartEntry?.weight || 0}
              onAdd={() => addItem(item.id, cat.unit === 10 ? 10 : 20)}
              onRemove={() => removeItem(item.id)}
              onUpdate={(w) => updateWeight(item.id, w)}
              animating={animatingId === item.id}
              recent={recentlyAdded === item.id}
            />
          );
        })}
      </div>

      {/* Sticky CTA */}
      {cart.length > 0 && (
        <div className="sticky-bar">
          <div className="sticky-info">
            <div className="sticky-count">{cart.length} ingrediencií · {totalWeight}g</div>
            <div className="sticky-price">{subtotal.toFixed(2)} €</div>
          </div>
          <button className="btn-primary" onClick={onContinue}>
            Do košíka <ArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, unit, inCart, weight, onAdd, onRemove, onUpdate, animating, recent }) {
  const step = unit === 10 ? 10 : 20;
  return (
    <div className={`item-card ${inCart ? 'in-cart' : ''} ${animating ? 'pulse' : ''} ${recent ? 'flash' : ''}`}>
      <div className="item-illus" style={{ background: `${item.color}26` }}>
        <IngIllus id={item.id} color={item.color} />
        {inCart && <div className="item-badge">{weight}g</div>}
      </div>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-price">{item.price.toFixed(2)} € / {unit}g</div>
      </div>
      {!inCart ? (
        <button className="item-add" onClick={onAdd} aria-label="pridať">
          <PlusIcon />
        </button>
      ) : (
        <div className="item-stepper">
          <button onClick={() => onUpdate(weight - step)}><MinusIcon /></button>
          <span>{weight}g</span>
          <button onClick={() => onUpdate(weight + step)}><PlusIcon /></button>
        </div>
      )}
    </div>
  );
}

// ============ CART ============
function CartScreen({ cart, cartItems, totalWeight, subtotal, capacityTier, updateWeight, removeItem, clearCart, coneCount, setConeCount, onBack, onContinue, direction }) {
  const total = subtotal * coneCount;

  return (
    <div className="screen cart" data-screen-label="Cart">
      <header className="builder-header">
        <button className="icon-btn" onClick={onBack}><BackIcon /></button>
        <div className="builder-title-wrap">
          <div className="builder-title">Tvoj košík</div>
          <div className="builder-meta">{cart.length === 0 ? 'prázdny' : `${cart.length} ingrediencií · ${totalWeight}g`}</div>
        </div>
        <div style={{ width: 40 }} />
      </header>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-cone">
            <ConeViz items={[]} size="md" />
          </div>
          <h3>Tvoj kornút je zatiaľ prázdny</h3>
          <p>Pridaj si pár dobrôt.</p>
          <button className="btn-primary" onClick={onBack}>Začať miešať</button>
        </div>
      ) : (
        <>
          <div className="cart-cone">
            <ConeViz items={cartItems} size="md" capacityTier={capacityTier} />
          </div>

          <div className="cart-list">
            {cartItems.map(it => (
              <div key={it.id} className="cart-row">
                <div className="cart-illus" style={{ background: `${it.color}26` }}>
                  <IngIllus id={it.id} color={it.color} />
                </div>
                <div className="cart-info">
                  <div className="cart-name">{it.name}</div>
                  <div className="cart-price">{(it.price * it.weight / it.unit).toFixed(2)} €</div>
                </div>
                <div className="item-stepper compact">
                  <button onClick={() => updateWeight(it.id, it.weight - (it.unit === 10 ? 10 : 20))}><MinusIcon /></button>
                  <span>{it.weight}g</span>
                  <button onClick={() => updateWeight(it.id, it.weight + (it.unit === 10 ? 10 : 20))}><PlusIcon /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="cone-count-wrap">
            <div>
              <div className="ccc-title">Počet kornútov</div>
              <div className="ccc-sub">Rovnaké zloženie</div>
            </div>
            <div className="item-stepper">
              <button onClick={() => setConeCount(Math.max(1, coneCount - 1))}><MinusIcon /></button>
              <span>{coneCount}×</span>
              <button onClick={() => setConeCount(coneCount + 1)}><PlusIcon /></button>
            </div>
          </div>

          <div className="summary">
            <div className="summary-row">
              <span>Cena za 1 kornút</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="summary-row">
              <span>Počet</span>
              <span>{coneCount}×</span>
            </div>
            <div className="summary-row">
              <span>Poštovné</span>
              <span>{window.SHIPPING.toFixed(2)} €</span>
            </div>
            <div className="summary-row total">
              <span>Spolu</span>
              <span>{(total + window.SHIPPING).toFixed(2)} €</span>
            </div>
          </div>

          <div className="cart-actions">
            <button className="btn-ghost-line" onClick={clearCart}>Vyprázdniť</button>
            <button className="btn-primary btn-lg" onClick={onContinue}>
              Pokračovať <ArrowIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============ CHECKOUT ============
function CheckoutScreen({ subtotal, coneCount, orderInfo, setOrderInfo, deliveryMethod, setDeliveryMethod, onBack, onComplete, direction, cart, cartItems }) {
  const [payment, setPayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const total = subtotal + (deliveryMethod === 'pickup' ? 0 : window.SHIPPING);

  const update = (k, v) => setOrderInfo({ ...orderInfo, [k]: v });

  const valid = orderInfo.name && orderInfo.email && orderInfo.phone && orderInfo.address && orderInfo.city && orderInfo.zip;

  const handleStripeCheckout = async () => {
    if (!valid) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          coneCount,
          delivery: deliveryMethod,
          payment,
          orderInfo,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const { sessionId } = await res.json();

      // Redirect to Stripe Checkout
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      alert('Chyba pri platbe. Skúste neskôr.');
      setLoading(false);
    }
  };

  return (
    <div className="screen checkout" data-screen-label="Checkout">
      <header className="builder-header">
        <button className="icon-btn" onClick={onBack}><BackIcon /></button>
        <div className="builder-title-wrap">
          <div className="builder-title">Doručenie</div>
        </div>
        <div style={{ width: 40 }} />
      </header>

      <div className="form-section">
        <h3>Kontaktné údaje</h3>
        <Field label="Meno a priezvisko" value={orderInfo.name} onChange={v => update('name', v)} placeholder="Jana Nováková" />
        <Field label="E-mail" value={orderInfo.email} onChange={v => update('email', v)} placeholder="jana@email.sk" type="email" />
        <Field label="Telefón" value={orderInfo.phone} onChange={v => update('phone', v)} placeholder="+421 900 000 000" type="tel" />
      </div>

      <div className="form-section">
        <h3>Adresa</h3>
        <Field label="Ulica a číslo" value={orderInfo.address} onChange={v => update('address', v)} placeholder="Hlavná 12" />
        <div className="field-row">
          <Field label="Mesto" value={orderInfo.city} onChange={v => update('city', v)} placeholder="Bratislava" />
          <Field label="PSČ" value={orderInfo.zip} onChange={v => update('zip', v)} placeholder="811 01" />
        </div>
      </div>

      <div className="form-section">
        <h3>Doručenie</h3>
        <div className="option-list">
          <OptionRow checked={deliveryMethod === 'courier'} onClick={() => setDeliveryMethod('courier')}
            title="Kuriér" sub="1–3 pracovné dni" price="4.00 €" />
          <OptionRow checked={deliveryMethod === 'pickup'} onClick={() => setDeliveryMethod('pickup')}
            title="Osobný odber" sub="Krupina" price="zdarma" />
        </div>
      </div>

      <div className="form-section">
        <h3>Platba</h3>
        <div className="option-list">
          <OptionRow checked={payment === 'card'} onClick={() => setPayment('card')}
            title="Kartou online" sub="Visa / Mastercard" />
          <OptionRow checked={payment === 'transfer'} onClick={() => setPayment('transfer')}
            title="Bankový prevod" sub="QR kód v e-maile" />
          <OptionRow checked={payment === 'cod'} onClick={() => setPayment('cod')}
            title="Dobierka" sub="+1 €" />
        </div>
      </div>

      <div className="summary">
        <div className="summary-row">
          <span>Kornúty ({coneCount}×)</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="summary-row">
          <span>Doručenie</span>
          <span>{deliveryMethod === 'pickup' ? '0.00' : window.SHIPPING.toFixed(2)} €</span>
        </div>
        <div className="summary-row total">
          <span>Spolu</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <div className="cart-actions">
        <button className="btn-primary btn-lg" disabled={!valid || loading} onClick={handleStripeCheckout}>
          {loading ? 'Načítavanie...' : 'Objednať záväzne'}
          {!loading && <ArrowIcon />}
        </button>
      </div>

      <div className="legal">
        Predajca: TerasKA s.r.o., Majerský rad 1527/77, 963 01 Krupina<br/>
        Odoslaním objednávky súhlasíte s{' '}
        <a href="/vop" target="_blank" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          Obchodnými podmienkami
        </a>
        {' '} a{' '}
        <a href="/gdpr" target="_blank" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          Ochranou osobných údajov
        </a>
        . Máte <a href="/odstupenie" target="_blank" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          právo na odstúpenie
        </a>{' '}
        do 14 dní.
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} />
    </label>
  );
}

function OptionRow({ checked, onClick, title, sub, price }) {
  return (
    <button className={`option-row ${checked ? 'checked' : ''}`} onClick={onClick}>
      <div className="option-radio">{checked && <div className="option-radio-dot" />}</div>
      <div className="option-text">
        <div className="option-title">{title}</div>
        <div className="option-sub">{sub}</div>
      </div>
      {price && <div className="option-price">{price}</div>}
    </button>
  );
}

// ============ SUCCESS ============
function SuccessScreen({ cartItems, coneCount, subtotal, total, shipping, deliveryMethod, orderInfo, onRestart, direction }) {
  const orderNum = useMemo(() => 'KOR-' + Math.floor(Math.random() * 90000 + 10000), []);
  return (
    <div className="screen success" data-screen-label="Success">
      <div className="success-confetti">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="confetti-piece" style={{
            left: (i * 5) + '%',
            background: ['#F4A8B8', '#F8C868', '#9AC56A', '#A858E8', '#5BD8C8'][i % 5],
            animationDelay: (i * 0.1) + 's',
          }} />
        ))}
      </div>

      <div className="success-content">
        <div className="success-cone">
          <ConeViz items={cartItems} size="md" />
        </div>
        <div className="success-badge">
          <CheckIcon /> Objednávka prijatá
        </div>
        <h1 className="success-h1">Ďakujeme,<br/>{orderInfo.name?.split(' ')[0] || 'priateľu'}!</h1>
        <p className="success-sub">
          Číslo objednávky <strong>#{orderNum}</strong>.<br />
          Detaily sme poslali na <strong>{orderInfo.email || 'e-mail'}</strong>.
        </p>

        <div className="success-order-summary">
          <h3>Vaša objednávka</h3>

          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-detail">{item.weight}g × {coneCount}</div>
                <div className="order-item-price">{(item.price * item.weight / item.unit * coneCount).toFixed(2)} €</div>
              </div>
            ))}
          </div>

          <div className="order-breakdown">
            <div className="breakdown-row">
              <span>Spolu za kornúty</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="breakdown-row">
              <span>Doručenie ({deliveryMethod === 'pickup' ? 'osobný odber' : 'kuriér'})</span>
              <span>{shipping.toFixed(2)} €</span>
            </div>
            <div className="breakdown-row total">
              <span>Celkem</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="order-meta">
            <div className="meta-item">
              <span className="meta-label">Jméno</span>
              <span>{orderInfo.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Doručení</span>
              <span>
                {deliveryMethod === 'pickup'
                  ? 'Osobní odběr v Krupině'
                  : `Kuriér (1–3 pracovní dni)`}
              </span>
            </div>
          </div>
        </div>

        <button className="btn-primary btn-lg" onClick={onRestart}>Nový kornút</button>
      </div>
    </div>
  );
}

// ============ ICONS ============
function ArrowIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function BackIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>; }
function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function MinusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function BagIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 L3 6 L3 20 a2 2 0 0 0 2 2 h14 a2 2 0 0 0 2-2 V6 L18 2 Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10 a4 4 0 0 1 -8 0" /></svg>; }
function CheckIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function LockIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 a5 5 0 0 0 -5 5 V10 H6 a2 2 0 0 0 -2 2 V20 a2 2 0 0 0 2 2 H18 a2 2 0 0 0 2-2 V12 a2 2 0 0 0 -2 -2 H17 V7 a5 5 0 0 0 -5 -5 Z M9 10 V7 a3 3 0 0 1 6 0 V10 Z" /></svg>; }
function SparkleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z" /></svg>; }
function TruckIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 9 H19 L22 12 V17 H15 Z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>; }
function HeartIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function LeafIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-9 8-11 16-11 0 8-2 16-9 18z" /><path d="M2 21c0-3 1.85-5.36 5-6" /></svg>; }

function CategoryIcon({ id }) {
  const icons = {
    ovocie: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M12 5 C13.66 5 15 6.34 15 8 C15 9.66 13.66 11 12 11 C10.34 11 9 9.66 9 8 C9 6.34 10.34 5 12 5 Z M12 19 C9.24 19 6.77 17.87 5.21 16 C6.42 14.63 7.94 13.8 9.59 13.8 C10.5 13.8 11.38 14.05 12.15 14.46 C12.76 14.05 13.41 14.45 13.91 14.46 C15.56 13.8 17.08 14.63 18.29 16 C16.73 17.87 14.26 19 12 19 Z" /></svg>,
    orechy: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M16 11 C17.1 11 18 10.1 18 9 C18 7.9 17.1 7 16 7 C14.9 7 14 7.9 14 9 C14 10.1 14.9 11 16 11 Z M8 11 C9.1 11 10 10.1 10 9 C10 7.9 9.1 7 8 7 C6.9 7 6 7.9 6 9 C6 10.1 6.9 11 8 11 Z M12 20 C9.24 20 6.77 18.87 5.21 17 C6.42 15.63 7.94 14.8 9.59 14.8 C10.5 14.8 11.38 15.05 12.15 15.46 C12.92 15.05 13.8 14.8 14.71 14.8 C16.36 14.8 17.88 15.63 19.09 17 C17.53 18.87 15.06 20 12 20 Z" /></svg>,
    cokolada: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L3 7 v10 c0 5 9 8 9 8 s9-3 9-8 V7 l-9-5 Z M12 4 l6 3 v9 c0 3-6 5-6 5 s-6-2-6-5 V7 l6-3 Z M12 8 c-2.21 0-4 1.79-4 4 s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4 Z" /></svg>,
    cukrovinky: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M9 11 C8.45 11 8 10.55 8 10 C8 9.45 8.45 9 9 9 C9.55 9 10 9.45 10 10 C10 10.55 9.55 11 9 11 Z M12 15 C11.45 15 11 14.55 11 14 C11 13.45 11.45 13 12 13 C12.55 13 13 13.45 13 14 C13 14.55 12.55 15 12 15 Z M15 11 C14.45 11 14 10.55 14 10 C14 9.45 14.45 9 15 9 C15.55 9 16 9.45 16 10 C16 10.55 15.55 11 15 11 Z" /></svg>,
    slane: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13 h2 v8 H3 Z M7 5 h2 v16 H7 Z M11 9 h2 v12 h-2 Z M15 7 h2 v14 h-2 Z M19 11 h2 v10 h-2 Z" /></svg>,
    semienka: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M9 15 L7 13 l1.41-1.41 L9 12.17 l3.59-3.59 L14 10 l-5 5 Z" /></svg>,
    mrazom: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 C6.48 2 2 6.48 2 12 s4.48 10 10 10 10-4.48 10-10 S17.52 2 12 2 Z M12 8 L14.5 16 H9.5 L12 8 Z M8 16 h2 v2 H8 Z M14 16 h2 v2 h-2 Z" /></svg>,
  };
  return icons[id] || <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>;
}

function IngIllus({ id, color }) {
  // Simple SVG icons based on ingredient type
  const getIcon = () => {
    if (id.includes('hady') || id.includes('cerviky')) {
      // wavy/snakes
      return <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3"><path d="M10,30 Q20,20 30,30 T50,30 T70,30 T90,30" strokeLinecap="round" /><path d="M10,50 Q20,40 30,50 T50,50 T70,50 T90,50" strokeLinecap="round" /><path d="M10,70 Q20,60 30,70 T50,70 T70,70 T90,70" strokeLinecap="round" /></svg>;
    }
    if (id.includes('mandle') || id.includes('orechy') || id.includes('kesu') || id.includes('pinia')) {
      // nuts
      return <svg viewBox="0 0 100 100" fill={color}><ellipse cx="50" cy="50" rx="28" ry="32" /><circle cx="50" cy="35" r="8" opacity="0.4" /></svg>;
    }
    if (id.includes('cokolada') || id.includes('_ml') || id.includes('_h') || id.includes('_jog')) {
      // chocolate drops
      return <svg viewBox="0 0 100 100" fill={color}><path d="M50,20 Q60,35 55,50 Q50,60 40,58 Q35,45 50,20 Z" /></svg>;
    }
    if (id.includes('kysle') || id.includes('gumi') || id.includes('medved') || id.includes('zele')) {
      // gummy shapes
      return <svg viewBox="0 0 100 100" fill={color}><rect x="25" y="25" width="50" height="50" rx="8" /></svg>;
    }
    if (id.includes('jahody') || id.includes('maliny') || id.includes('brusnic')) {
      // berries
      return <svg viewBox="0 0 100 100" fill={color}><circle cx="50" cy="50" r="25" /><circle cx="50" cy="32" r="6" opacity="0.5" /><circle cx="65" cy="42" r="5" opacity="0.5" /><circle cx="35" cy="42" r="5" opacity="0.5" /></svg>;
    }
    if (id.includes('slnecn') || id.includes('tekvica') || id.includes('lan') || id.includes('soja')) {
      // seeds
      return <svg viewBox="0 0 100 100" fill={color}><circle cx="35" cy="35" r="4" /><circle cx="65" cy="35" r="4" /><circle cx="50" cy="55" r="4" /><circle cx="35" cy="65" r="4" /><circle cx="65" cy="65" r="4" /><circle cx="50" cy="40" r="3" opacity="0.6" /></svg>;
    }
    if (id.includes('mango') || id.includes('ananas') || id.includes('papaja') || id.includes('figy')) {
      // tropical fruits
      return <svg viewBox="0 0 100 100" fill={color}><path d="M50,20 L65,45 L75,70 L50,80 L25,70 L35,45 Z" /></svg>;
    }
    if (id.includes('hrozno') || id.includes('rozin')) {
      // grapes
      return <svg viewBox="0 0 100 100" fill={color}><circle cx="50" cy="35" r="8" /><circle cx="40" cy="48" r="8" /><circle cx="60" cy="48" r="8" /><circle cx="35" cy="60" r="8" /><circle cx="65" cy="60" r="8" /><circle cx="50" cy="70" r="8" /></svg>;
    }
    if (id.includes('cola') || id.includes('faska')) {
      // bottles
      return <svg viewBox="0 0 100 100" fill={color} stroke={color} strokeWidth="2"><path d="M40,20 L40,35 Q40,40 45,40 L55,40 Q60,40 60,35 L60,20 Z" /><rect x="38" y="40" width="24" height="35" rx="3" opacity="0.8" /></svg>;
    }
    // default - simple circle
    return <svg viewBox="0 0 100 100" fill={color}><circle cx="50" cy="50" r="30" /></svg>;
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {getIcon()}
    </div>
  );
}

export default App;
