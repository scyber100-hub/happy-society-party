'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

const lyrics = [
  [
    '국경은 지도 위에 그어졌지만',
    '우리의 삶엔 선이 없었다',
    '전쟁의 불길, 기후의 바람',
    '가난과 불안은 국적을 묻지 않았다',
  ],
  [
    '성장의 이름으로 밀려난 사람들',
    '경쟁의 이름으로 사라진 얼굴들',
    '누군가는 너무 많이 가졌고',
    '누군가는 살아남는 것만이 꿈이 되었다',
  ],
  [
    '만국의 시민들이여, 연대하라',
    '두려움보다 큰 우리의 이름으로',
    '만국의 시민들이여, 연대하라',
    '존엄은 국경을 넘는다는 것을',
  ],
  [
    '전쟁 없는 오늘을 위해',
    '행복이 특권이 아닌 세상을 위해',
    '우리는 여기, 함께 노래한다',
    '서로의 손을 놓지 않겠다고',
  ],
];

export default function AnthemPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">국제연대가</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            만국의 시민들이여, 연대하라
          </p>
        </div>
      </section>

      {/* Audio Player */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <audio ref={audioRef} src="/audio/international-solidarity.mp3" preload="metadata" />

          <div className="bg-gradient-to-r from-[var(--primary)] to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
              <div className="flex-1">
                <h3 className="font-bold text-lg">국제연대가</h3>
                <p className="text-white/80 text-sm">행복사회당</p>
              </div>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 rounded-full appearance-none bg-white/30 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
              />
              <span className="text-sm text-white/80 w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lyrics Section */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-8 text-center">
            가사
          </h2>

          <div className="space-y-8">
            {lyrics.map((lines, sectionIdx) => (
              <div key={sectionIdx} className="text-center">
                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <p
                      key={idx}
                      className="text-lg text-[var(--gray-700)] leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            당 소개로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}
