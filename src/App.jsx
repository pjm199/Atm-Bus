import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ExcelFileSelector from "./ExcelFileSelector";
import ExcelReader from "./ExcelReader";
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
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    fetch('/api/excel-files')
      .then(response => response.json())
      .then(data => setOptions(data))
      .catch(error => console.error('Error fetching Excel files:', error))
  }, [])

  const handleStart = () => {
    setSavedDataVector([])
    setShowToast(true)
    setToastMessage('Vector initialized!')
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSave = () => {
    const data = {
      count,
      secondCount,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' }),
      selectedOption
    }
    console.log('Saved Data:', JSON.stringify(data))
    setSavedDataVector((prevVector) => [...prevVector, data])
    setToastMessage(`Data has been saved!<br>OUT: ${count}<br>IN: ${secondCount}<br>Time: ${data.time}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleEnd = () => {
    console.log('End button clicked')
    // Add any additional logic for the End button here
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        
        const json = XLSX.utils.sheet_to_json(worksheet)

        const formattedJson = json.map(row => {
          const previstoTime = XLSX.SSF.parse_date_code(row.Previsto)
        console.log("dsadsadsadsa\n", previstoTime)
          const date = new Date(0, 0, 
            previstoTime.d, 
            previstoTime.H, 
            previstoTime.M, 
            previstoTime.S)
          return {
            ...row,
            Previsto: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'})
          }
        })
        setExcelDataVector(formattedJson)
        console.log('Excel Data:', formattedJson)
      } catch (error) {
        console.error('Error reading Excel file:', error)
        setToastMessage(`Error reading Excel file: ${error.message}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
    reader.readAsArrayBuffer(file)
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
      <div>
      <h1>Excel File Reader</h1>
      <ExcelFileSelector onSelectFile={setSelectedFile} />
      {selectedFile && <ExcelReader fileName={`${selectedFile}.xlsx`} />}
    </div>
      <div className="card">
        <div className="start-container">
          <button onClick={handleStart} className="start-button">Inizia Corsa</button>
          <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="select-option">
            <option value="" disabled>Select an option</option>
            {options.map(option => (
              <option key={option.fileName} value={option.value}>{option.value}</option>
            ))}
          </select>
        </div>
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
        <button onClick={handleSave} className="save-button">Save</button>
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
              {savedDataVector.map((data, index) => (
                <tr key={index}>
                  <td>{data.time}</td>
                  <td>{data.time}</td>
                  <td>{data.secondCount}</td>
                  <td>{data.count}</td>
                  <td>{data.secondCount - data.count}</td>
                </tr>
              ))}
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
