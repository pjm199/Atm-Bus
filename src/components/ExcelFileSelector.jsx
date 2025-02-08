import { useEffect, useState, memo } from "react";
import PropTypes from "prop-types";

const ExcelFileSelector = ({ onSelectFile }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/list-excel");
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = await response.json();
        console.log("data.files", data.files);
        setFiles(data.files);
      } catch (error) {
        console.error("ERRORE lettura Excel files:", error);
      }
    };

    fetchFiles();
  }, []); // ✅ Runs only once

  const handleFileChange = (e) => {
    const file = e.target.value
    onSelectFile(file)
  }

  return (
    <div>
      <select id="file-selector" onChange={handleFileChange}>
        <option value="">Seleziona N.</option>
        {files.map((file, index) => (
          <option key={index} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  )
}

ExcelFileSelector.propTypes = {
  onSelectFile: PropTypes.func.isRequired,
};

// ✅ Memoize the component to prevent re-renders unless `onSelectFile` or `files` change
export default memo(ExcelFileSelector);
