import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'

import AMTlogo from './assets/AMT-logo.png'

import ExcelFileSelector from "./components/ExcelFileSelector"
import NumberSpinner from './components/NumberSpinner';

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

  const [currentFermata, setCurrentFermata] = useState('')
  const [currentDenominazione, setCurrentDenominazione] = useState('')
  const [currentPrevisto, setCurrentPrevisto] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedFileName, setSelectedFileName] = useState('')

  const handleSelectFile = useCallback((file) => {
    setSelectedFile(file)
    setSelectedFileName(file.name) // Set the selected file name
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
        const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: 1 })

        // Convert the array of arrays to an array of objects
        const headers = json[0]
        const rows = json.slice(1)

        const formattedData = rows.map(row => {
          const rowData = {}
          row.forEach((cell, index) => {
            rowData[headers[index]] = cell
          })
          return rowData
        })

        // Use the 'w' property for the 'Previsto' column
        formattedData.forEach(row => {
          if (row.Previsto && row.Previsto.w) {
            row.Previsto = row.Previsto.w
          }
        })

        setExcelDataVector(formattedData)
        console.log('Excel Data:', formattedData)

      } catch (error) {
        console.error('Error reading Excel file:', error)
        setToastMessage(`Error reading Excel file: ${error.message}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
    reader.readAsArrayBuffer(file)
  } // End of readExcelFile

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
    setCurrentIndex(0) // Reset index to 0
    setCurrentFermata(excelDataVector[0]?.Fermata || 'N/A')
    setCurrentDenominazione(excelDataVector[0]?.Denominazione || 'N/A')
    setCurrentPrevisto(excelDataVector[0]?.Previsto || 'N/A')  
  }

  const handleSaveStop = () => {
    const data = {
      count,
      secondCount,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      selectedOption,
      previsto: excelDataVector[savedDataVector.length]?.Previsto || 'N/A' 
    }

    console.log('Saved Data:', JSON.stringify(data))

    setSavedDataVector((prevVector) => [...prevVector, data])

    setToastMessage(`Fermata Salvata!<br>
                      Ora: ${data.time}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
    setCount(0)
    setSecondCount(0)
    // Update current values to the next index
  const nextIndex = currentIndex + 1
  setCurrentIndex(nextIndex)
  setCurrentFermata(excelDataVector[nextIndex]?.Fermata || 'N/A')
  setCurrentDenominazione(excelDataVector[nextIndex]?.Denominazione || 'N/A')
  setCurrentPrevisto(excelDataVector[nextIndex]?.Previsto || 'N/A')
  }

  const handleCapolinea = () => {
    const worksheet = XLSX.utils.json_to_sheet(savedDataVector)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fermate Salvate')
    XLSX.writeFile(workbook, 'saved_data.xlsx')
    console.log('Capolina, Dati salvati su file Excel')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    readExcelFile(file)
  }

  const calculateABordo = () => {
    return savedDataVector.reduce((acc, data) => acc + data.secondCount - data.count, 0)
  }

  const aBordo = calculateABordo()

  return ( // JSX --------
    <>
      <div>
        <a href="https://www.amt.genova.it/amt/" target="_blank">
          <img src={AMTlogo} className="logo react" alt="AMT logo" />
        </a>
      </div>

      <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px', 
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '300px', 
                    justifyContent: 'center', 
                    marginBottom: '30px',
                    margin: '0 auto',
                    backgroundColor: 'rgb(17, 36, 55)',
                  }}>
          <h2 style={{ margin: 0 }}>AMT Linee</h2>
          <ExcelFileSelector onSelectFile={handleSelectFile} />
      </div>
      {selectedFileName && (
          <div style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' 

      }}>
        <p>Selected File: {selectedFileName}</p>
  </div>
)}
      <input type="file" onChange={handleFileUpload} />

      <div>
          <button style={{border: '3px solid #ccc', 
                      margin: '0 auto',
                      width: '200px',
                      padding: '10px', 
                      borderRadius: '10px', 
                      marginBottom: '20px',
                      marginTop: '20px' }}
          onClick={handleStart} 
          className="start-button">Inizia Corsa</button>
      </div>
      
      <h2 style={{border: '3px solid #ccc', 
                      margin: '0 auto',
                      width: '280px',
                      padding: '10px', 
                      borderRadius: '10px', 
                      marginBottom: '10px',
                      color :'#fff',
                      backgroundColor: 'rgb(0, 102, 128)',
                      marginTop: '10px' }}>
        {currentDenominazione}
      </h2>
      
      <h2 style={{border: '3px solid #ccc', 
                      margin: '0 auto',
                      width: '200px',
                      padding: '10px', 
                      borderRadius: '10px', 
                      marginBottom: '10px',
                      color :'rgb(0, 102, 128)',
                      backgroundColor: 'rgb(253, 130, 4)',
                      marginTop: '20px',
                      }}
                      >A Bordo : {aBordo}
      </h2>

      <div className="AppSpinner" style={{ border: '3px solid #ccc', 
                                          padding: '10px', 
                                          borderRadius: '10px', 
                                          marginBottom: '10px' }}>
        <h2 style={{color :'rgb(253, 130, 4)'}}>Scesi</h2>
        <div style={{ marginBottom: '20px' }}>
          <NumberSpinner
            value={count}
            onChange={setCount}
            min={0}
            max={100}
          />
        </div>
        <h2 style={{color :'rgb(253, 130, 4)'}}>Saliti</h2>
        <div>
          <NumberSpinner
            value={secondCount}
            onChange={setSecondCount}
            min={0}
            max={100}
          />
          <p>-----</p>
        </div>
      </div>
      <div>
      
      <button style={{border: '3px solid #ccc', 
                      margin: '0 auto',
                      width: '200px',
                      padding: '10px', 
                      borderRadius: '10px', 
                      marginBottom: '10px',
                      marginTop: '10px' }} onClick={handleSaveStop} className="save-button">Salva Fermata</button>
      
      
      </div>
  
      {showToast && <div className="toast" dangerouslySetInnerHTML={{ __html: toastMessage }}></div>}
        <div className="data-vector">
          <h3>Fermate Salvate</h3>
          <table>
            <thead>
              <tr>
                <th>Fermata</th>
                <th>Previsto</th>
                <th>Reale</th>
                <th>Saliti</th>
                <th>Scesi</th>
                <th>Bordo</th>
              </tr>
            </thead>
            <tbody>
              {savedDataVector.reduce((acc, data, index) => {
                const previousABordo = acc.length > 0 ? acc[acc.length - 1].props.children[5].props.children : 0
                const currentABordo = previousABordo + data.secondCount - data.count
                acc.push(
                  <tr key={index}>
                    <td>{excelDataVector[index]?.Fermata || 'N/A'}</td>
                    <td>{data.previsto}</td>
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

        <button onClick={handleCapolinea} className="end-button">Capolinea</button>
        
        <div className="data-vector">
          <h3>Lista Fermate caricate da File Excel</h3>
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
        
      
    </>
  )
}

export default App
