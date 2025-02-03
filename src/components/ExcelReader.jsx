import { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import * as XLSX from 'xlsx'

const ExcelFileSelector = ({ onSelectFile }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/list-excel");
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error("Error fetching Excel files:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <select onChange={(e) => onSelectFile(e.target.value)}>
      <option value="">Select an Excel File</option>
      {files.map((file, index) => (
        <option key={index} value={file}>
          {file}
        </option>
      ))}
    </select>
  );
};
ExcelFileSelector.propTypes = {
  onSelectFile: PropTypes.func.isRequired,
};

const ExcelReader = ({ fileName }) => {
  const [excelData, setExcelData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/path/to/excel/files/${fileName}`)
        const arrayBuffer = await response.arrayBuffer()
        const data = new Uint8Array(arrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        setExcelData(json)
      } catch (error) {
        console.error('Error reading Excel file:', error)
      }
    }

    if (fileName) {
      fetchData()
    }
  }, [fileName])

  return (
    <div>
      <h3>Excel Data:</h3>
      <table>
        <thead>
          <tr>
            {excelData.length > 0 && Object.keys(excelData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {excelData.map((data, index) => (
            <tr key={index}>
              {Object.values(data).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ExcelReader.propTypes = {
  fileName: PropTypes.string.isRequired,
};

export default ExcelReader

