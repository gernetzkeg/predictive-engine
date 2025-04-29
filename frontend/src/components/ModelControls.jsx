import { useCallback, useState } from 'react';
import Select from 'react-select';
import FeatureEngineering from './FeatureEngineering';

function ModelControls({ onRunModel, data, columns }) {
  const [selectedDateColumn, setSelectedDateColumn] = useState(null);
  const [selectedCategoryColumns, setSelectedCategoryColumns] = useState([]);
  const [selectedYVariable, setSelectedYVariable] = useState(null);
  const [selectedXVariables, setSelectedXVariables] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedModel, setSelectedModel] = useState({ value: 'ensemble', label: 'Ensemble' });
  const [availableFeatures, setAvailableFeatures] = useState([]);

  const options = columns.map((col) => ({
    value: col,
    label: col,
  }));

  const modelOptions = [
    { value: 'linear', label: 'Linear Regression' },
    { value: 'rf', label: 'Random Forest' },
    { value: 'xgb', label: 'XGBoost' },
    { value: 'ensemble', label: 'Ensemble' },
  ];

  const handleRunModel = useCallback(async () => {
    if (!data || data.length === 0) {
      console.error('No data to predict');
      return;
    }
    if (!selectedDateColumn) {
      console.error('No date column selected');
      return;
    }
    if (!selectedYVariable) {
      console.error('No y-variable selected');
      return;
    }
    if (selectedXVariables.length === 0) {
      console.error('No x-variables selected');
      return;
    }
    try {
      const payload = {
        data,
        date_column: selectedDateColumn.value,
        category_columns: selectedCategoryColumns.map((col) => col.value),
        y_variable: selectedYVariable.value,
        x_variables: selectedXVariables.map((col) => col.value),
        selected_features: selectedFeatures,
        model_type: selectedModel.value,
      };
      console.log('Sending to /predict:', payload);
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log('Received from /predict:', result);
      if (response.ok) {
        console.log('Predictions:', result.predictions, 'Target:', result.target);
        setAvailableFeatures(result.available_features);
        onRunModel(result);
      } else {
        console.error('Prediction error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }, [
    data,
    selectedDateColumn,
    selectedCategoryColumns,
    selectedYVariable,
    selectedXVariables,
    selectedFeatures,
    selectedModel,
    onRunModel,
  ]);

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Select Date Column</label>
        <Select
          options={options}
          value={selectedDateColumn}
          onChange={setSelectedDateColumn}
          placeholder="Choose a date column"
          className="w-full max-w-xs"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Select Category/Text Columns</label>
        <Select
          isMulti
          options={options}
          value={selectedCategoryColumns}
          onChange={setSelectedCategoryColumns}
          placeholder="Choose category columns"
          className="w-full max-w-xs"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Select Y-Variable to Predict</label>
        <Select
          options={options}
          value={selectedYVariable}
          onChange={setSelectedYVariable}
          placeholder="Choose a y-variable"
          className="w-full max-w-xs"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Select Numerical X-Variables</label>
        <Select
          isMulti
          options={options}
          value={selectedXVariables}
          onChange={setSelectedXVariables}
          placeholder="Choose x-variables"
          className="w-full max-w-xs"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Select Model</label>
        <Select
          options={modelOptions}
          value={selectedModel}
          onChange={setSelectedModel}
          placeholder="Choose a model"
          className="w-full max-w-xs"
        />
      </div>
      <FeatureEngineering
        availableFeatures={availableFeatures}
        onFeatureSelect={setSelectedFeatures}
      />
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