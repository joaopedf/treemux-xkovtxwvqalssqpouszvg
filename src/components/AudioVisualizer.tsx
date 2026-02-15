"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioUrl: string;
  isPlaying: boolean;
}

export function AudioVisualizer({ audioUrl, isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let phase = 0;

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width / 2;
      const height = canvas.height / 2;
      const barCount = 50;
      const barWidth = width / barCount;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#9333ea");
      gradient.addColorStop(0.5, "#ec4899");
      gradient.addColorStop(1, "#f43f5e");

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const amplitude = isPlaying
          ? Math.sin(phase + i * 0.3) * 20 + 30
          : 10;
        const barHeight = amplitude;

        ctx.fillStyle = gradient;
        ctx.fillRect(
          x,
          height / 2 - barHeight / 2,
          barWidth - 2,
          barHeight
        );
      }

      if (isPlaying) {
        phase += 0.15;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
