// PROXe — Footer (deploy CTA band + minimal legal)
const ProxeFooter = ({ onDeploy }) => (
  <footer className="px-footer">
    <div className="px-cta">
      <h2 className="px-cta__title">Stop Losing Leads<br />to Slow Follow-ups.</h2>
      <p className="px-cta__sub">Deploy PROXe in under 2 hours. Cancel any time.</p>
      <button className="px-btn px-btn--primary" onClick={onDeploy}>Deploy PROXe <span className="px-btn__knob">→</span></button>
    </div>

    <div className="px-footer__legal">
      <img src="../../assets/logo/PROXe-Wordmark.svg" alt="PROXe" className="px-footer__logo" />
      <span>© 2026 PROXe</span>
      <span>·</span>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Status</a>
    </div>
  </footer>
);

window.ProxeFooter = ProxeFooter;
