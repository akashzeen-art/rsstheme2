import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import VideoSection from "../components/VideoSection";
import UnlockModal from "../components/UnlockModal";
import AccountModal from "../components/AccountModal";
import VideoPlayer from "../components/VideoPlayer";
import Footer from "../components/Footer";
import TMZReels from "../components/TMZReels";
import YouTubeReels from "../components/YouTubeReels";
import DeviceShowcase from "../components/DeviceShowcase";
import Carousel3D from "../components/Carousel3D";
import ComingSoon from "../components/ComingSoon";
import PlatformRssSection, { PlatformRssCategoryRow } from "../components/PlatformRssSection";
import { homeSections, Video } from "../data/videos";
import { loadAccess, saveAccess, clearAccess, UserAccess } from "../lib/access";

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [showAccount, setShowAccount]     = useState(false);
  const [showPlayer, setShowPlayer]       = useState(false);
  const [access, setAccess]               = useState<UserAccess | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccess(loadAccess());
  }, []);

  const playVideo = (v: Video) => {
    setSelectedVideo(v);
    if (!access) setShowModal(true);
    else setShowPlayer(true);
  };

  const handleUnlock = (data: { phone: string; plan: "weekly" | "monthly" }) => {
    const val = saveAccess(data.phone, data.plan);
    setAccess(val);
    setShowModal(false);
    setShowPlayer(true);
  };

  const handleLogout = () => {
    clearAccess();
    setAccess(null);
    setShowPlayer(false);
    setSelectedVideo(null);
  };

  const scrollToCollection = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <Navbar onMyAccount={() => setShowAccount(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <HeroSection onWatchNow={playVideo} onExplore={scrollToCollection} />

        <TMZReels />
        <YouTubeReels />

        {/* Video rows */}
        <div ref={contentRef} id="premium-collection" style={{ background: "#000" }}>
          {homeSections.map(sec => (
            <>
              <VideoSection
                key={sec.id}
                id={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                videos={sec.videos}
                layout={sec.layout}
                onVideoClick={playVideo}
              />
              {sec.id === "escape" && <PlatformRssCategoryRow categoryId="reels" />}
              {sec.id === "fatal" && <DeviceShowcase />}
              {sec.id === "dangerous" && <Carousel3D />}
            </>
          ))}
        </div>

        <ComingSoon />
        <PlatformRssSection excludeIds={["reels"]} />
        <Footer />
      </motion.div>

      <UnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUnlock={handleUnlock}
      />

      <AccountModal
        isOpen={showAccount}
        onClose={() => setShowAccount(false)}
        access={access}
        onSubscribe={() => setShowModal(true)}
        onLogout={handleLogout}
      />

      {selectedVideo && (
        <VideoPlayer
          isOpen={showPlayer}
          onClose={() => { setShowPlayer(false); setSelectedVideo(null); }}
          title={selectedVideo.title}
          videoUrl={selectedVideo.videoUrl}
        />
      )}
    </div>
  );
}
