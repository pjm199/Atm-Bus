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
  const [toastMessage, setToastMessage] = useState('')
  const [dataVector, setDataVector] = useState([])

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

  const handleStart = () => {
    setDataVector([])
    setShowToast(true)
    setToastMessage('Vector initialized!')
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSave = () => {
    const data = {
      count,
      secondCount,
      date: new Date().toLocaleString()
    }
    console.log('Saved Data:', JSON.stringify(data))
    setDataVector((prevVector) => [...prevVector, data])
    setToastMessage(`Data has been saved!<br>OUT: ${count}<br>IN: ${secondCount}<br>Date: ${data.date}`)
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
      
      <div className="card">
        <button onClick={handleStart} className="start-button">Start</button>
        <div className="counter">
          <button onClick={() => setCount((count) => count - 1)}> - </button>
          <div className="counter-display">
            <label>OUT</label>
            <span className="counter-button">{count}</span>
          </div>
          <button onClick={() => setCount((count) => count + 1)}> + </button>
        </div>
        <div className="counter">
          <button onClick={() => setSecondCount((secondCount) => secondCount - 1)}> - </button>
          <div className="counter-display">
            <label>IN</label>
            <span className="counter-button">{secondCount}</span>
          </div>
          <button onClick={() => setSecondCount((secondCount) => secondCount + 1)}> + </button>
        </div>
        <label>Swipe Counter</label>
        <div className={`swipe-counter ${swipeDirection}`}>
          <span className="counter-button">{swipeCount}</span>
        </div>
        <button onClick={handleSave} className="save-button">Save</button>
        {showToast && <div className="toast" dangerouslySetInnerHTML={{ __html: toastMessage }}></div>}
        <div className="data-vector">
          <h3>Saved Data:</h3>
          <ul>
            {dataVector.map((data, index) => (
              <li key={index}>
                OUT: {data.count}, IN: {data.secondCount}, Date: {data.date}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      
    </>
  )
}

export default App
