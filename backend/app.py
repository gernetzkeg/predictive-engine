from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow frontend requests from http://localhost:5173

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if file and file.filename.endswith('.csv'):
        try:
            # Read CSV into pandas DataFrame
            df = pd.read_csv(file)
            # Convert to list of dictionaries
            data = df.to_dict(orient='records')
            return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Invalid file format, CSV required'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)