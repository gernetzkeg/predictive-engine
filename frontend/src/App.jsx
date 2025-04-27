import React, { useState } from 'react';
import Upload from './components/Upload';
import DataTable from './components/DataTable';
import ModelControls from './components/ModelControls';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const [csvData, setCsvData] = useState([]);

  const handleDataParsed = (data) => {
    setCsvData(data);
  };

  const handleRunModel = (predictions) => {
    setCsvData(predictions);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finance Web App</h1>
      <p className="mb-4">Upload a CSV to get started.</p>
      <Upload onDataParsed={handleDataParsed} />
      <ErrorBoundary>
        <DataTable data={csvData} />
      </ErrorBoundary>
      <ModelControls onRunModel={handleRunModel} data={csvData} />
    </div>
  );
}

export default App;