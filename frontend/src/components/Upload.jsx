import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function Upload({ onDataParsed }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (response.ok) {
            console.log('Backend response:', result.data);
            onDataParsed(result.data);
          } else {
            console.error('Upload error:', result.error);
          }
        } catch (error) {
          console.error('Network error:', error);
        }
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