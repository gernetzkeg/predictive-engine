function ModelControls({ onRunModel }) {
    return (
      <div className="mt-6">
        <button
          onClick={onRunModel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Run Predictive Model
        </button>
      </div>
    );
  }
  
  export default ModelControls;