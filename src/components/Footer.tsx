const footerLinks = ["Refund Policy", "Terms & Conditions", "Privacy Policy", "Contact Us"];

export default function Footer() {
  return (
    <footer className="py-10 mt-8" style={{ background: "#000", borderTop: "2px solid #E50914" }}>
      <div className="px-6 md:px-12 flex flex-col items-center gap-6">

        {/* Logo */}
        <span className="text-2xl font-black tracking-tight text-white">CINEMAX</span>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4">
          {footerLinks.map(l => (
            <a key={l} href="#"
              className="text-sm hover:text-white transition"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              {l}
            </a>
          ))}
        </div>

        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2026 CinemaX Digital Solutions LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
