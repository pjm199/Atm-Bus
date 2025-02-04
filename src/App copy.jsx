import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import './App.css'

import AMTlogo from './assets/AMT-logo.png'

import ExcelFileSelector from "./components/ExcelFileSelector"
import ExcelReader from './components/ExcelReader'

function App() {
  const [count, setCount] = useState(0)
  const [secondCount, setSecondCount] = useState(0)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [savedDataVector, setSavedDataVector] = useState([])
  const [excelDataVector, setExcelDataVector] = useState([])

  const [selectedOption, setSelectedOption] = useState('')
  const [options, setOptions] = useState([])
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedNumber, setSelectedNumber] = useState('')

  const handleSelectFile = useCallback((file) => {
    setSelectedFile(file)
    readExcelFile(file)
  }, [])

  const readExcelFile = (file) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        setExcelDataVector(json)
        console.log('Excel Data:', json)
      } catch (error) {
        console.error('Error reading Excel file:', error)
        setToastMessage(`Error reading Excel file: ${error.message}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    fetch('/api/excel-files')
      .then(response => response.json())
      .then(data => setOptions(data))
      .catch(error => console.error('Error fetching Excel files:', error))
  }, [])

  const handleStart = () => {
    setCount(0)
    setSecondCount(0)
    setSavedDataVector([])
    setShowToast(true)
    setToastMessage('Vector initialized!')
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSave = () => {
    const data = {
      count,
      secondCount,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      selectedOption
    }
    console.log('Saved Data:', JSON.stringify(data))

    setSavedDataVector((prevVector) => [...prevVector, data])

    setToastMessage(`Data has been saved!<br>
                      OUT: ${count}<br>
                      IN: ${secondCount}<br>
                      Time: ${data.time}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setCount(0)
    setSecondCount(0)
  }

  const handleEnd = () => {
    console.log('End button clicked')
    const worksheet = XLSX.utils.json_to_sheet(savedDataVector)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Saved Data')
    XLSX.writeFile(workbook, 'saved_data.xlsx')
  }

  const incrementCount = () => {
    setCount((prevCount) => Math.min(prevCount + 1, 100))
  }

  const decrementCount = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 0))
  }

  const incrementSecondCount = () => {
    setSecondCount((prevCount) => Math.min(prevCount + 1, 100))
  }

  const decrementSecondCount = () => {
    setSecondCount((prevCount) => Math.max(prevCount - 1, 0))
  }

  const calculateABordo = () => {
    return savedDataVector.reduce((acc, data) => acc + data.secondCount - data.count, 0)
  }

  const aBordo = calculateABordo()

  return (
    <>
      <div>
        <a href="https://www.amt.genova.it/amt/" target="_blank">
          <img src={AMTlogo} className="logo-react" alt="AMT logo" />
        </a>
      </div>
      
      <div style={{ marginBottom: '30px' }}></div>
      
      <div className='card'>
        <div className='start-container'>
          <ExcelFileSelector onSelectFile={handleSelectFile} />
        </div>
        
        <div className="start-container">
            <button onClick={handleStart} className="start-button">Inizia Corsa</button>
        </div>
        <div>
          <label className='passeggeri'>Passeggeri  A Bordo - </label>
          <button  className="bus-select">{aBordo}</button>
        </div>
      </div>
      
      
      <div className="card">
        <div className="counter-container">
          <div className="counter">
              <label className="bus-select">Scesi</label>
            <button onClick={incrementCount}> + </button>
            <div className="counter-display">
              <span className="counter-button">{count}</span>
            </div>
            <button onClick={decrementCount}> - </button>
          </div>
          <div className="counter">
              <label className="bus-select">Saliti</label>
            <button onClick={incrementSecondCount}> + </button>
            <div className="counter-display">
              <span className="counter-button">{secondCount}</span>
            </div>
            <button onClick={decrementSecondCount}> - </button>
          </div>
        </div>

        <button onClick={handleSave} className="save-button">Salva Fermata</button>
        
        {showToast && <div className="toast" dangerouslySetInnerHTML={{ __html: toastMessage }}></div>}
        <div className="data-vector">
          
          <table>
            <thead>
              <tr>
                <th>Fermata</th>
                <th>Previsto</th>
                <th>Reale</th>
                <th>Saliti</th>
                <th>Scesi</th>
                <th>A Bordo</th>
              </tr>
            </thead>
            <tbody>
            {savedDataVector.reduce((acc, data, index) => {
                const previousABordo = acc.length > 0 ? acc[acc.length - 1].props.     children[4].props.children : 0
                
                const currentABordo = previousABordo + data.secondCount - data.count
                
                let formattedPrevisto = 'Invalid Date'
                console.log('excelDataVector:', excelDataVector)
                console.log('index:', index)  
                console.log('excelDataVector[index]:', excelDataVector[index])
                console.log('excelDataVector[index]?.Fermata:', excelDataVector[index]?.Fermata)
                console.log('data:', data)
                console.log('data.previsto:', data.previsto)

                if (data.previsto) {
                  
                  const previstoTime = data.previsto.split(':')
                if (previstoTime.length === 3) {
        
                const date = new Date()
                date.setHours(previstoTime[0], previstoTime[1], previstoTime[2])
                
                formattedPrevisto = date.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
        })
      }
    }
    acc.push(
      <tr key={index}>
        <td>{excelDataVector[index]?.Fermata || 'N/A'}</td>
        <td>{formattedPrevisto}</td>
        <td>{data.time}</td>
        <td>{data.secondCount}</td>
        <td>{data.count}</td>
        <td>{currentABordo}</td>
      </tr>
          )
          return acc
        }, [])}
      </tbody>
    </table>
</div>
        <div className="data-vector">
          <h3>Excel Data:</h3>
          <table>
    <thead>
      <tr>
        {excelDataVector.length > 0 && Object.keys(excelDataVector[0]).map((key, index) => (
          <th key={index}>{key}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {excelDataVector.map((data, index) => (
        <tr key={index}>
          {Object.values(data).map((value, i) => (
            <td key={i}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
        </div>
        <button onClick={handleEnd} className="end-button">Capolinea</button>
      </div>
    </>
  )
}

export default App
