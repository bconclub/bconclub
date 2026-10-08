// PROXe — Stats / KPI band
const STATS = [
  { v: "1M+",   l: "Conversations at scale" },
  { v: "< 2s",  l: "Lightning-fast replies" },
  { v: "142%",  l: "Qualified lead surge" },
  { v: "99.9%", l: "Always-on reliability" },
];

const ProxeStats = () => (
  <section className="px-section px-stats" id="stats">
    {STATS.map((s) => (
      <div key={s.v} className="px-stat">
        <p className="px-stat__v">{s.v}</p>
        <p className="px-stat__l">{s.l}</p>
      </div>
    ))}
  </section>
);

window.ProxeStats = ProxeStats;
