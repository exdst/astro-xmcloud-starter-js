import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { m, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function extractVideoId(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : "";
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    setVideoId(extractVideoId(videoUrl));
  }, [videoUrl]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      setShowCloseButton(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowCloseButton(false), 3000);
    };

    if (isOpen) {
      resetTimer();
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (!isOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, videoId]);

  const fadeOutClass = "transition-opacity duration-1000 ease-out";
  const visibleClass = "opacity-100";
  const hiddenClass = "opacity-0";

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 15, staggerChildren: 0.07, delayChildren: 0.2 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { ease: "easeInOut", duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
    document.body.style.overflow = "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-100 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Video modal, video will start playing automatically"
        >
          <m.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative h-[calc(100vh-2rem)] max-h-[calc((100vw-4rem)*9/16)] w-[calc(100%-4rem)] max-w-[calc(100vh*16/9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <m.div variants={itemVariants} className="absolute inset-0">
              {videoId ? (
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: { playsinline: 0, autoplay: 1, controls: 1, modestbranding: 1, rel: 0 },
                  }}
                  className="h-full w-full"
                  onReady={(event: any) => { event.target.playVideo(); }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                  No video available
                </div>
              )}
            </m.div>
          </m.div>
          <m.div variants={itemVariants} className="fixed right-4 top-4 z-[110]">
            <Button
              className={`bg-white text-black hover:bg-gray-200 ${fadeOutClass} ${showCloseButton ? visibleClass : hiddenClass}`}
              variant="default"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
