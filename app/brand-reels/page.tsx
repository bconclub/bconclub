'use client';

import { useState, useEffect, useRef } from 'react';
import { getMergedUTMParams } from '@/lib/tracking/utm';
import { WhatsAppIcon } from '@/components/shared/Icons';
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

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const WHATSAPP_URL = 'https://wa.me/6360079756?text=Hi%2C%20I%20want%20to%20know%20more%20about%20BCON%20Brand%20Reels.';

/* ── Reel wall: short, muted, web-encoded loops in /public/brand-reels ── */
const reels = [
  { src: 'campa-cola', tag: 'Beverage' },
  { src: 'scan2kare', tag: 'Healthcare' },
  { src: 'parachute', tag: 'FMCG' },
  { src: 'wowbus', tag: 'Travel' },
  { src: 'lokazen', tag: 'Real estate' },
  { src: 'proxe', tag: 'AI SaaS' },
  { src: 'comet', tag: 'Footwear' },
];

/* ── Finished client reels, full length with original audio ── */
const work = [
  { id: 'scan2kare', len: '1 min reel', tag: 'Healthcare' },
  { id: 'lokazen', len: '1 min reel', tag: 'Real estate' },
  { id: 'proxe-health', len: '30s reel', tag: 'AI SaaS · Healthcare' },
  { id: 'proxe-realestate', len: '30s reel', tag: 'AI SaaS · Real estate' },
];

// The workflow every reel follows (hero timeline)
const flow = [
  { h: 'Script', p: 'Written for you' },
  { h: 'Visual board', p: 'Every frame planned' },
  { h: 'Review', p: 'Edit to your liking' },
  { h: 'Final reel', p: 'Music + captions' },
];

