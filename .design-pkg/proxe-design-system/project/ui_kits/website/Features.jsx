// PROXe — Features (Capture / Remember / Close)
const FEATURES = [
  { eyebrow: "Capture",  title: "Never Miss a Lead",          body: "Every message captured. WhatsApp, website, Instagram, SMS, email. 24/7 listening. No inquiry lost." },
  { eyebrow: "Remember", title: "One Memory, Every Channel",  body: "Full conversation history. Same thread. Customers never repeat themselves." },
  { eyebrow: "Close",    title: "Push Buyers to Your Team",   body: "Automated follow-ups. Smart nudges. Cross-channel reactivation." },
];

const ProxeFeatures = () => (
  <section className="px-section" id="features">
    <p className="px-section__eye">How it works</p>
    <h2 className="px-section__title">From First Ping to Closed Deal.</h2>

    <div className="px-features">
      {FEATURES.map((f) => (
        <article key={f.title} className="px-feature">
          <p className="px-feature__eye">{f.eyebrow}</p>
          <h3 className="px-feature__title">{f.title}</h3>
          <p className="px-feature__body">{f.body}</p>
        </article>
      ))}
    </div>
  </section>
);

window.ProxeFeatures = ProxeFeatures;
