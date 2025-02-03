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
        setFiles(data.files);
      } catch (error) {
        console.error("Error fetching Excel files:", error);
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
      <label htmlFor="file-selector">Seleziona una Linea </label>
      <select id="file-selector" onChange={handleFileChange}>
        <option value="">BUS N.</option>
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
