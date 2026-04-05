import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { trackEvent } from "../../lib/analytics";

type Stage = "hidden" | "chat" | "video";

interface Props {
  src: string;
  /** Телеграм-ссылка для кнопки "Ответить" */
  replyHref?: string;
}

export default function VideoNote({ src, replyHref = "https://t.me/" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("hidden");
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Появление чат-сообщения через 3 секунды после загрузки
  useEffect(() => {
    if (sessionStorage.getItem("video-note-closed")) return;
    const t = setTimeout(() => {
      setStage("chat");
      requestAnimationFrame(() => setIsVisible(true));
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const openVideo = () => {
    trackEvent("video_note_open");
    setIsVisible(false);
    setTimeout(() => {
      setStage("video");
      requestAnimationFrame(() => setIsVisible(true));
    }, 200);
  };

  const close = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
    setIsVisible(false);
    sessionStorage.setItem("video-note-closed", "1");
    trackEvent("video_note_close", { stage });
    setTimeout(() => setStage("hidden"), 300);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
      trackEvent("video_note_play");
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed bottom-20 right-4 md:bottom-10 md:right-10 lg:bottom-16 lg:right-16 z-40 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {stage === "chat" && (
        <div className="relative flex items-end gap-2 max-w-[300px]">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#229ED9] flex items-center justify-center text-white font-headline font-black text-sm shrink-0 shadow-lg">
            С
          </div>

          {/* Bubble */}
          <div className="relative bg-white dark:bg-[#1a2133] rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-black/5 dark:border-white/10">
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0f1e] dark:bg-white text-white dark:text-[#0a0f1e] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>

            <p className="text-[#0a0f1e] dark:text-white text-sm leading-snug mb-2.5">
              Вам прислали кружочек из Швейцарии 🇨🇭 Смотрим?
            </p>
            <button
              type="button"
              onClick={openVideo}
              className="bg-[#229ED9] hover:bg-[#3aafe3] text-white font-headline font-black text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-tighter active:scale-95"
            >
              <Icon name="play_arrow" filled className="text-[16px]" />
              Смотреть
            </button>
          </div>
        </div>
      )}

      {stage === "video" && (
        <div className="flex flex-col items-center gap-3">
          {/* Circle wrapper */}
          <div className="relative">
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute -top-1 -right-1 z-10 w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#0a0f1e] dark:bg-white text-white dark:text-[#0a0f1e] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px] md:text-[20px]">close</span>
            </button>

            {/* Video circle */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Пауза" : "Играть"}
              className="relative aspect-square w-40 sm:w-48 md:w-64 lg:w-72 xl:w-80 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.35)] border-4 border-white dark:border-[#0a0f1e] bg-black group cursor-pointer overflow-hidden"
              style={{ borderRadius: "9999px" }}
            >
              <video
                ref={videoRef}
                src={src}
                className="absolute inset-0 w-full h-full object-cover rounded-full"
                style={{ borderRadius: "9999px" }}
                playsInline
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
              />
              {/* Play overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors rounded-full">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/95 text-[#0a0f1e] flex items-center justify-center shadow-lg">
                    <Icon name="play_arrow" filled className="text-[32px] md:text-[44px] ml-0.5" />
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Reply button */}
          <a
            href={replyHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("video_note_reply")}
            className="bg-[#229ED9] hover:bg-[#3aafe3] text-white font-headline font-black text-xs md:text-sm px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-all flex items-center gap-2 uppercase tracking-tighter shadow-lg active:scale-95"
          >
            <Icon name="reply" filled className="text-[16px] md:text-[18px]" />
            Ответить
          </a>
        </div>
      )}
    </div>
  );
}
