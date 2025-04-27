import { useCallback } from 'react';

function ModelControls({ onRunModel, data }) {
  const handleRunModel = useCallback(async () => {
    if (!data || data.length === 0) {
      console.error('No data to predict');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Predictions:', result.predictions);
        onRunModel(result.predictions);
      } else {
        console.error('Prediction error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }, [data, onRunModel]);

  return (
    <div className="mt-6">
      <button
        onClick={handleRunModel}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Run Predictive Model
      </button>
    </div>
  );
}

export default ModelControls;