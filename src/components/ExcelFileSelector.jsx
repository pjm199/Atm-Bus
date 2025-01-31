import { useState } from "react";
import ExcelFileSelector from "./ExcelFileSelector";
import ExcelReader from "./ExcelReader";

function App() {
  const [selectedFile, setSelectedFile] = useState("");

  return (
    <div>
      <h1>Excel File Reader</h1>
      <ExcelFileSelector onSelectFile={setSelectedFile} />
      {selectedFile && <ExcelReader fileName={`${selectedFile}.xlsx`} />}
    </div>
  );
}

export default App;
