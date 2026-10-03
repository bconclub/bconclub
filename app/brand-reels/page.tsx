'use client';

import { useState, useEffect, useRef } from 'react';
import { getMergedUTMParams } from '@/lib/tracking/utm';
import './page.css';

/* ── Vector icons (no emoji) ─────────────────────────────────── */
const ArrowRight = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconFilm = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18" />
  </svg>
);

const IconSpark = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
  </svg>
);

const IconScissors = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconMusic = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const IconPhone = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="2" width="12" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconLayers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconSoundOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const IconSoundOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
  </svg>
);

/* ── Reel wall: short, muted, web-encoded loops in /public/brand-reels ── */
const reels = [
  { src: 'campa-cola', tag: 'Beverage' },
  { src: 'scan2kare', tag: 'Healthcare' },
  { src: 'parachute', tag: 'FMCG' },
  { src: 'wowbus', tag: 'Travel' },
  { src: 'lokazen', tag: 'Mobility' },
  { src: 'proxe', tag: 'AI SaaS' },
  { src: 'comet', tag: 'Footwear' },
];

/* ── BCON-branded 15s teasers (with sound) in /public/brand-reels ── */
const teasers = ['tick', 'countdown', 'wall', 'brief'];

const tiers = [
  { len: '30s', name: 'The Story', price: '₹5,000', per: 'per reel', use: 'Feed ads, Reels and launches. Problem, product, payoff, cut to the beat.' },
  { len: '60s', name: 'The Film', price: '₹10,000', per: 'per reel', use: 'Brand films, YouTube and website heroes. The full world of your brand.' },
  { len: 'Custom', name: 'Your Cut', price: 'Quoted', per: 'by length', use: 'Longer films, a series or a batch of cuts. Priced on the length you need.' },
];

const lengthOptions = [
  { value: '30s', label: '30 seconds (₹5,000)' },
  { value: '60s', label: '60 seconds (₹10,000)' },
  { value: 'Custom', label: 'Custom (quoted by length)' },
];

const faqs = [
  {
    q: 'How much does a reel cost?',
    a: 'A 30 second reel is ₹5,000. A 60 second reel is ₹10,000. Anything longer, or a batch of reels, is quoted by length.'
  },
  {
    q: 'Is this real footage or AI?',
    a: 'AI. Every frame is generated, then directed, edited, scored and finished by our team. No shoot day, no crew, no studio rental, no location permits.'
  },
  {
    q: 'Will it look like my brand?',
    a: 'Yes. We lock your product, logo, colours and tone before a single frame is generated. Your actual product shots are used as reference so packaging and labels stay accurate.'
  },
  {
    q: 'What do I need to send?',
    a: 'A brief: what you sell, who it is for, and the one thing you want people to feel or do. Product photos and your logo help. That is it.'
  },
  {
    q: 'Where can I use the reels?',
    a: 'Anywhere vertical video runs: Instagram Reels, Meta Ads, YouTube Shorts, WhatsApp status, your website. We deliver 9:16 by default and can recut for 1:1 and 16:9.'
  },
  {
    q: 'How many revisions do I get?',
    a: 'We share a concept and a first cut before anything is final, so you shape it early. Changes are tightened together on a call, not over endless email threads.'
  },
  {
    q: 'Can you run the reels as ads too?',
    a: 'Yes. Pair Brand Reels with our AI Lead Machine and we run the campaigns and follow up every lead for you.'
  },
];

interface FormData {
  name: string;
  brand: string;
  phone: string;
  email: string;
  videoLength: string;
}

