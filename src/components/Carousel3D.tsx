import { useEffect, useRef } from "react";

const IMAGES = [
  "/landscape/1.png",
  "/landscape/5.png",
  "/landscape/9.png",
  "/landscape/14.png",
  "/landscape/18.png",
  "/landscape/22.png",
  "/landscape/27.png",
  "/landscape/31.png",
  "/landscape/35.png",
  "/landscape/40.png",
  "/landscape/51.png",
  "/landscape/60.png",
];

const N = IMAGES.length;

export default function Carousel3D() {
  const styleId = "carousel3d-style";

  useEffect(() => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .c3d-scene {
        display: grid;
        overflow: hidden;
        perspective: 35em;
        mask: linear-gradient(90deg, #0000, red 18% 82%, #0000);
        -webkit-mask: linear-gradient(90deg, #0000, red 18% 82%, #0000);
        height: 280px;
        width: 100%;
      }
      .c3d-ring {
        display: grid;
        place-self: center;
        transform-style: preserve-3d;
        animation: c3d-ry 32s linear infinite;
      }
      @keyframes c3d-ry { to { rotate: y 1turn; } }
      .c3d-card {
        --w: 17em;
        --ba: calc(1turn / ${N});
        grid-area: 1 / 1;
        width: var(--w);
        aspect-ratio: 16 / 10;
        object-fit: cover;
        border-radius: 1em;
        backface-visibility: hidden;
        transform:
          rotatey(calc(var(--i) * var(--ba)))
          translatez(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))));
        border: 1px solid rgba(229,9,20,0.25);
        box-shadow: 0 4px 24px rgba(0,0,0,0.7);
      }
      @media (prefers-reduced-motion: reduce) {
        .c3d-ring { animation-duration: 128s; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);

  return (
    <section style={{ background: "#000", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
      {/* Header */}
      <div className="px-6 md:px-12 mb-6 flex items-center gap-3">
        <div className="w-1 h-7 rounded-full shrink-0" style={{ background: "#E50914" }} />
        <h2
          className="font-black text-xl md:text-2xl uppercase tracking-wide"
          style={{
            background: "linear-gradient(90deg, #fff 0%, #E50914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Featured Collection
        </h2>
      </div>

      {/* 3D Carousel */}
      <div className="c3d-scene">
        <div className="c3d-ring" style={{ "--n": N } as React.CSSProperties}>
          {IMAGES.map((src, i) => (
            <img
              key={i}
              className="c3d-card"
              src={src}
              alt={`featured-${i}`}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
