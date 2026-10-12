'use client'

import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

const BARS = [
  0.35, 0.6, 0.45, 0.8, 0.55, 0.9, 0.5, 0.7, 0.4, 0.65, 0.3, 0.55, 0.75, 0.45,
  0.85, 0.5, 0.65, 0.35, 0.7, 0.4,
]
const HALF = BARS.length / 2

interface IntroAudioProps {
  src: string
}

export function IntroAudio({ src }: IntroAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const isReducedMotion = useReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [progress, setProgress] = useState(0)

  if (hasError) {
    return null
  }

  const handleToggle = () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    if (audio.paused) {
      audio.play().catch(() => setHasError(true))
    } else {
      audio.pause()
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio?.duration) {
      setProgress(audio.currentTime / audio.duration)
    }
  }

  const renderBars = (bars: number[], offset: number) => (
    <div aria-hidden="true" className="flex h-8 items-center gap-[3px]">
      {bars.map((height, index) => {
        const position = (offset + index) / BARS.length
        const isDone = position < progress
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
            key={offset + index}
            className={`w-[3px] rounded-full transition-colors ${isDone ? 'bg-primary' : 'bg-foreground/30'} ${isPlaying && !isReducedMotion ? 'animate-pulse' : ''}`}
            style={{
              height: `${height * 100}%`,
              animationDelay: `${index * 60}ms`,
            }}
          />
        )
      })}
    </div>
  )

  return (
    <div className="flex items-center">
      {/* biome-ignore lint/a11y/useMediaCaption: short spoken intro, no captions track */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setProgress(0)
        }}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setHasError(true)}
      />
      <div className="flex items-center gap-3">
        {renderBars(BARS.slice(0, HALF), 0)}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isPlaying ? 'Pausar apresentação' : 'Ouvir apresentação'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </button>
        {renderBars(BARS.slice(HALF), HALF)}
      </div>
    </div>
  )
}
