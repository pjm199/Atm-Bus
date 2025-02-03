import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import reactLogo from './assets/react.svg'
import AMTlogo from './assets/AMT-logo.png'
import viteLogo from '/vite.svg'
import ExcelFileSelector from "./components/ExcelFileSelector"
import './App.css'

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
    setToastMessage('Corsa Iniziata!')
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSaveStop = () => {
    const data = {
      count,
      secondCount,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      selectedOption
    }
    console.log('Saved Data:', JSON.stringify(data))

    setSavedDataVector((prevVector) => [...prevVector, data])

    setToastMessage(`Fermata Salvata!<br>
                      OUT: ${count}<br>
                      IN: ${secondCount}<br>
                      Time: ${data.time}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
    setCount(0)
    setSecondCount(0)
  }

  const handleCapolinea = () => {
    const worksheet = XLSX.utils.json_to_sheet(savedDataVector)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Saved Data')
    XLSX.writeFile(workbook, 'saved_data.xlsx')
    console.log('Capolina, Dati salvati su file Excel')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    readExcelFile(file)
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
          <img src={AMTlogo} className="logo react" alt="AMT logo" />
        </a>
        <h2 className='logo-react'>AMT Linee Bus</h2>
      </div>

      <ExcelFileSelector onSelectFile={handleSelectFile} />

      
      
      <div className="card">
        <div className="start-container">
          <button onClick={handleStart} className="start-button">Inizia Corsa</button>
          
          <div className="a-bordo">
            <label>A Bordo:</label>
            <span>{aBordo}</span>
          </div>
        </div>
        <div className="counter-container">
          <div className="counter">
            <button onClick={incrementCount}> + </button>
            <div className="counter-display">
              <label>OUT</label>
              <span className="counter-button">{count}</span>
            </div>
            <button onClick={decrementCount}> - </button>
          </div>
          <div className="counter">
            <button onClick={incrementSecondCount}> + </button>
            <div className="counter-display">
              <label>IN</label>
              <span className="counter-button">{secondCount}</span>
            </div>
            <button onClick={decrementSecondCount}> - </button>
          </div>
        </div>
        <button onClick={handleSaveStop} className="save-button">Save</button>
        <input type="file" onChange={handleFileUpload} />
        {showToast && <div className="toast" dangerouslySetInnerHTML={{ __html: toastMessage }}></div>}
        <div className="data-vector">
          <h3>Saved Data:</h3>
          <table>
            <thead>
              <tr>
                <th>Previsto</th>
                <th>Reale</th>
                <th>Saliti</th>
                <th>Scesi</th>
                <th>A Bordo</th>
              </tr>
            </thead>
            <tbody>
              {savedDataVector.reduce((acc, data, index) => {
                const previousABordo = acc.length > 0 ? acc[acc.length - 1].props.children[4].props.children : 0
                const currentABordo = previousABordo + data.secondCount - data.count
                acc.push(
                  <tr key={index}>
                    <td>{data.time}</td>
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
        <button onClick={handleCapolinea} className="end-button">Capolinea</button>
      </div>
    </>
  )
}

export default App
