"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Sparkles, Download, Play, Pause, Wand2 } from "lucide-react";
import { AudioVisualizer } from "@/components/AudioVisualizer";

const TRENDING_PROMPTS = [
  "Plot twist: I'm actually the villain",
  "POV: You just discovered the truth",
  "When they ask if you're okay...",
  "The moment I realized everything changed",
  "Nobody's gonna believe this but...",
  "Here's what they don't tell you about...",
];

const VOICE_STYLES = [
  { id: "alloy", name: "Alloy", desc: "Neutral & Clear" },
  { id: "echo", name: "Echo", desc: "Warm & Rich" },
  { id: "fable", name: "Fable", desc: "Expressive & British" },
  { id: "onyx", name: "Onyx", desc: "Deep & Authoritative" },
  { id: "nova", name: "Nova", desc: "Bright & Energetic" },
  { id: "shimmer", name: "Shimmer", desc: "Soft & Gentle" },
];

export default function VoiceClip() {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("nova");
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const enhanceScript = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });

      if (!response.ok) throw new Error("Failed to enhance script");

      const data = await response.json();
      setPrompt(data.enhancedText);
    } catch (error) {
      console.error("Error enhancing script:", error);
      alert("Failed to enhance script. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateVoice = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt, voice, speed: speed[0] }),
      });

      if (!response.ok) throw new Error("Failed to generate voice");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating voice:", error);
      alert("Failed to generate voice. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voiceclip-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [audioRef.current]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h1 className="text-5xl font-black text-white tracking-tight">
                VoiceClip
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-lg text-purple-100">
              Create viral-worthy audio moments with AI
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8 space-y-6 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-purple-200">
            {/* Trending Prompts */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Trending Prompts
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_PROMPTS.map((trendPrompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(trendPrompt)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105"
                  >
                    {trendPrompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Your Script
              </label>
              <div className="flex gap-2">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your viral audio script here..."
                  className="text-base h-12 border-2 border-purple-200 focus:border-purple-400"
                />
                <Button
                  onClick={enhanceScript}
                  disabled={isEnhancing || !prompt.trim()}
                  variant="outline"
                  className="h-12 border-2 border-purple-200 hover:bg-purple-50"
                >
                  {isEnhancing ? (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  )}
                </Button>
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Voice Style
              </label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="border-2 border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_STYLES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{v.name}</span>
                        <span className="text-xs text-gray-500">{v.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed Control */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Speed: {speed[0].toFixed(1)}x
              </label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2.0}
                step={0.1}
                className="py-2"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateVoice}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Generate VoiceClip
                </>
              )}
            </Button>

            {/* Audio Player */}
            {audioUrl && (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Your VoiceClip is ready!
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={togglePlayback}
                      variant="outline"
                      size="sm"
                      className="border-purple-300"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      size="sm"
                      className="border-purple-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <audio ref={audioRef} src={audioUrl} />
                <AudioVisualizer audioUrl={audioUrl} isPlaying={isPlaying} />
              </div>
            )}
          </Card>

          {/* Footer */}
          <p className="text-center text-purple-100 text-sm">
            Built with AI at TreeHacks 2026 🌲
          </p>
        </div>
      </div>
    </div>
  );
}
