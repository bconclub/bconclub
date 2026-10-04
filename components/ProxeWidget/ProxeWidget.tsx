'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/shared/Icons';
import './ProxeWidget.css';

// /proxe now lives at goproxe.com (standalone). /proxe-cfs still hides the
// embed widget so the security/platform page reads cleanly.
const HIDDEN_ROUTES = ['/proxe-cfs'];
// Pages that show the floating WhatsApp button above the PROXe bubble,
// each with its own prefilled message.
const WHATSAPP_PAGES: Record<string, string> = {
  '/lead-machine': 'https://wa.me/6360079756?text=Hi%2C%20I%20wanted%20to%20know%20more%20about%20AI%20Lead%20Machine.',
  '/brand-reels': 'https://wa.me/6360079756?text=Hi%2C%20I%20want%20to%20know%20more%20about%20BCON%20Brand%20Reels.',
};

export default function ProxeWidget() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const whatsAppRoute = Object.keys(WHATSAPP_PAGES).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const showWhatsApp = Boolean(whatsAppRoute);

  useEffect(() => {
    if (shouldHide || !showWhatsApp) return;

    const syncWidgetStack = () => {
      const whatsapp = document.querySelector<HTMLElement>('.proxe-whatsapp-button');
      if (!whatsapp) return;

      const isMobile = window.innerWidth <= 640;
      const right = isMobile ? 18 : 24;
      const bottom = isMobile ? 18 : 24;
      const gap = isMobile ? 24 : 22;

      const proxeElements = Array.from(document.body.querySelectorAll<HTMLElement>('iframe, [id*="proxe" i], [class*="proxe" i]'))
        .filter((element) => {
          if (element === whatsapp || whatsapp.contains(element)) return false;
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          const src = element.getAttribute('src')?.toLowerCase() || '';
          const looksLikeProxe = src.includes('proxe.bconclub.com') || element.id.toLowerCase().includes('proxe') || String(element.className).toLowerCase().includes('proxe');

          return looksLikeProxe && style.position === 'fixed' && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        });

      const panelIsOpen = proxeElements.some((element) => {
        const rect = element.getBoundingClientRect();
        // The bubble iframe is narrow but can be tall (~88x165), so only a
        // frame that is both wide and tall counts as the open chat panel.
        return rect.width > 140 && rect.height > 140;
      });

      if (panelIsOpen) {
        whatsapp.style.setProperty('opacity', '0');
        whatsapp.style.setProperty('pointer-events', 'none');
        return;
      }

      const candidates = proxeElements
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const isButtonSized = rect.width >= 40 && rect.width <= 96 && rect.height >= 40 && rect.height <= 200;
          const isBottomRight = window.innerWidth - rect.right <= 140 && window.innerHeight - rect.bottom <= 220;

          return isButtonSized && isBottomRight;
        })
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return (window.innerHeight - aRect.bottom) - (window.innerHeight - bRect.bottom);
        });

      const beacon = candidates[0];

      if (beacon) {
        const beaconRect = beacon.getBoundingClientRect();
        const whatsappRect = whatsapp.getBoundingClientRect();
        const whatsappLeft = beaconRect.left + ((beaconRect.width - whatsappRect.width) / 2);

        whatsapp.style.setProperty('opacity', '1');
        whatsapp.style.setProperty('pointer-events', 'auto');
        whatsapp.style.setProperty('left', `${Math.round(whatsappLeft)}px`);
        whatsapp.style.setProperty('right', 'auto');
        // The visible bubble sits at the bottom of its frame and is about as
        // tall as the frame is wide, so stack above that, not the whole frame.
        const bubbleHeight = Math.min(beaconRect.height, beaconRect.width);
        const beaconBottom = window.innerHeight - beaconRect.bottom;
        whatsapp.style.setProperty('bottom', `${Math.round(beaconBottom + bubbleHeight + gap)}px`);
        return;
      }

      whatsapp.style.setProperty('opacity', '1');
      whatsapp.style.setProperty('pointer-events', 'auto');
      whatsapp.style.setProperty('left', 'auto');
      whatsapp.style.setProperty('right', `${right}px`);
      whatsapp.style.setProperty('bottom', `${bottom + 56 + gap}px`);
    };

    const interval = window.setInterval(syncWidgetStack, 500);
    const timeout = window.setTimeout(syncWidgetStack, 100);
    window.addEventListener('resize', syncWidgetStack);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      window.removeEventListener('resize', syncWidgetStack);
    };
  }, [shouldHide, showWhatsApp]);

  if (shouldHide) return null;

  const handleWhatsAppClick = () => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'whatsapp_click', source: 'floating_widget', page: pathname });
    }
  };

  return (
    <>
      <Script
        src="https://proxe.bconclub.com/api/widget/embed.js"
        strategy="afterInteractive"
      />
      {showWhatsApp && (
        <a
          className="proxe-whatsapp-button"
          href={whatsAppRoute ? WHATSAPP_PAGES[whatsAppRoute] : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with BCON on WhatsApp"
          title="WhatsApp"
          onClick={handleWhatsAppClick}
        >
          <WhatsAppIcon size={32} />
        </a>
      )}
    </>
  );
}



