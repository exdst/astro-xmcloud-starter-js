import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";

function extractVideoId(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : "";
}

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  fullScreen?: boolean;
  btnClasses?: string;
}

export function VideoPlayer({
  videoUrl,
  isPlaying,
  onPlay,
  fullScreen = false,
  btnClasses = "",
}: VideoPlayerProps) {
  const [videoId, setVideoId] = useState("");
  const playerRef = useRef<YouTube>(null);

  useEffect(() => {
    setVideoId(extractVideoId(videoUrl));
  }, [videoUrl]);

  const handlePlay = () => {
    onPlay();
    playerRef.current?.internalPlayer.playVideo();
  };

  return (
    <div className={`relative ${fullScreen ? "inset-0 aspect-video" : "h-full w-full"}`}>
      {!isPlaying && (
        <button onClick={handlePlay} className={btnClasses} aria-label="Play video">
          <svg className="h-[65px] w-[65px] transition-transform hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
      )}
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            playsinline: 0,
            autoplay: isPlaying ? 1 : 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        className={`h-full w-full ${isPlaying ? "block" : "hidden"}`}
        ref={playerRef}
      />
    </div>
  );
}
