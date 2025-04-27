import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

function Upload({ onDataParsed }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        Papa.parse(file, {
          complete: (result) => {
            console.log('Parsed CSV:', result.data);
            onDataParsed(result.data); // Pass parsed data to parent
          },
          header: true, // Treat first row as headers
          skipEmptyLines: true,
          error: (error) => {
            console.error('CSV parse error:', error);
          },
        });
      }
    },
    [onDataParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        {isDragActive
          ? 'Drop the CSV file here'
          : 'Drag and drop a CSV file, or click to select'}
      </p>
    </div>
  );
}

export default Upload;