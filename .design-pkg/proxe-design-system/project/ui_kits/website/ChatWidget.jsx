// PROXe — Floating chat widget (the main click-thru interaction)
// Click the bubble → an AI-style conversation opens. Quick-pill replies drive
// canned answers for the prototype.

const QUICK = ["Book a Demo", "Schedule a Call", "Pricing"];

const SCRIPTED = {
  "What's PROXe": "PROXe is the AI Customer Acquisition System — it captures every lead across web, WhatsApp, voice, email and SMS, then pushes hot ones to your team.",
  "Deploy PROXe": "Easy. We connect to your channels in <2 hrs. Want me to set up a live walkthrough?",
  "PROXe Pricing": "Starts at $499/mo for SMBs. Includes one channel + 1k conversations. Want me to send the full sheet?",
  "Book a Demo": "Booked it. You'll get a calendar invite shortly. Anything you'd like the team to focus on?",
  "Schedule a Call": "Pick a slot here: proxe.ai/call. Or share a number and a time — I'll handle the rest.",
};

const ProxeChatWidget = ({ external }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [thread, setThread] = React.useState([
    { who: "ai", text: "Hey 👋 I'm PROXe. What brings you here today?" },
  ]);
  const scroller = React.useRef(null);

  // accept question piped in from hero searchbar
  React.useEffect(() => {
    if (external?.q) {
      setOpen(true);
      send(external.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external?.k]);

  React.useEffect(() => {
    scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [thread]);

  function send(text) {
    if (!text?.trim()) return;
    const userTurn = { who: "user", text };
    setThread((t) => [...t, userTurn]);
    setQ("");
    setTimeout(() => {
      const reply = SCRIPTED[text] || "Got it — I'll route this to the team and send a follow-up. Want me to grab your email?";
      setThread((t) => [...t, { who: "ai", text: reply }]);
    }, 600);
  }

  return (
    <div className="px-chat-root">
      {open && (
        <div className="px-chat" role="dialog" aria-label="PROXe chat">
          <div className="px-chat__head">
            <div className="px-chat__brand">
              <img src="../../assets/logo/PROXe-Wordmark.svg" alt="" />
              <div>
                <p className="px-chat__name">PROXe</p>
                <p className="px-chat__status"><span className="px-dot" /> AI · online now</p>
              </div>
            </div>
            <button className="px-chat__x" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>

          <div className="px-chat__body" ref={scroller}>
            {thread.map((m, i) => (
              <div key={i} className={`px-bubble px-bubble--${m.who}`}>{m.text}</div>
            ))}
          </div>

          <div className="px-chat__quick">
            {QUICK.map((p) => (
              <button key={p} className="px-pill" onClick={() => send(p)}>{p}</button>
            ))}
          </div>

          <form className="px-chat__compose" onSubmit={(e) => { e.preventDefault(); send(q); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reply to PROXe…" />
            <button className="px-chat__send" type="submit" aria-label="Send">↑</button>
          </form>
        </div>
      )}

      <button className={`px-chat__fab ${open ? "is-open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Open PROXe chat">
        {open ? "×" : (
          <img src="../../assets/icons/bubble-chat-stroke-rounded.svg" alt="" />
        )}
      </button>
    </div>
  );
};

window.ProxeChatWidget = ProxeChatWidget;
