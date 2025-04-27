import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function Upload() {
  const onDrop = useCallback((acceptedFiles) => {
    // Log uploaded files for now
    console.log('Uploaded files:', acceptedFiles);
  }, []);

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