export default function BrandReelsPage() {
  const [formData, setFormData] = useState<FormData>({ name: '', brand: '', phone: '', email: '', videoLength: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const [soundOn, setSoundOn] = useState<string | null>(null);

  // Reveal [data-reveal] elements as they enter view
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('bbr-in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Only play reel loops while they are on screen (saves battery + data)
  useEffect(() => {
    const vids = [
      ...(teaserRef.current?.querySelectorAll('video') ?? []),
      ...(wallRef.current?.querySelectorAll('video') ?? []),
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.1 }
    );
    vids.forEach((v) => obs.observe(v));
    return () => obs.disconnect();
  }, []);

  // One teaser plays with sound at a time; the rest stay muted
  const toggleSound = (id: string) => {
    const next = soundOn === id ? null : id;
    setSoundOn(next);
    teaserRef.current?.querySelectorAll('video').forEach((v) => {
      v.muted = v.dataset.id !== next;
      if (v.dataset.id === next) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
    if (next && typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'teaser_sound_on', page: 'brand-reels', teaser: next });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const submitToPROXe = async (data: FormData) => {
    try {
      const utm = getMergedUTMParams();
      const res = await fetch('https://proxe.bconclub.com/api/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: `Brand Reels inquiry - Brand: ${data.brand} - Video length: ${data.videoLength}`,
          form_type: 'contact',
          page_url: window.location.href,
          // PROXe requires a non-empty brand or it rejects the lead with 400.
          brand: data.brand?.trim() || data.name?.trim() || 'Brand Reels Lead',
          service: 'brand-reels',
          video_length: data.videoLength,
          utm_source: utm.utm_source || '',
          utm_medium: utm.utm_medium || '',
          utm_campaign: utm.utm_campaign || '',
          utm_term: utm.utm_term || '',
          utm_content: utm.utm_content || '',
        }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        console.error(`PROXe submission rejected (HTTP ${res.status}):`, errBody);
      }
    } catch (e) {
      console.error('PROXe submission failed:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.videoLength) newErrors.videoLength = 'Pick a video length';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'web_lead',
        formType: 'Brand Reels',
        service: 'brand-reels',
        brandName: formData.brand,
        videoLength: formData.videoLength,
      });
    }

    submitToPROXe(formData);

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lead',
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: `BCON Brand Reels - ${formData.videoLength}`,
          brandName: formData.brand,
        },
      }),
    }).catch((err) => console.error('Email notification failed:', err));

    setTimeout(() => {
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        brandName: formData.brand,
        service: 'brand-reels',
        videoLength: formData.videoLength,
      });
      window.location.href = `/thank-you?${params.toString()}`;
    }, 200);
  };

  const scrollToForm = () => {
    document.getElementById('reel-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bbr-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bbr-hero">
        <div className="bbr-hero-badge"><span className="bbr-rec" /> NEW FROM BCON</div>

        <h1 className="bbr-hero-headline">
          <span className="bbr-h-brand">BCON <span className="bbr-accent">Brand Reels</span></span>
          <span className="bbr-h-line">You bring the brief.<br />We bring the film.</span>
        </h1>

        <p className="bbr-hero-sub">
          Scroll-stopping brand reels generated with AI and cut by hand.
          No shoot, no crew, no studio. Just a film that looks like your brand spent a fortune on it.
        </p>

        <div className="bbr-hero-ctas">
          <button className="bbr-cta-btn" onClick={scrollToForm}>
            Get Your First Reel <ArrowRight className="bbr-cta-arrow" />
          </button>
          <a className="bbr-ghost-btn" href="#reels">Watch the reels</a>
        </div>

        <div className="bbr-cut-pills" aria-label="Available lengths">
          <span>30s · ₹5K</span><span>60s · ₹10K</span><span>Custom</span>
        </div>

        <div className="bbr-teasers" ref={teaserRef}>
          {teasers.map((t, i) => (
            <figure className="bbr-teaser" key={t} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <video
                data-id={t}
                src={`/brand-reels/teaser-${t}.mp4`}
                poster={`/brand-reels/teaser-${t}.jpg`}
                muted
                loop
                playsInline
                preload="none"
              />
              <button
                className={`bbr-sound ${soundOn === t ? 'bbr-sound-on' : ''}`}
                onClick={() => toggleSound(t)}
                aria-label={soundOn === t ? 'Mute teaser' : 'Play teaser with sound'}
              >
                {soundOn === t ? <IconSoundOn /> : <IconSoundOff />}
              </button>
            </figure>
          ))}
        </div>
      </section>

      {/* ── REEL WALL ────────────────────────────────────────── */}
      <section className="bbr-wall-section" id="reels">
        <div className="bbr-wall" ref={wallRef}>
          {reels.map((r, i) => (
            <figure className="bbr-reel" key={r.src} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <video
                src={`/brand-reels/${r.src}.mp4`}
                poster={`/brand-reels/${r.src}.jpg`}
                muted
                loop
                playsInline
                preload="none"
              />
              <figcaption>
                <span className="bbr-reel-num">CUT {String(i + 1).padStart(2, '0')}</span>
                <span className="bbr-reel-tag">{r.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="bbr-wall-note">Every frame above is AI-generated. Every cut is made by BCON.</p>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────── */}
      <section className="bbr-section">
        <div className="bbr-container">
          <div className="bbr-section-label">What you get</div>
          <h2 className="bbr-section-heading">A film crew&apos;s output.<br /><span className="bbr-accent">Without the film crew.</span></h2>
          <div className="bbr-grid bbr-grid-3">
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconSpark /></span>
              <h3>Brand-locked visuals</h3>
              <p>Your product, logo, colours and tone, held consistent in every frame. It looks like you, not like a stock AI video.</p>
            </div>
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconScissors /></span>
              <h3>Edited to the second</h3>
              <p>Real editors cut every reel to the beat. Pacing, transitions and the hook in the first second are where reels win or die.</p>
            </div>
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconMusic /></span>
              <h3>Music, captions, sound</h3>
              <p>Scored, captioned and mixed so it lands with the sound on or off. Ready to post the moment it is approved.</p>
            </div>
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconPhone /></span>
              <h3>Made for vertical</h3>
              <p>Shot for 9:16 from the first frame. Built for Instagram Reels, Meta Ads, YouTube Shorts and WhatsApp status.</p>
            </div>
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconLayers /></span>
              <h3>Variations to test</h3>
              <p>Swap hooks, music and CTAs to give your ads multiple versions to test, instead of betting everything on one cut.</p>
            </div>
            <div className="bbr-card" data-reveal>
              <span className="bbr-card-icon"><IconFilm /></span>
              <h3>Any kind of brand</h3>
              <p>Beverage, healthcare, FMCG, travel, tech. If you can describe it, we can put it on screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR CUT ──────────────────────────────────── */}
      <section className="bbr-section" id="pricing">
        <div className="bbr-container">
          <div className="bbr-section-label">Pricing</div>
          <h2 className="bbr-section-heading">Choose your cut. <span className="bbr-accent">Every second earns its place.</span></h2>
          <div className="bbr-grid bbr-grid-3">
            {tiers.map((c) => (
              <div className="bbr-cut" key={c.len} data-reveal>
                <div className="bbr-cut-len">{c.len}</div>
                <h3>{c.name}</h3>
                <div className="bbr-price">{c.price} <span>{c.per}</span></div>
                <p>{c.use}</p>
                <button
                  className="bbr-cut-btn"
                  onClick={() => { setFormData((f) => ({ ...f, videoLength: c.len })); scrollToForm(); }}
                >
                  Choose {c.len} <ArrowRight className="bbr-cta-arrow" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bbr-section">
        <div className="bbr-container">
          <div className="bbr-section-label">How it works</div>
          <h2 className="bbr-section-heading">Brief to film in <span className="bbr-accent">days, not weeks.</span></h2>
          <ol className="bbr-steps">
            <li data-reveal>
              <span className="bbr-step-num">01</span>
              <div><h3>Brief</h3><p>Tell us what you sell, who it is for and what you want them to do. Send product photos and your logo.</p></div>
            </li>
            <li data-reveal>
              <span className="bbr-step-num">02</span>
              <div><h3>Concept</h3><p>We write the idea, the hook and a shot list. You approve the direction before anything is generated.</p></div>
            </li>
            <li data-reveal>
              <span className="bbr-step-num">03</span>
              <div><h3>Generate</h3><p>Our AI pipeline builds every scene, frame-locked to your brand and product.</p></div>
            </li>
            <li data-reveal>
              <span className="bbr-step-num">04</span>
              <div><h3>Cut</h3><p>Editors cut, score, caption and finish it. You review the first cut and we tighten it together.</p></div>
            </li>
            <li data-reveal>
              <span className="bbr-step-num">05</span>
              <div><h3>Deliver</h3><p>Final files in every format you need, ready to post or run as ads.</p></div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────── */}
      <section className="bbr-section">
        <div className="bbr-container">
          <div className="bbr-section-label">Why Brand Reels</div>
          <h2 className="bbr-section-heading">The old way vs <span className="bbr-accent">the BCON way.</span></h2>
          <div className="bbr-compare">
            <div className="bbr-compare-col bbr-compare-old">
              <h3>Traditional shoot</h3>
              <ul>
                <li>Crew, cast, studio, location</li>
                <li>Weeks of pre-production</li>
                <li>One shoot day, one set of shots</li>
                <li>Reshoots cost as much as the shoot</li>
                <li>One big video, little to test</li>
              </ul>
            </div>
            <div className="bbr-compare-col bbr-compare-new">
              <h3>BCON Brand Reels</h3>
              <ul>
                <li><IconCheck /> No shoot. Just a brief</li>
                <li><IconCheck /> Concept to cut in days</li>
                <li><IconCheck /> Any world, any scene, any product shot</li>
                <li><IconCheck /> Changes without a reshoot</li>
                <li><IconCheck /> Multiple cuts to test and scale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────── */}
      <section className="bbr-section bbr-form-section" id="reel-form">
        <div className="bbr-container bbr-form-wrap">
          <div className="bbr-form-copy">
            <div className="bbr-section-label">Start your reel</div>
            <h2 className="bbr-section-heading">Tell us your brand.<br /><span className="bbr-accent">We&apos;ll pitch the film.</span></h2>
            <p>We&apos;ll come back with a concept for your first reel. 30s for ₹5,000, 60s for ₹10,000, longer cuts quoted by length. No commitment until you like the idea.</p>
          </div>
          <form className="bbr-form" onSubmit={handleSubmit} noValidate>
            {([
              { name: 'name', label: 'Your name', type: 'text', placeholder: 'Full name' },
              { name: 'brand', label: 'Brand name', type: 'text', placeholder: 'What is your brand called?' },
              { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@brand.com' },
            ] as const).map((f) => (
              <label className="bbr-field" key={f.name}>
                <span>{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className={errors[f.name] ? 'bbr-input-error' : ''}
                />
                {errors[f.name] && <em className="bbr-error">{errors[f.name]}</em>}
              </label>
            ))}
            <label className="bbr-field">
              <span>Video length</span>
              <select
                name="videoLength"
                value={formData.videoLength}
                onChange={handleChange}
                className={errors.videoLength ? 'bbr-input-error' : ''}
              >
                <option value="" disabled>Pick a length</option>
                {lengthOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.videoLength && <em className="bbr-error">{errors.videoLength}</em>}
            </label>
            <button type="submit" className="bbr-cta-btn bbr-submit" disabled={submitting}>
              {submitting ? 'Sending...' : <>Get My Reel Concept <ArrowRight className="bbr-cta-arrow" /></>}
            </button>
          </form>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bbr-section">
        <div className="bbr-container bbr-faq-wrap">
          <div className="bbr-section-label">FAQ</div>
          <h2 className="bbr-section-heading">Questions, answered.</h2>
          <div className="bbr-faq">
            {faqs.map((f, i) => (
              <div className={`bbr-faq-item ${openFaq === i ? 'bbr-faq-open' : ''}`} key={f.q}>
                <button className="bbr-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.q}
                  <span className="bbr-faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="bbr-faq-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="bbr-section bbr-final">
        <div className="bbr-container">
          <h2 className="bbr-final-heading">Your brand deserves a film.<br /><span className="bbr-accent">Not a slideshow.</span></h2>
          <button className="bbr-cta-btn bbr-cta-large" onClick={scrollToForm}>
            Get Your First Reel <ArrowRight className="bbr-cta-arrow" />
          </button>
        </div>
      </section>

      <footer className="bbr-footer">
        <div className="bbr-container">
          <p>© 2026 BCON Club. All rights reserved.</p>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
