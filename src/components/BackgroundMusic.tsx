import { useEffect, useRef, useState } from 'react'

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) {
      console.error('Audio element not found')
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      console.log('Music paused')
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true)
          console.log('Music playing, volume:', audio.volume)
        })
        .catch((err) => {
          console.error('Failed to play:', err)
          alert('Không thể phát nhạc. Lỗi: ' + err.message)
        })
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Start with muted to bypass autoplay restrictions
    audio.volume = 0
    audio.muted = true
    
    // Try to play immediately while muted
    audio.play()
      .then(() => {
        console.log('Audio started (muted)')
        // Gradually unmute after a short delay
        setTimeout(() => {
          audio.muted = false
          audio.volume = 0.5
          setIsPlaying(true)
          console.log('Audio unmuted and playing')
        }, 100)
      })
      .catch((err) => {
        console.log('Even muted autoplay failed:', err)
        // Fallback: play on any user interaction
        const enableAudio = () => {
          audio.muted = false
          audio.volume = 0.5
          audio.play()
            .then(() => {
              setIsPlaying(true)
              console.log('Audio started after user interaction')
            })
            .catch(console.error)
        }
        document.addEventListener('click', enableAudio, { once: true })
        document.addEventListener('keydown', enableAudio, { once: true })
      })

    return () => {
      audio.pause()
    }
  }, [])

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        {/* Using local music file */}
        <source src="/music/a-cheerful-ukulele-waltz.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Music control button */}
      <button
        onClick={togglePlay}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.5)',
          background: isPlaying ? 'rgba(50, 200, 50, 0.8)' : 'rgba(200, 50, 50, 0.8)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isPlaying ? '🔊' : '▶️'}
      </button>

      {/* Instructions overlay when not playing */}
      {!isPlaying && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '0.9rem',
          zIndex: 999,
          pointerEvents: 'none',
          animation: 'pulse 2s infinite',
        }}>
          Click ▶️ để phát nhạc
        </div>
      )}
    </>
  )
}
