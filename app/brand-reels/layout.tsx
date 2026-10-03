import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BCON Brand Reels | AI-Generated Brand Films | BCON Club',
  description:
    'Scroll-stopping 30 and 60 second brand reels from ₹5,000, generated with AI and cut by BCON Club. No shoot, no crew, no studio. Ready for Instagram, Meta Ads and YouTube Shorts.',
  alternates: { canonical: 'https://bconclub.com/brand-reels' },
  openGraph: {
    title: 'BCON Brand Reels | BCON Club',
    description: 'You bring the brief. We bring the film. AI-generated brand reels, cut to the second.',
    url: 'https://bconclub.com/brand-reels',
  },
};

export default function BrandReelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
