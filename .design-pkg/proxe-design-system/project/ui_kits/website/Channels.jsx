// PROXe — Channel Solution Card grid
// "Where PROXe lives" — a row of frosted cards, each with a channel-tinted icon.

// Inline SVGs render the actual stroke glyph (CSS mask was filling the bounding box).
const ICON = {
  browser: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <path d="M2.5 9H21.5" />
      <circle cx="7" cy="6" r="0.5" fill="currentColor" />
      <circle cx="11" cy="6" r="0.5" fill="currentColor" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-4.95A8 8 0 1 1 7.05 19.35L3 21z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1.5-.5-2.5-1.5-3-3l1-1-1-2L8.5 8c0 .5 .5 1.5 .5 1.5z" />
    </svg>
  ),
  voice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M9 21h6" />
    </svg>
  ),
  social: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
      <path d="M10 9l5 2.5L10 14V9z" fill="currentColor" />
    </svg>
  ),
};

const CHANNELS = [
  { id: "web",      title: "Website PROXe",  tag: "AI sales agent that lives on your site 24/7.",  icon: "browser",  from: "#3B82F6", to: "#10B981" },
  { id: "whatsapp", title: "WhatsApp PROXe", tag: "AI that runs your WhatsApp like a top SDR.",    icon: "whatsapp", from: "#84CC16", to: "#166534" },
  { id: "voice",    title: "Voice PROXe",    tag: "AI phone rep who never puts anyone on hold.",   icon: "voice",    from: "#FEF3C7", to: "#D97706" },
  { id: "social",   title: "Social PROXe",   tag: "Social AI for no missed comments and DMs.",     icon: "social",   from: "#EC4899", to: "#7C3AED" },
];

const ChannelCard = ({ ch }) => {
  const gradId = `g-${ch.id}`;
  return (
    <article className={`px-channel px-channel--${ch.id}`}>
      <span className="px-channel__plus" aria-hidden>+</span>
      <span className="px-channel__icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="36" height="36" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={ch.from} />
              <stop offset="100%" stopColor={ch.to} />
            </linearGradient>
          </defs>
          <g style={{ color: `url(#${gradId})`, stroke: `url(#${gradId})`, fill: "none" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {ch.icon === "browser" && (<>
              <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
              <path d="M2.5 9H21.5" />
              <circle cx="7" cy="6" r="0.6" fill={`url(#${gradId})`} />
              <circle cx="11" cy="6" r="0.6" fill={`url(#${gradId})`} />
            </>)}
            {ch.icon === "whatsapp" && (<>
              <path d="M3 21l1.65-4.95A8 8 0 1 1 7.05 19.35L3 21z" />
              <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1.5-.5-2.5-1.5-3-3l1-1-1-2L8.5 8c0 .5 .5 1.5 .5 1.5z" />
            </>)}
            {ch.icon === "voice" && (<>
              <rect x="9" y="3" width="6" height="12" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
              <path d="M9 21h6" />
            </>)}
            {ch.icon === "social" && (<>
              <circle cx="12" cy="12" r="9" />
              <path d="M10 8.5l6 3.5-6 3.5v-7z" fill={`url(#${gradId})`} />
            </>)}
          </g>
        </svg>
      </span>
      <h3 className="px-channel__title">{ch.title}</h3>
      <p className="px-channel__tag">{ch.tag}</p>
    </article>
  );
};

const ProxeChannels = () => (
  <section className="px-section" id="channels">
    <p className="px-section__eye">Everywhere your customers are</p>
    <h2 className="px-section__title">One PROXe. Every Channel.</h2>
    <div className="px-channels">
      {CHANNELS.map((c) => <ChannelCard key={c.id} ch={c} />)}
    </div>
  </section>
);

window.ProxeChannels = ProxeChannels;
window.ChannelCard = ChannelCard;
