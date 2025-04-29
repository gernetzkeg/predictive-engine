import React, { useState } from 'react';
import Upload from './components/Upload';
import DataTable from './components/DataTable';
import ModelControls from './components/ModelControls';
import Visualizations from './components/Visualizations';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modelResults, setModelResults] = useState(null);

  const handleDataParsed = (data) => {
    setCsvData(data);
    setModelResults(null);
    if (data.length > 0) {
      const allCols = Object.keys(data[0]);
      setColumns(allCols);
    } else {
      setColumns([]);
    }
  };

  const handleRunModel = (results) => {
    setCsvData(results.predictions);
    setModelResults(results);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finance Web App</h1>
      <p className="mb-4">Upload a CSV to get started.</p>
      <Upload onDataParsed={handleDataParsed} />
      <ErrorBoundary>
        <DataTable data={csvData} />
      </ErrorBoundary>
      <ModelControls
        onRunModel={handleRunModel}
        data={csvData}
        columns={columns}
      />
      {modelResults && (
        <ErrorBoundary>
          <Visualizations
            predictions={modelResults.predictions}
            metrics={modelResults.metrics}
            featureImportance={modelResults.featureImportance}
            target={modelResults.target}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;