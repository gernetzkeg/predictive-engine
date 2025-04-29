import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error
import re

def clean_numeric_value(value):
    """Clean a value to prepare for numeric conversion."""
    if isinstance(value, str):
        value = re.sub(r'[^\d.-]', '', value.strip())
        return value
    return value

def engineer_features(df, date_column, y_variable, x_variables, selected_features=None):
    """Engineer features based on user-specified fields and selections."""
    df = df.copy()
    available_features = ['days']  # Always include days
    engineered_cols = []

    # Lagged variables for y_variable and x_variables
    for col in [y_variable] + x_variables:
        for lag in [1, 2]:
            df[f'{col}_lag_{lag}'] = df[col].shift(lag)
            available_features.append(f'{col}_lag_{lag}')
            engineered_cols.append(f'{col}_lag_{lag}')

    # Rolling means for y_variable and x_variables
    for col in [y_variable] + x_variables:
        df[f'{col}_roll_mean_3'] = df[col].rolling(window=3, min_periods=1).mean()
        available_features.append(f'{col}_roll_mean_3')
        engineered_cols.append(f'{col}_roll_mean_3')

    # Interaction terms between x_variables
    for i, col1 in enumerate(x_variables):
        for col2 in x_variables[i+1:]:
            df[f'{col1}_x_{col2}'] = df[col1] * df[col2]
            available_features.append(f'{col1}_x_{col2}')
            engineered_cols.append(f'{col1}_x_{col2}')

    # Fill NaN in engineered features with median
    for col in engineered_cols:
        df[col] = df[col].fillna(df[col].median())

    # Filter selected features
    if selected_features:
        feature_cols = [f for f in selected_features if f in available_features]
    else:
        feature_cols = available_features

    return df, feature_cols, available_features

def prepare_data(df, date_column, category_columns, y_variable, x_variables, selected_features=None):
    """Clean and prepare DataFrame based on user-specified field types."""
    print(f"Input DataFrame columns: {df.columns.tolist()}")
    print(f"Input DataFrame dtypes:\n{df.dtypes}")
    print(f"Input DataFrame head:\n{df.head().to_string()}")
    print(f"Selected date column: {date_column}")
    print(f"Selected category columns: {category_columns}")
    print(f"Selected y-variable: {y_variable}")
    print(f"Selected x-variables: {x_variables}")
    print(f"Selected features: {selected_features}")

    # Validate inputs
    if date_column not in df.columns:
        raise ValueError(f"Selected date column '{date_column}' not found in dataset")
    if y_variable not in df.columns:
        raise ValueError(f"Selected y-variable '{y_variable}' not found in dataset")
    for col in category_columns + x_variables:
        if col not in df.columns:
            raise ValueError(f"Selected column '{col}' not found in dataset")

    # Parse date column
    df[date_column] = pd.to_datetime(df[date_column], errors='coerce', infer_datetime_format=True)
    if df[date_column].isna().all():
        raise ValueError(f"Unable to parse dates in '{date_column}'. Please ensure valid date formats.")
    if df[date_column].isna().any():
        median_date = df[date_column].dropna().median()
        df[date_column] = df[date_column].fillna(median_date)

    df['days'] = (df[date_column] - df[date_column].min()).dt.days

    # Convert y-variable to numeric
    print(f"Raw values for '{y_variable}' (first 5): {df[y_variable].head().tolist()}")
    df[y_variable] = pd.to_numeric(df[y_variable].apply(clean_numeric_value), errors='coerce')
    if df[y_variable].isna().all():
        raise ValueError(f"Selected y-variable '{y_variable}' cannot be converted to numeric")
    df[y_variable] = df[y_variable].fillna(df[y_variable].median())
    print(f"Converted '{y_variable}' to numeric. Values (first 5): {df[y_variable].head().tolist()}")

    # Convert x-variables to numeric
    numeric_cols = []
    for col in x_variables:
        print(f"Raw values for '{col}' (first 5): {df[col].head().tolist()}")
        df[col] = pd.to_numeric(df[col].apply(clean_numeric_value), errors='coerce')
        if df[col].isna().all():
            raise ValueError(f"Selected x-variable '{col}' cannot be converted to numeric")
        df[col] = df[col].fillna(df[col].median())
        numeric_cols.append(col)
        print(f"Converted '{col}' to numeric. Values (first 5): {df[col].head().tolist()}")

    # Treat category columns as strings
    categorical_cols = category_columns
    for col in categorical_cols:
        df[col] = df[col].astype(str)
        if df[col].notna().any():
            df[col] = df[col].fillna(df[col].mode()[0])

    # Encode categorical columns
    encoded_cols = []
    for col in categorical_cols:
        le = LabelEncoder()
        df[f"{col}_encoded"] = le.fit_transform(df[col])
        encoded_cols.append(f"{col}_encoded")

    # Engineer features
    df, feature_cols, available_features = engineer_features(df, date_column, y_variable, x_variables, selected_features)

    return df, date_column, numeric_cols, categorical_cols, encoded_cols, feature_cols, available_features

def train_predict(df, date_column=None, category_columns=None, y_variable=None, x_variables=None, selected_features=None, model_type='all'):
    """Train multiple models and return predictions with metrics."""
    print(f"Selected y_variable: {y_variable}")
    print(f"Model type: {model_type}")
    if not date_column:
        raise ValueError("No date column provided")
    if not y_variable:
        raise ValueError("No y-variable provided")
    if not x_variables:
        raise ValueError("No x-variables provided")

    df, date_col, numeric_cols, categorical_cols, encoded_cols, feature_cols, available_features = prepare_data(
        df, date_column, category_columns or [], y_variable, x_variables or [], selected_features
    )

    # Features
    print(f"Feature columns: {feature_cols + encoded_cols}")
    X = df[feature_cols + encoded_cols]
    y = df[y_variable]

    # Initialize models
    models = {
        'linear': LinearRegression(),
        'rf': RandomForestRegressor(n_estimators=100, random_state=42),
        'xgb': XGBRegressor(n_estimators=100, random_state=42)
    }

    predictions = {}
    metrics = {}
    feature_importance = {}

    # Train and predict for each model
    for name, model in models.items():
        if model_type != 'all' and name != model_type and model_type != 'ensemble':
            continue
        model.fit(X, y)
        preds = model.predict(X)
        predictions[name] = preds

        # Compute metrics
        mae = mean_absolute_error(y, preds)
        rmse = np.sqrt(mean_squared_error(y, preds))
        metrics[name] = {'mae': mae, 'rmse': rmse}

        # Feature importance (for RF and XGB)
        if name in ['rf', 'xgb']:
            feature_importance[name] = dict(zip(feature_cols + encoded_cols, model.feature_importances_))

    # Ensemble predictions (average of all models)
    if model_type == 'all' or model_type == 'ensemble':
        ensemble_preds = np.mean([p for p in predictions.values()], axis=0)
        predictions['ensemble'] = ensemble_preds
        metrics['ensemble'] = {
            'mae': mean_absolute_error(y, ensemble_preds),
            'rmse': np.sqrt(mean_squared_error(y, ensemble_preds))
        }

    # Select predictions based on model_type
    selected_model = model_type if model_type in predictions else 'ensemble'
    df[f'predicted_{y_variable}'] = predictions[selected_model]

    # Return results
    return_cols = [date_col] + numeric_cols + categorical_cols + [f'predicted_{y_variable}']
    print(f"Returning columns: {return_cols}")
    return {
        'predictions': df[return_cols].to_dict(orient='records'),
        'target': y_variable,
        'metrics': metrics,
        'feature_importance': feature_importance,
        'available_features': available_features
    }