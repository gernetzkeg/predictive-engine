import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

function Visualizations({ predictions, metrics, featureImportance, target }) {
  // Prepare data for actual vs predicted
  const forecastData = predictions.map((row, index) => ({
    index,
    actual: row[target],
    predicted: row[`predicted_${target}`],
  }));

  // Prepare error metrics data
  const errorData = Object.entries(metrics).map(([model, values]) => ({
    model,
    mae: values.mae,
    rmse: values.rmse,
  }));

  // Prepare feature importance data
  const featureImportanceData = {};
  Object.entries(featureImportance).forEach(([model, importance]) => {
    featureImportanceData[model] = Object.entries(importance).map(([feature, value]) => ({
      feature,
      importance: value,
    }));
  });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Model Performance Visualizations</h2>

      {/* Actual vs Predicted */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Actual vs Predicted {target}</h3>
        <LineChart width={600} height={300} data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" />
        </LineChart>
      </div>

      {/* Error Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Error Metrics</h3>
        <BarChart width={600} height={300} data={errorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="mae" fill="#8884d8" name="MAE" />
          <Bar dataKey="rmse" fill="#82ca9d" name="RMSE" />
        </BarChart>
      </div>

      {/* Feature Importance */}
      {Object.entries(featureImportanceData).map(([model, data]) => (
        <div key={model} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Feature Importance ({model.toUpperCase()})</h3>
          <BarChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
        </div>
      ))}
    </div>
  );
}

export default Visualizations;