import React, { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Point = { x: number; y: number }

const HACKER_QUOTES = [
  '> Initializing HackShield v2.0...',
  '> Compiling attack modules...',
  '> Scanning vulnerability database...',
  '> Encrypting secure channels...',
  '> Loading exploit frameworks...',
  '> Calibrating penetration vectors...',
  '> Deploying honeypot decoys...',
  '> Patching zero-day defenses...',
]

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'HACKSHIELD01アイウエオカキクケコサシスセソ!@#$%^&*'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0f3'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.98 ? '#fff' : `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.3})`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.3 }} />
}

function TerminalText() {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)

  useEffect(() => {
    if (currentLine >= HACKER_QUOTES.length) return
    const quote = HACKER_QUOTES[currentLine]
    if (currentChar < quote.length) {
      const timeout = setTimeout(() => setCurrentChar(c => c + 1), 30 + Math.random() * 40)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, quote])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar])

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0f3', textAlign: 'left', maxWidth: 400 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ opacity: 0.6 }}>{line}</div>
      ))}
      {currentLine < HACKER_QUOTES.length && (
        <div>
          {HACKER_QUOTES[currentLine].slice(0, currentChar)}
          <span style={{ animation: 'blink 0.7s infinite' }}>_</span>
        </div>
      )}
      {currentLine >= HACKER_QUOTES.length && (
        <div style={{ color: '#0f0', marginTop: 8, fontWeight: 'bold' }}>
          {'> All systems ready. Awaiting deployment.'}
          <span style={{ animation: 'blink 0.7s infinite' }}>_</span>
        </div>
      )}
    </div>
  )
}

