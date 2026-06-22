"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/LandingPageHeroVideo.mp4";

// How much of the clip a full-width mouse sweep scrubs through.
const SENSITIVITY = 0.8;

/**
 * Mouse-driven scrub video. The clip never autoplays — horizontal pointer
 * movement seeks the timeline, so the hero footage responds to the cursor.
 * Seeks are throttled to one in-flight at a time to avoid flooding.
 */
export function MainframeScrubVideo({
  className = "",
}: {
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  useEffect(() => {
    const seek = () => {
      const video = videoRef.current;
      if (!video) return;
      seekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    };

    const handleMove = (event: MouseEvent) => {
      const video = videoRef.current;
      const duration = video?.duration;
      if (!video || !duration || Number.isNaN(duration)) return;

      const currentX = event.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      targetTimeRef.current = Math.min(
        Math.max(targetTimeRef.current + offset, 0),
        duration,
      );

      // Avoid seek-flooding: only kick off a seek when one isn't running.
      if (!seekingRef.current) seek();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const handleSeeked = () => {
    seekingRef.current = false;
    const video = videoRef.current;
    if (!video) return;
    // Queue the next seek if the target moved while the last one ran.
    if (Math.abs(targetTimeRef.current - video.currentTime) > 0.01) {
      seekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  return (
    <video
      ref={videoRef}
      onSeeked={handleSeeked}
      muted
      playsInline
      preload="auto"
      className={className}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