// Languages we make reels in, shown in their own scripts
const languages = [
  { native: 'ಕನ್ನಡ', name: 'Kannada' },
  { native: 'தமிழ்', name: 'Tamil' },
  { native: 'తెలుగు', name: 'Telugu' },
  { native: 'മലയാളം', name: 'Malayalam' },
  { native: 'हिन्दी', name: 'Hindi' },
  { native: 'मराठी', name: 'Marathi' },
  { native: 'বাংলা', name: 'Bengali' },
  { native: 'ગુજરાતી', name: 'Gujarati' },
  { native: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { native: 'ଓଡ଼ିଆ', name: 'Odia' },
  { native: 'ತುಳು', name: 'Tulu' },
  { native: 'कोंकणी', name: 'Konkani' },
  { native: 'भोजपुरी', name: 'Bhojpuri' },
  { native: 'English', name: 'English' },
];

// What you get: shown as an auto-scrolling carousel
const features = [
  { icon: <IconSpark />, h: 'Brand-locked visuals', p: 'Your product, logo, colours and tone, held consistent in every frame.' },
  { icon: <IconScissors />, h: 'Edited to the second', p: 'Real editors cut every reel to the beat, with the hook in the first second.' },
  { icon: <IconMusic />, h: 'Music, captions, sound', p: 'Scored, captioned and mixed so it lands with the sound on or off.' },
  { icon: <IconPhone />, h: 'Made for vertical', p: 'Built for Instagram Reels, Meta Ads, YouTube Shorts and WhatsApp status.' },
  { icon: <IconLayers />, h: 'Variations to test', p: 'Swap hooks, music and CTAs so your ads have more than one cut to test.' },
  { icon: <IconFilm />, h: 'Any kind of brand', p: 'Beverage, healthcare, FMCG, travel, tech. If you can describe it, we can film it.' },
];

const tiers = [
  { len: '30s', name: 'The Story', price: '₹5,000', per: 'per reel', speed: '4 hours', use: 'Feed ads, Reels and launches. Problem, product, payoff, cut to the beat.' },
  { len: '60s', name: 'The Film', price: '₹10,000', per: 'per reel', speed: '8 hours', use: 'Brand films, YouTube and website heroes. The full world of your brand.' },
  { len: 'Custom', name: 'Your Cut', price: 'Quoted', per: 'by length', speed: '', use: 'Longer films, a series or a batch of cuts. Priced on the length you need.' },
];

const IconPen = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconBoard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const reelLengths = [
  { value: '30s', label: '30 seconds', hint: 'Ads, Reels, quick hooks' },
  { value: '60s', label: '60 seconds', hint: 'Brand films, launches' },
  { value: 'Custom', label: 'Custom', hint: 'Longer or a series' },
];

const reelTypes = [
  { value: 'Ad', label: 'Ad', hint: 'Meta / Google ads' },
  { value: 'Social post', label: 'Social post', hint: 'Instagram, YouTube Shorts' },
  { value: 'Product launch', label: 'Product launch', hint: 'New product or offer' },
  { value: 'Brand film', label: 'Brand film', hint: 'Your story, website hero' },
  { value: 'Other', label: 'Something else', hint: 'Tell us on WhatsApp' },
];

// What every reel order includes, whatever the length
const includes = [
  'A complete script',
  'A visual board: frame-by-frame storyboard of your reel',
  'Review: up to 3 changes on the board before we generate',
  'Final reel, vertical, with music + captions',
];

const inHouse = [
  { icon: <IconPen />, h: 'Script', p: 'Written by our team around your brief.' },
  { icon: <IconBoard />, h: 'Visual board', p: 'Every frame planned before it is made.' },
  { icon: <IconSpark />, h: 'AI generation', p: 'Run on our own pipeline, locked to your brand.' },
  { icon: <IconScissors />, h: 'Edit + sound', p: 'Cut, scored and captioned by our editors.' },
];

const faqs = [
  {
    q: 'How much does a reel cost?',
    a: 'A 30 second reel is ₹5,000. A 60 second reel is ₹10,000. Anything longer, or a batch of reels, is quoted by length. Every order includes the script, the visual board, up to 3 changes and the final reel with music and captions.'
  },
  {
    q: 'How fast do I get my reel?',
    a: 'Once your script is final, a 30 second reel is delivered in 4 hours and a 60 second reel in 8 hours. Our average delivery time is under 8 hours.'
  },
  {
    q: 'Which languages do you make reels in?',
    a: 'Kannada, Tamil, Telugu, Malayalam, Hindi, Marathi, Bengali, Gujarati, Punjabi, Odia, Tulu, Konkani, Bhojpuri, English and more. Tell us the language your customers speak.'
  },
  {
    q: 'Is this real footage or AI?',
    a: 'AI. Every frame is generated, then directed, edited, scored and finished by our team. No shoot day, no crew, no studio rental, no location permits.'
  },
  {
    q: 'Do I get to make changes?',
    a: 'Yes, before anything is generated. You get the complete script and a frame-by-frame visual board first, and you can ask for up to 3 changes. Only then do we generate and cut the reel.'
  },
  {
    q: 'Will it look like my brand?',
    a: 'Yes. We lock your product, logo, colours and tone before a single frame is generated. Your actual product shots are used as reference so packaging and labels stay accurate.'
  },
];

interface Lead {
  name: string;
  brand: string;
  phone: string;
  videoLength: string;
  reelType: string;
}

const pushEvent = (data: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) (window as any).dataLayer.push(data);
};

