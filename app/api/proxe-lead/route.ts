import { NextRequest, NextResponse } from 'next/server';

// Server-side relay from bconclub.com forms to PROXe.
//
// Why a relay instead of posting from the browser:
// 1. proxe.bconclub.com/api/website sends no CORS allow-origin header for
//    bconclub.com, so browsers block the request ("Failed to fetch").
// 2. PROXe files a lead under `brand`, and the BCON dashboard only shows
//    brand = 'bcon'. Forms used to send the customer's own brand there, which
//    PROXe rejects with a 500. The relay always sends 'bcon' and keeps the
//    customer's brand in the message instead.
const PROXE_WEBSITE_URL = 'https://proxe.bconclub.com/api/website';
const PROXE_BRAND = 'bcon';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  if (!name || (!email && !phone)) {
    return NextResponse.json({ success: false, error: 'Name and a phone or email are required' }, { status: 400 });
  }

  const customerBrand = str(body.customer_brand);
  const message = [str(body.message), customerBrand && `Customer brand: ${customerBrand}`]
    .filter(Boolean)
    .join(' | ');

  const payload = {
    ...body,
    name,
    email,
    phone,
    message,
    brand: PROXE_BRAND,
    // PROXe reads service_interest for its WhatsApp welcome; mirror service into it.
    service_interest: str(body.service_interest) || str(body.service),
  };

  try {
    const res = await fetch(PROXE_WEBSITE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`PROXe lead rejected (HTTP ${res.status}):`, text);
    }
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    console.error('PROXe lead relay failed:', error);
    return NextResponse.json({ success: false, error: 'PROXe unreachable' }, { status: 502 });
  }
}
