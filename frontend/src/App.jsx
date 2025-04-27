import React from 'react';
import Upload from './components/Upload';
import './index.css';

function App() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finance Web App</h1>
      <p className="mb-4">Upload a CSV to get started.</p>
      <Upload />
    </div>
  );
}

export default App;