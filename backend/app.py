from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from data_prep import train_predict

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if file and file.filename.endswith('.csv'):
        try:
            df = pd.read_csv(file)
            data = df.to_dict(orient='records')
            return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Invalid file format, CSV required'}), 400

@app.route('/predict', methods=['POST'])
def predict():
    try:
        payload = request.get_json()
        if not payload or 'data' not in payload:
            return jsonify({'error': 'No data provided'}), 400
        df = pd.DataFrame(payload['data'])
        date_column = payload.get('date_column')
        category_columns = payload.get('category_columns', [])
        y_variable = payload.get('y_variable')
        x_variables = payload.get('x_variables', [])
        selected_features = payload.get('selected_features', [])
        model_type = payload.get('model_type', 'ensemble')
        result = train_predict(
            df, date_column, category_columns, y_variable, x_variables, selected_features, model_type
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)