import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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

export default ExcelFileSelector;
