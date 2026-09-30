// PROXe — Hero (Title-case serif + white-pill ask bar on electric violet)
const ProxeHero = ({ onAsk }) => {
  const [q, setQ] = React.useState("");
  const submit = (e) => { e.preventDefault(); onAsk?.(q || "What's PROXe?"); };
  return (
    <section className="px-hero">
      <p className="px-hero__eye">AI&nbsp;&nbsp;CUSTOMER&nbsp;&nbsp;ACQUISITION</p>
      <h1 className="px-hero__title">Never Miss a Lead Ever Again.</h1>
      <p className="px-hero__sub">
        PROXe runs the full pipeline. Captures leads across channels, nurtures the conversation, scores intent,
        and pushes the ready-to-buy ones to your team.
      </p>
      <form className="px-ask" onSubmit={submit}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What's PROXe?" />
        <button className="px-ask__send" type="submit" aria-label="Ask">→</button>
      </form>
      <div className="px-quick">
        {["Pricing", "Book a Demo", "Schedule a Call"].map((label) => (
          <button key={label} className="px-pill" onClick={() => onAsk?.(label)}>{label}</button>
        ))}
      </div>
    </section>
  );
};

window.ProxeHero = ProxeHero;
