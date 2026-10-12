"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/LandingPageHeroVideo.mp4?v=2";

// How much of the clip a full-width pointer sweep scrubs through.
const SENSITIVITY = 0.8;
const FRAME = 1 / 24;

/**
 * Mouse-driven scrub video. The clip never autoplays — horizontal pointer
 * movement eases the playhead, so the hero follows the cursor instead of
 * stepping to it. The file is all-intra, so each of those small seeks is a
 * single frame and stays smooth.
 */
export function MainframeScrubVideo({
  className = "",
}: {
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let target = 0;
    let shown = 0;
    let frameId = 0;

    const onMove = (event: PointerEvent) => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const x = event.clientX;
      if (prevX === null) {
        prevX = x;
        return;
      }

      const delta = x - prevX;
      prevX = x;
      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const end = Math.max(duration - FRAME, 0);
      target = Math.min(Math.max(target + offset, 0), end);
    };

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const duration = video.duration;
      if (!duration || Number.isNaN(duration) || video.readyState < 2) return;

      const diff = target - shown;
      // Slow moves glide; a fast sweep catches up without a hard snap.
      const gain = Math.min(0.55, 0.2 + Math.abs(diff) * 0.45);
      shown += diff * gain;
      if (Math.abs(target - shown) < FRAME * 0.25) shown = target;

      if (Math.abs(video.currentTime - shown) < FRAME * 0.45) return;
      video.currentTime = shown;
    };

    const hold = () => {
      video.pause();
    };

    video.addEventListener("loadeddata", hold);
    window.addEventListener("pointermove", onMove, { passive: true });
    frameId = requestAnimationFrame(tick);
    if (video.readyState >= 2) hold();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      video.removeEventListener("loadeddata", hold);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className={className}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
