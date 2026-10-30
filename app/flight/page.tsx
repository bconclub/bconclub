import type { Metadata } from 'next';
import Flight from '@/components/Flight/Flight';
import './flight.css';

export const metadata: Metadata = {
  title: 'BCON | Flight preview',
  robots: { index: false, follow: false },
};

export default function FlightPage() {
  return <Flight />;
}
