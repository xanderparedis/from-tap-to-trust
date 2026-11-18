const wavePath = "M0 28C240 4 480 4 720 28S1200 52 1440 28S1920 4 2160 28S2640 52 2880 28V64H0Z";

export function FooterWave() {
  return (
    <div className="footer-water" aria-hidden="true">
      <svg className="footer-wave footer-wave-back" viewBox="0 0 2880 64" preserveAspectRatio="none" focusable="false">
        <path d={wavePath} />
      </svg>
      <svg className="footer-wave footer-wave-front" viewBox="0 0 2880 64" preserveAspectRatio="none" focusable="false">
        <path d={wavePath} />
      </svg>
    </div>
  );
}