function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>({ x: 15, y: 10 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('hs-snake-highscore')
    return stored ? parseInt(stored) : 0
  })
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const dirRef = useRef<Direction>('RIGHT')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }]
    setSnake(initial)
    setFood(spawnFood(initial))
    setDirection('RIGHT')
    dirRef.current = 'RIGHT'
    setGameOver(false)
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setStarted(true)
  }, [spawnFood])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
      if (!started || gameOver) {
        if (e.key === ' ' || e.key === 'Enter') resetGame()
        return
      }
      const dir = dirRef.current
      if ((e.key === 'ArrowUp' || e.key === 'z') && dir !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP') }
      if ((e.key === 'ArrowDown' || e.key === 's') && dir !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN') }
      if ((e.key === 'ArrowLeft' || e.key === 'q') && dir !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT') }
      if ((e.key === 'ArrowRight' || e.key === 'd') && dir !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT') }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started, gameOver, resetGame])

  useEffect(() => {
    if (!started || gameOver) return
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] }
        const dir = dirRef.current
        if (dir === 'UP') head.y--
        if (dir === 'DOWN') head.y++
        if (dir === 'LEFT') head.x--
        if (dir === 'RIGHT') head.x++

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          return prev
        }
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true)
          return prev
        }

        const newSnake = [head, ...prev]
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem('hs-snake-highscore', String(newScore))
            }
            return newScore
          })
          setFood(spawnFood(newSnake))
          setSpeed(s => Math.max(60, s - 3))
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, speed)
    return () => clearInterval(interval)
  }, [started, gameOver, food, speed, spawnFood, highScore])

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = GRID_SIZE * CELL_SIZE

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, size, size)

    // Grid lines
    ctx.strokeStyle = '#111'
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(size, i * CELL_SIZE)
      ctx.stroke()
    }

    // Food (pulsing red dot - "vulnerability")
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200)
    ctx.fillStyle = `rgba(255, 50, 50, ${pulse})`
    ctx.shadowColor = '#f33'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Snake
    snake.forEach((segment, i) => {
      const intensity = 1 - (i / snake.length) * 0.6
      ctx.fillStyle = i === 0
        ? '#0f0'
        : `rgba(0, ${Math.floor(200 * intensity)}, ${Math.floor(50 * intensity)}, ${intensity})`
      ctx.shadowColor = i === 0 ? '#0f0' : 'transparent'
      ctx.shadowBlur = i === 0 ? 8 : 0
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
    })
    ctx.shadowBlur = 0

    if (!started) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#0f0'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('[ HACK THE SNAKE ]', size / 2, size / 2 - 20)
      ctx.font = '12px monospace'
      ctx.fillStyle = '#0a8'
      ctx.fillText('Appuie sur ESPACE', size / 2, size / 2 + 10)
      ctx.fillText('Fleches / ZQSD pour bouger', size / 2, size / 2 + 30)
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#f33'
      ctx.font = 'bold 18px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('CONNECTION LOST', size / 2, size / 2 - 30)
      ctx.fillStyle = '#0f0'
      ctx.font = '14px monospace'
      ctx.fillText(`Score: ${score}`, size / 2, size / 2)
      ctx.font = '12px monospace'
      ctx.fillStyle = '#0a8'
      ctx.fillText('ESPACE pour relancer', size / 2, size / 2 + 30)
    }
  }, [snake, food, gameOver, started, score])

  const canvasSize = GRID_SIZE * CELL_SIZE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: canvasSize, fontFamily: 'monospace', fontSize: 13 }}>
        <span style={{ color: '#0f0' }}>VULNS: {score / 10}</span>
        <span style={{ color: '#0a8' }}>SCORE: {score}</span>
        <span style={{ color: '#f80' }}>BEST: {highScore}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          border: '1px solid #0f3',
          borderRadius: 4,
          boxShadow: '0 0 20px rgba(0, 255, 70, 0.15)',
          cursor: 'pointer',
        }}
        onClick={() => { if (!started || gameOver) resetGame() }}
      />
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#555', textAlign: 'center' }}>
        Chaque point rouge = une vuln trouvee. Mange-les toutes !
      </div>
    </div>
  )
}

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#0f0',
      fontFamily: "'Courier New', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; }
      `}</style>

      <MatrixRain />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
        padding: 20,
        animation: 'fadeIn 1s ease-out',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 48,
            fontWeight: 'bold',
            letterSpacing: 6,
            textShadow: '0 0 20px #0f3, 0 0 40px rgba(0,255,70,0.3)',
            animation: 'glitch 3s infinite',
          }}>
            HACKSHIELD
          </div>
          <div style={{
            fontSize: 14,
            color: '#0a8',
            marginTop: 8,
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}>
            Automated Pentesting Platform
          </div>
        </div>

        {/* Construction badge */}
        <div style={{
          border: '1px solid #f80',
          padding: '12px 30px',
          borderRadius: 4,
          background: 'rgba(255, 136, 0, 0.08)',
          textAlign: 'center',
        }}>
          <div style={{ color: '#f80', fontSize: 16, fontWeight: 'bold', letterSpacing: 3 }}>
            {'// SITE EN CONSTRUCTION //'}
          </div>
          <div style={{ color: '#a85', fontSize: 12, marginTop: 6 }}>
            Nos hackers ethiques travaillent dur. Revenez bientot.
          </div>
        </div>

        {/* Terminal animation */}
        <div style={{
          background: 'rgba(0, 20, 0, 0.8)',
          border: '1px solid #0a3',
          borderRadius: 6,
          padding: 16,
          width: '100%',
          maxWidth: 440,
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f55' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fa3' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0f3' }} />
          </div>
          <TerminalText />
        </div>

        {/* Game toggle */}
        <button
          onClick={() => setShowGame(!showGame)}
          style={{
            background: 'transparent',
            border: '1px solid #0f3',
            color: '#0f3',
            padding: '10px 24px',
            fontFamily: 'monospace',
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: 4,
            transition: 'all 0.2s',
            letterSpacing: 2,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,70,0.1)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,70,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {showGame ? '[ FERMER LE JEU ]' : '[ JOUER EN ATTENDANT ]'}
        </button>

        {showGame && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <SnakeGame />
          </div>
        )}

        {/* Footer */}
        <div style={{ color: '#333', fontSize: 11, textAlign: 'center', marginTop: 20 }}>
          HackShield &copy; 2026 &mdash; All rights reserved
        </div>
      </div>
    </div>
  )
}

export default App
