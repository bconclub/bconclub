// PROXe — Header (floating glass pill)
// Single source of truth: site nav.
const ProxeHeader = ({ onDeploy }) => {
  return (
    <header className="px-header">
      <a className="px-header__brand" href="#top" aria-label="PROXe home">
        <img src="../../assets/logo/PROXe-Wordmark.svg" alt="PROXe" />
      </a>
      <nav className="px-header__nav">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#channels">Channels</a>
      </nav>
      <button className="px-btn px-btn--deploy" onClick={onDeploy}>Deploy PROXe</button>
    </header>
  );
};

window.ProxeHeader = ProxeHeader;
