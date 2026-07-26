interface Props { progress: number; }

const SCENES = ["DAWN","MIDDAY","DUSK","NIGHT","STORM"];

export default function ScrollHUD({ progress }: Props) {
  const sceneIdx = Math.min(SCENES.length - 1, Math.floor(progress * SCENES.length));

  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {SCENES.map((_, i) => (
        <div key={i} style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: i === sceneIdx ? "#c8ff47" : "rgba(200,255,71,0.3)",
          transform: i === sceneIdx ? "scale(1.8)" : "scale(1)",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}