const submitToPROXe = async (data: Lead, source: string) => {
  try {
    const utm = getMergedUTMParams();
    const res = await fetch('https://proxe.bconclub.com/api/website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: '',
        phone: data.phone || '',
        message: `Brand Reels inquiry (${source}) - Brand: ${data.brand || 'n/a'} - Length: ${data.videoLength} - Type: ${data.reelType}`,
        form_type: 'contact',
        page_url: window.location.href,
        // PROXe requires a non-empty brand or it rejects the lead with 400.
        brand: data.brand?.trim() || data.name?.trim() || 'Brand Reels Lead',
        service: 'brand-reels',
        video_length: data.videoLength,
        reel_type: data.reelType,
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

/* ── Step-by-step reel form: length → type → details ── */
function ReelForm({ source, initialLength = '', onDone }: { source: string; initialLength?: string; onDone?: () => void }) {
  const [step, setStep] = useState(initialLength ? 1 : 0);
  const [lead, setLead] = useState<Lead>({ name: '', brand: '', phone: '', videoLength: initialLength, reelType: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const pick = (key: 'videoLength' | 'reelType', value: string) => {
    setLead((l) => ({ ...l, [key]: value }));
    setErr('');
    setStep((s) => s + 1);
    pushEvent({ event: 'brand_reels_form_step', source, step: key, value });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name.trim()) { setErr('Please enter your name'); return; }
    const digits = lead.phone.replace(/\D/g, '').slice(-10);
    if (digits.length !== 10) { setErr('Please enter a valid 10 digit WhatsApp number'); return; }
    setErr('');
    const phone = `+91${digits}`;
    const data = { ...lead, name: lead.name.trim(), brand: lead.brand.trim(), phone };

    pushEvent({ event: 'web_lead', formType: 'Brand Reels', source, service: 'brand-reels', videoLength: data.videoLength, reelType: data.reelType });
    // Inline success (no /thank-you redirect), so fire the Meta Lead event here.
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'Brand Reels' });
    }

    submitToPROXe(data, source);
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lead',
        data: {
          name: data.name,
          phone,
          service: `BCON Brand Reels - ${data.videoLength} ${data.reelType} (${source})`,
          brandName: data.brand,
        },
      }),
    }).catch((error) => console.error('Email notification failed:', error));

    setDone(true);
  };

  if (done) {
    return (
      <div className="bbr-rf-done">
        <span className="bbr-rf-done-icon"><IconCheck /></span>
        <h3>Got it, {lead.name.trim().split(' ')[0]}.</h3>
        <p>We&apos;ll reach out on WhatsApp shortly to take your brief.</p>
        {onDone && <button className="bbr-cta-btn" onClick={onDone}>Done</button>}
      </div>
    );
  }

  const steps = ['Length', 'Type', 'Details'];

  return (
    <div className="bbr-rf">
      <div className="bbr-rf-progress" aria-label={`Step ${step + 1} of 3`}>
        {steps.map((label, i) => (
          <span key={label} className={`bbr-rf-bar ${i <= step ? 'bbr-rf-bar-on' : ''}`}>
            <i>{label}</i>
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="bbr-rf-step" key="s0">
          <h3>How long is your reel?</h3>
          <div className="bbr-rf-options">
            {reelLengths.map((o) => (
              <button type="button" key={o.value} className={`bbr-rf-opt ${lead.videoLength === o.value ? 'bbr-rf-opt-on' : ''}`} onClick={() => pick('videoLength', o.value)}>
                <b>{o.label}</b><span>{o.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bbr-rf-step" key="s1">
          <h3>What is the reel for?</h3>
          <div className="bbr-rf-options">
            {reelTypes.map((o) => (
              <button type="button" key={o.value} className={`bbr-rf-opt ${lead.reelType === o.value ? 'bbr-rf-opt-on' : ''}`} onClick={() => pick('reelType', o.value)}>
                <b>{o.label}</b><span>{o.hint}</span>
              </button>
            ))}
          </div>
          <button type="button" className="bbr-rf-back" onClick={() => setStep(0)}>← Back</button>
        </div>
      )}

      {step === 2 && (
        <form className="bbr-rf-step" key="s2" onSubmit={submit} noValidate>
          <h3>Where do we send your script?</h3>
          <p className="bbr-rf-summary">{lead.videoLength} reel · {lead.reelType}</p>
          <input className="bbr-rf-input" type="text" placeholder="Your name" aria-label="Your name" autoFocus
            value={lead.name} onChange={(e) => { setLead({ ...lead, name: e.target.value }); setErr(''); }} />
          <input className="bbr-rf-input" type="text" placeholder="Brand name (optional)" aria-label="Brand name"
            value={lead.brand} onChange={(e) => setLead({ ...lead, brand: e.target.value })} />
          <div className="bbr-rf-phone">
            <span>+91</span>
            <input type="tel" inputMode="numeric" placeholder="WhatsApp number" aria-label="WhatsApp number"
              value={lead.phone} onChange={(e) => { setLead({ ...lead, phone: e.target.value }); setErr(''); }} />
          </div>
          {err && <em className="bbr-error">{err}</em>}
          <button type="submit" className="bbr-cta-btn bbr-submit">
            Start My Reel <ArrowRight className="bbr-cta-arrow" />
          </button>
          <button type="button" className="bbr-rf-back" onClick={() => setStep(1)}>← Back</button>
        </form>
      )}
    </div>
  );
}

export default function BrandReelsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const [soundOn, setSoundOn] = useState<string | null>(null);

  // Quick popup form (name + phone + length) opened from every CTA
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLength, setModalLength] = useState('');
  const [modalKey, setModalKey] = useState(0);

  // Reveal [data-reveal] elements as they enter view. Uses a data attribute,
  // not a class, so React re-renders of className never undo the reveal.
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Only play reels while they are on screen (saves battery + data)
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

  // Modal: lock page scroll, close on Escape, focus the first field
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => document.querySelector<HTMLButtonElement>('.bbr-modal .bbr-rf-opt')?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [modalOpen]);

  // One reel plays with sound at a time; the rest stay muted
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
    if (next) pushEvent({ event: 'reel_sound_on', page: 'brand-reels', reel: next });
  };

  const openModal = (videoLength = '', source = 'cta') => {
    setModalLength(videoLength);
    setModalKey((k) => k + 1); // fresh form each time it opens
    setModalOpen(true);
    pushEvent({ event: 'brand_reels_modal_open', source });
  };

  const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as React.CSSProperties;

  return (
    <div className="bbr-page">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="bbr-header">
        <div className="bbr-header-inner">
          <a href="/" className="bbr-logo" aria-label="BCON Club home">
            <img src="/BCON White logo.webp" alt="BCON" width={106} height={40} />
          </a>
          <div className="bbr-header-actions">
            <a
              className="bbr-wa-btn"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              onClick={() => pushEvent({ event: 'whatsapp_click', source: 'brand_reels_header' })}
            >
              <WhatsAppIcon size={20} />
            </a>
            <button className="bbr-header-cta" onClick={() => openModal('', 'header')} aria-label="Start my reel">
              <ArrowRight />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bbr-hero">
        <div className="bbr-hero-badge bbr-enter" style={d(0)}><span className="bbr-rec" /> BCON BRAND REELS</div>

        <h1 className="bbr-hero-headline">
          <span className="bbr-h-top bbr-enter" style={d(100)}>Your story,</span>
          <span className="bbr-h-bottom bbr-enter" style={d(220)}>told at the <span className="bbr-h-price">speed of AI.</span></span>
        </h1>

        <p className="bbr-hero-sub bbr-enter" style={d(380)}>
          From script to final frame.<br />
          <strong>Generated with AI, directed by people.</strong>
        </p>

        <ol className="bbr-flow" aria-label="How every reel is made">
          {flow.map((f, i) => (
            <li key={f.h} className="bbr-enter" style={d(500 + i * 90)}>
              <span className="bbr-flow-dot">{String(i + 1).padStart(2, '0')}</span>
              <span className="bbr-flow-h">{f.h}</span>
              <span className="bbr-flow-p">{f.p}</span>
            </li>
          ))}
        </ol>

        <div className="bbr-hero-ctas bbr-enter" style={d(860)}>
          <button className="bbr-cta-btn" onClick={() => openModal('', 'hero')}>
            Start My Reel <ArrowRight className="bbr-cta-arrow" />
          </button>
          <a
            className="bbr-ghost-btn"
            href="#reels"
            onClick={(e) => {
              // Lenis smooth-scroll swallows plain hash jumps, so scroll explicitly
              e.preventDefault();
              document.getElementById('reels')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              pushEvent({ event: 'see_reels_click', page: 'brand-reels' });
            }}
          >
            See our reels
          </a>
        </div>

        <p className="bbr-hero-proof bbr-enter" style={d(960)}>
          <b>No shoot.</b> <b>No crew.</b> <b>No studio.</b>
          <span className="bbr-hero-proof-sep" />
          Every kind of brand, one studio.
        </p>

        <div className="bbr-teasers" id="reels" ref={teaserRef}>
          {work.map(({ id: t, len, tag }, i) => (
            <figure
              className={`bbr-teaser ${soundOn === t ? 'bbr-teaser-live' : ''}`}
              key={t}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              onClick={() => toggleSound(t)}
            >
              <video
                data-id={t}
                src={`/brand-reels/work-${t}.mp4`}
                poster={`/brand-reels/work-${t}.jpg`}
                muted
                loop
                playsInline
                preload="none"
              />
              <button
                className={`bbr-sound ${soundOn === t ? 'bbr-sound-on' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSound(t); }}
                aria-label={soundOn === t ? `Mute ${tag} reel` : `Play ${tag} reel with sound`}
              >
                {soundOn === t ? <IconSoundOn /> : <IconSoundOff />}
              </button>
              <figcaption className="bbr-teaser-meta">
                <span className="bbr-teaser-len">{len}</span>
                <span className="bbr-teaser-tag">{tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── REEL WALL ────────────────────────────────────────── */}
      <section className="bbr-wall-section">
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
      </section>

      {/* ── LANGUAGES ────────────────────────────────────────── */}
      <section className="bbr-langs" aria-label="Languages we make reels in">
        <div className="bbr-container">
          <div className="bbr-section-label">Every language your customers speak</div>
        </div>
        <div className="bbr-marquee bbr-marquee-langs">
          <div className="bbr-marquee-track">
            {[...languages, ...languages].map((l, i) => (
              <span className="bbr-lang" key={i} aria-hidden={i >= languages.length} lang="">
                <b>{l.native}</b>
                {l.native !== l.name && <i>{l.name}</i>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET (carousel) ──────────────────────────── */}
      <section className="bbr-section bbr-get">
        <div className="bbr-container">
          <div className="bbr-section-label">What you get</div>
          <h2 className="bbr-section-heading">A film crew&apos;s output. <span className="bbr-accent">Without the film crew.</span></h2>
        </div>
        <div className="bbr-marquee bbr-marquee-cards">
          <div className="bbr-marquee-track">
            {[...features, ...features].map((f, i) => (
              <div className="bbr-card bbr-marquee-card" key={i} aria-hidden={i >= features.length}>
                <span className="bbr-card-icon">{f.icon}</span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING + SPEED ──────────────────────────────────── */}
      <section className="bbr-section" id="pricing">
        <div className="bbr-container">
          <div className="bbr-section-label">Pricing</div>
          <h2 className="bbr-section-heading">Choose your reel. <span className="bbr-accent">Delivered in hours.</span></h2>

          <div className="bbr-speed" data-reveal>
            <div className="bbr-speed-item bbr-speed-main">
              <span className="bbr-speed-num">&lt; 8 hrs</span>
              <span className="bbr-speed-label">Average delivery time</span>
            </div>
            <div className="bbr-speed-item">
              <span className="bbr-speed-num">4 hrs</span>
              <span className="bbr-speed-label">30 second reel</span>
            </div>
            <div className="bbr-speed-item">
              <span className="bbr-speed-num">8 hrs</span>
              <span className="bbr-speed-label">60 second reel</span>
            </div>
            <p className="bbr-speed-note">Delivery clock starts once your script is final.</p>
          </div>

          <div className="bbr-grid bbr-grid-3">
            {tiers.map((c) => (
              <div className="bbr-cut" key={c.len} data-reveal>
                <div className="bbr-cut-len">{c.len}</div>
                <h3>{c.name}</h3>
                <div className="bbr-price">{c.price} <span>{c.per}</span></div>
                <div className="bbr-cut-speed">
                  <IconClock /> {c.speed ? <span>Delivered in <b>{c.speed}</b> once the script is final</span> : <span>Delivery time agreed with you</span>}
                </div>
                <p>{c.use}</p>
                <ul className="bbr-includes">
                  {includes.map((item) => (
                    <li key={item}><IconCheck /> {item}</li>
                  ))}
                </ul>
                <button className="bbr-cut-btn" onClick={() => openModal(c.len, `pricing_${c.len}`)}>
                  Choose {c.len} <ArrowRight className="bbr-cta-arrow" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO + FORM ────────────────────────────────── */}
      <section className="bbr-section bbr-form-section" id="reel-form">
        <div className="bbr-container bbr-form-wrap">
          <div className="bbr-form-copy">
            <div className="bbr-section-label">What we do</div>
            <h2 className="bbr-section-heading">One studio.<br /><span className="bbr-accent">Every step in-house.</span></h2>
            <p>
              No freelancers, no outsourcing, no handoffs. The same team writes your script, plans every frame,
              runs the AI and cuts the film. That&apos;s how we deliver in hours without losing your story.
            </p>
            <ol className="bbr-inhouse">
              {inHouse.map((s) => (
                <li key={s.h}>
                  <span className="bbr-inhouse-icon">{s.icon}</span>
                  <div><h3>{s.h}</h3><p>{s.p}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="bbr-form">
            <ReelForm source="form" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bbr-section">
        <div className="bbr-container">
          <div className="bbr-section-label">How it works</div>
          <h2 className="bbr-section-heading">Pick it. Brief it. <span className="bbr-accent">Approve it. Done.</span></h2>
          <ol className="bbr-steps">
            {[
              { h: 'Pick your reel', p: 'Choose 30s, 60s or a custom length.' },
              { h: 'Share your brief', p: 'What you sell, who it is for, the language and what you want them to do.' },
              { h: 'Script + visual board', p: 'We send the complete script and a frame-by-frame visual board of your reel.' },
              { h: 'Review + changes', p: 'You review the board and ask for up to 3 changes. We revise before anything is generated.' },
              { h: 'Generate + cut', p: 'Our AI pipeline builds every scene, then editors cut, score and caption it.' },
              { h: 'Delivered', p: 'Your final vertical reel in hours, with music and captions, ready to post or run as ads.' },
            ].map((step, i) => (
              <li data-reveal key={step.h}>
                <span className="bbr-step-num">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{step.h}</h3><p>{step.p}</p></div>
              </li>
            ))}
          </ol>
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
          <h2 className="bbr-final-heading">Get your reels done<br /><span className="bbr-accent">starting from ₹5K.</span></h2>
          <button className="bbr-cta-btn bbr-cta-large" onClick={() => openModal('', 'final')}>
            Start My Reel <ArrowRight className="bbr-cta-arrow" />
          </button>
        </div>
      </section>

      <footer className="bbr-footer">
        <div className="bbr-container">
          <p>© 2026 BCON Club. All rights reserved.</p>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </footer>

      {/* ── QUICK POPUP FORM ─────────────────────────────────── */}
      {modalOpen && (
        <div className="bbr-modal" role="dialog" aria-modal="true" aria-labelledby="bbr-modal-title" onClick={() => setModalOpen(false)}>
          <div className="bbr-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="bbr-modal-close" onClick={() => setModalOpen(false)} aria-label="Close"><IconClose /></button>
            <h3 id="bbr-modal-title" className="bbr-modal-title">Start your reel</h3>
            <ReelForm key={modalKey} source="popup" initialLength={modalLength} onDone={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
