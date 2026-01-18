import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { BackgroundMusic } from './components/BackgroundMusic'
import './App.css' // Ensure we keeping this import if needed or just rely on index.css

function App() {
  const [showSubtitle, setShowSubtitle] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="overlay">
        <h1 className="title">HAPPY BIRTHDAY<br />ÁNH NGUYỆT</h1>
        {showSubtitle && <p className="subtitle">18/01/2004</p>}
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]} // Support high pixel density
        gl={{ antialias: false }} // Postprocessing handles antialiasing or we skip it for performance with bloom
      >
        <Experience />
      </Canvas>

      <BackgroundMusic />
    </>
  )
}

export default App
