import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [secondCount, setSecondCount] = useState(0)

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
    }

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      touchEndX = touch.clientX
    }

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        setCount((count) => count - 1)
      }

      if (touchEndX - touchStartX > 50) {
        setCount((count) => count + 1)
      }
    }

    let touchStartX = 0
    let touchEndX = 0

    const counterElement = document.querySelector('.swipe-counter')
    counterElement.addEventListener('touchstart', handleTouchStart)
    counterElement.addEventListener('touchmove', handleTouchMove)
    counterElement.addEventListener('touchend', handleTouchEnd)

    return () => {
      counterElement.removeEventListener('touchstart', handleTouchStart)
      counterElement.removeEventListener('touchmove', handleTouchMove)
      counterElement.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <div className="card">
        <div className="counter">
          <button onClick={() => setCount((count) => count + 1)}> + </button>
          <div className="counter-display">
            <label>OUT</label>
            <span className="counter-button">{count}</span>
          </div>
          <button onClick={() => setCount((count) => count - 1)}> - </button>
        </div>
        <div className="counter">
          <button onClick={() => setSecondCount((secondCount) => secondCount + 1)}> + </button>
          <div className="counter-display">
            <label>IN</label>
            <span className="counter-button">{secondCount}</span>
          </div>
          <button onClick={() => setSecondCount((secondCount) => secondCount - 1)}> - </button>
        </div>
        <div className="swipe-counter">
          <label>Swipe Counter</label>
          <span className="counter-button">{count}</span>
        </div>
        
      </div>
      
    </>
  )
}

export default App
