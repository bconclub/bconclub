/* Case-study data for /flight. Claims come from the portfolio audit; confirm with each client before going live. */
const wide = '16/9';
const tall = '9/16';
const site = '1440/900';

export const CH = [
  { name: 'Scan2Kare', line: 'A health super app, the website around it, and the films that launched it.', sector: 'Healthcare, Kozhikode', crafts: ['Website', 'App', 'Film'], live: 'https://scan2kare.com', hero: 's2k-hero.mp4', items: [
    { src: 's2k-1.jpg', c: '6 / span 7', ar: wide, t: '0', cap: 'Launch film' },
    { src: 's2k-app-home.webp', c: '2 / span 3', ar: '600/1298', t: '-14vh', cap: 'Patient app: home' },
    { src: 's2k-twin.mp4', c: '6 / span 7', ar: wide, t: '8vh', cap: 'Health twin' },
    { src: 's2k-app-twin.webp', c: '1 / span 2', ar: '600/1298', t: '6vh', cap: 'Health twin' },
    { src: 's2k-app-doctors.webp', c: '4 / span 2', ar: '600/1298', t: '18vh', cap: 'Doctors' },
    { src: 's2k-app-report.webp', c: '7 / span 2', ar: '600/1298', t: '2vh', cap: 'Reports' },
    { src: 's2k-3.jpg', c: '9 / span 4', ar: wide, t: '22vh', cap: 'App in the film' } ] },
  { name: 'PROXe', line: 'Our own AI teammate. It answers every lead across web chat, WhatsApp, Instagram, email and voice.', sector: 'BCON own product', crafts: ['Branding', 'Website', 'App', 'Film'], live: 'https://goproxe.com', hero: 'proxe-hero.mp4', items: [
    { src: 'proxe-1.jpg', c: '1 / span 6', ar: wide, t: '0', cap: 'V1 launch film' },
    { src: 'proxe-dash.mp4', c: '7 / span 6', ar: wide, t: '14vh', cap: 'The dashboard' },
    { src: 'proxe-3.jpg', c: '2 / span 8', ar: wide, t: '6vh', cap: 'Every channel' },
    { src: 'proxe-2.jpg', c: '9 / span 4', ar: wide, t: '-6vh', cap: 'Instagram' } ] },
  { name: 'Windchasers', line: 'The website, the student platform and the films for an aviation academy.', sector: 'Aviation academy, Bangalore', crafts: ['Branding', 'Website', 'App', 'Film'], live: 'https://windchasers.in', hero: 'windchasers-web.jpg', items: [
    { src: 'wc-film.mp4', c: '2 / span 3', ar: tall, t: '0', cap: 'Pilot career webinar' },
    { src: 'windchasers-web.jpg', c: '6 / span 7', ar: site, t: '10vh', cap: 'windchasers.in' },
    { src: 'wc-1.jpg', c: '4 / span 3', ar: tall, t: '6vh', cap: 'Webinar promo' } ] },
  { name: 'WowBus', line: 'A branding engagement and a mascot-led launch film.', sector: 'Arvin Software LLP', crafts: ['Branding', 'Film'], hero: 'wow-hero.mp4', items: [
    { src: 'wow-1.jpg', c: '1 / span 4', ar: tall, t: '0', cap: 'The mascot' },
    { src: 'wow-2.jpg', c: '6 / span 3', ar: tall, t: '14vh', cap: 'Launch film' },
    { src: 'wow-3.jpg', c: '9 / span 4', ar: tall, t: '-6vh', cap: 'On board' } ] },
  { name: '11PC', line: 'Brand guideline, strategy, posters and reels for a pickleball club.', sector: '11 Point Club', crafts: ['Branding', 'Film'], hero: '11pc-launch.jpg', items: [
    { src: '11pc-film.mp4', c: '2 / span 3', ar: tall, t: '0', cap: 'Love All festival' },
    { src: '11pc-event.jpg', c: '6 / span 4', ar: '1/1', t: '12vh', cap: 'Event poster' },
    { src: '11pc-1.jpg', c: '10 / span 3', ar: tall, t: '-4vh', cap: 'Festival reel' } ] },
  { name: 'ISIVIS', line: 'Brand guidelines and logo films for an entertainment group.', sector: 'Entertainment group', crafts: ['Branding', 'Website', 'Film'], hero: 'isivis-hero.jpg', items: [
    { src: 'isivis-stage.jpg', c: '1 / span 7', ar: wide, t: '0', cap: 'Site imagery' },
    { src: 'isivis-talent.mp4', c: '9 / span 3', ar: tall, t: '12vh', cap: 'Talent film' },
    { src: 'isivis-spot.jpg', c: '3 / span 5', ar: wide, t: '-4vh', cap: 'Site imagery' } ] },
  { name: 'Second Spring', line: 'Home-based care for elders in four languages, with a family view on the phone.', sector: 'Elder wellness, Kerala', crafts: ['Website', 'App', 'Film'], live: 'https://second-spring-opal.vercel.app', hero: 'ss-hero.mp4', items: [
    { src: 'ss-1.jpg', c: '1 / span 4', ar: tall, t: '0', cap: 'Launch film' },
    { src: 'ss-4.jpg', c: '6 / span 3', ar: tall, t: '16vh', cap: 'The app' },
    { src: 'ss-alexa.mp4', c: '9 / span 4', ar: tall, t: '-8vh', cap: 'At home' },
    { src: 'ss-3.jpg', c: '3 / span 4', ar: tall, t: '4vh', cap: 'Family, far away' } ] },
  { name: 'YV Homes', line: 'A construction site with packages, a cost calculator and lead intake.', sector: 'Home construction, Bangalore and Mysore', crafts: ['Website', 'Film'], live: 'https://yvhomes.in', hero: 'yv-film.mp4', items: [
    { src: 'yv-web.jpg', c: '1 / span 7', ar: site, t: '0', cap: 'yvhomes.in' },
    { src: 'yv-1.jpg', c: '8 / span 5', ar: wide, t: '14vh', cap: 'Planning to build' },
    { src: 'yv-web2.jpg', c: '3 / span 6', ar: site, t: '4vh', cap: 'How we build' } ] },
  { name: 'Laptop Store', line: 'A storefront and admin with repairs, trade-ins, spares and live inventory sync.', sector: 'Retail and repair, India', crafts: ['Website', 'App', 'Film'], live: 'https://laptopstore.bconclub.com', hero: 'laptop-web.jpg', items: [
    { src: 'laptop-swap.jpg', c: '1 / span 5', ar: '1/1', t: '0', cap: 'Swap Deals film' },
    { src: 'laptop-ad.jpg', c: '7 / span 5', ar: '1/1', t: '14vh', cap: 'Product ad' } ] },
  { name: 'Khadi Vasthra', line: 'An online store for Kerala handloom, with checkout and GST invoices.', sector: 'Handloom, Kerala', crafts: ['Website', 'App'], live: 'https://khadivasthra.com', hero: 'khadi-web.jpg', items: [
    { src: 'khadi-web2.jpg', c: '1 / span 7', ar: site, t: '0', cap: 'Shop by set' },
    { src: 'khadi-web3.jpg', c: '6 / span 7', ar: site, t: '12vh', cap: 'Categories' } ] },
  { name: 'ZenSquare', line: 'A program site and launch film for IGCSE A★ tutoring.', sector: 'IGCSE tutoring', crafts: ['Website', 'Film'], live: 'https://zensquare.bconclub.com', hero: 'zen-film.mp4', items: [
    { src: 'zensquare-web.jpg', c: '1 / span 7', ar: site, t: '0', cap: 'Program site' },
    { src: 'zen-1.jpg', c: '9 / span 3', ar: tall, t: '-4vh', cap: 'Launch film' },
    { src: 'zen-2.jpg', c: '3 / span 3', ar: tall, t: '8vh', cap: 'Specialist tutors' },
    { src: 'zensquare-web2.jpg', c: '7 / span 6', ar: site, t: '-12vh', cap: 'First A★ program' } ] },
  { name: 'Turquoise', line: 'A travel site with destinations, packages and custom itineraries.', sector: 'Turquoise Holidays', crafts: ['Website', 'App'], live: 'https://turquoiseholidays.in', hero: 'tur-hero.mp4', items: [
    { src: 'turquoise-web.jpg', c: '3 / span 8', ar: site, t: '0', cap: 'turquoiseholidays.in' } ] },
  { name: 'Lokazen', line: 'A launch reel for matching brands to commercial spaces.', sector: 'Commercial real estate, Bangalore', crafts: ['Film'], hero: 'lok-hero.mp4', items: [
    { src: 'lok-1.jpg', c: '1 / span 4', ar: tall, t: '0', cap: 'Launch reel' },
    { src: 'lok-3.jpg', c: '6 / span 3', ar: tall, t: '14vh', cap: 'Scout app' },
    { src: 'lok-2.jpg', c: '9 / span 4', ar: tall, t: '-6vh', cap: 'On the street' } ] },
  { name: 'Mr. Boil', line: 'A full brand identity, built around a character.', sector: 'Brand identity', crafts: ['Branding', 'Film'], hero: 'boil-hero.art', items: [
    { src: 'boil-book.art', c: '2 / span 5', ar: '4/3', t: '0', cap: 'Brand book' },
    { src: 'boil-character.art', c: '8 / span 4', ar: '1/1', t: '12vh', cap: 'Character identity' } ] },
  { name: 'Jamaican Kitchen', line: 'Online pickup ordering and a staff dashboard for six restaurants.', sector: 'Restaurants, Connecticut', crafts: ['Website', 'App'], live: 'https://jamaicankitchenct.com', hero: 'jamaican-web.jpg', items: [
    { src: 'jamaican-web2.jpg', c: '3 / span 8', ar: site, t: '0', cap: 'Ordering site' } ] },
  { name: 'Rehvamp', line: 'A full redesign of a charity website.', sector: 'Rehvamp Foundation', crafts: ['Website'], live: 'https://rehvampfoundation.org', hero: 'rehvamp-web.jpg', items: [
    { src: 'rehvamp-web2.jpg', c: '3 / span 8', ar: site, t: '0', cap: 'Heal, grow, inspire' } ] },
  { name: 'Axlrate', line: 'A programmes site with enquiries flowing straight into PROXe.', sector: 'Sales research', crafts: ['Website'], live: 'https://programs.axlrate.com', hero: 'axlrate-web.jpg', items: [
    { src: 'axlrate-web2.jpg', c: '3 / span 8', ar: site, t: '0', cap: 'Programmes' } ] },
  { name: 'Adipoli Affairs', line: 'A restaurant site with menu and cart for Kerala food in Christchurch.', sector: 'Restaurant, New Zealand', crafts: ['Website', 'Film'], live: 'https://adipoliaffairs.com', hero: 'adipoli-hero.mp4', items: [
    { src: 'adipoli-web.jpg', c: '1 / span 7', ar: site, t: '0', cap: 'adipoliaffairs.com' },
    { src: 'adipoli-web2.jpg', c: '6 / span 7', ar: site, t: '12vh', cap: 'The menu' } ] },
];
