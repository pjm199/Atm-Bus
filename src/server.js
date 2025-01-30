import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3001
const excelDir = path.join(__dirname, 'excel-files') // Directory where Excel files are stored

// Ensure the directory exists
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir)
}

app.use(express.json())

app.get('/api/excel-files', (req, res) => {
    const files = fs.readdirSync(excelDir)
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'))

    if (xlsxFiles.length === 0) {
      return res.status(404).json({ error: 'No Excel files found' })
    }

    const options = xlsxFiles.map(file => {
      const filePath = path.join(excelDir, file)
      const workbook = XLSX.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const cellValue = worksheet['A2'] ? worksheet['A2'].v : 'Unknown'
      return { fileName: file, value: cellValue }
    })
    res.json(options)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})