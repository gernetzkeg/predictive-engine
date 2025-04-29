import React, { useState } from 'react';
import Select from 'react-select';

function FeatureEngineering({ availableFeatures, onFeatureSelect }) {
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const options = availableFeatures.map((feature) => ({
    value: feature,
    label: feature,
  }));

  const handleChange = (selected) => {
    setSelectedFeatures(selected);
    onFeatureSelect(selected.map((opt) => opt.value));
  };

  // Basic feature recommendations
  const recommendations = [
    'Include lagged variables for recent trends.',
    'Use rolling means to capture moving averages.',
    'Add interaction terms for combined effects of x-variables.'
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-600 mb-2">Select Engineered Features</label>
      <Select
        isMulti
        options={options}
        value={selectedFeatures}
        onChange={handleChange}
        placeholder="Choose engineered features"
        className="w-full max-w-xs"
      />
      <div className="mt-2">
        <p className="text-gray-600">Recommendations:</p>
        <ul className="list-disc pl-5 text-gray-600">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FeatureEngineering;