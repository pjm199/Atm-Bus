import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [secondCount, setSecondCount] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

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
        setSwipeCount((count) => count - 1)
        setSwipeDirection('left')
      }

      if (touchEndX - touchStartX > 50) {
        setSwipeCount((count) => count + 1)
        setSwipeDirection('right')
      }

      setTimeout(() => setSwipeDirection(''), 500)
    }

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

  const handleSave = () => {
    const data = {
      count,
      secondCount,
      date: new Date().toLocaleString()
    }
    console.log('Saved Data:', JSON.stringify(data))
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

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
      <h1>Vite + React</h1>
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
        <div className={`swipe-counter ${swipeDirection}`}>
          <label>Swipe Counter</label>
          <span className="counter-button">{swipeCount}</span>
        </div>
        <button onClick={handleSave} className="save-button">Save</button>
        {showToast && <div className="toast">Data has been saved!</div>}
       
      </div>
      
    </>
  )
}

export default App
