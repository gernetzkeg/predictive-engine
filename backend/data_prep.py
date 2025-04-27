import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import numpy as np

def prepare_data(df):
    """Clean and prepare DataFrame for modeling."""
    # Handle missing values
    df = df.dropna()

    # Convert date to numerical feature (days since first date)
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df['days'] = (df['date'] - df['date'].min()).dt.days
    else:
        df['days'] = 0

    # Encode categorical variables (e.g., category)
    if 'category' in df.columns:
        le = LabelEncoder()
        df['category_encoded'] = le.fit_transform(df['category'])
    else:
        df['category_encoded'] = 0

    return df

def train_predict(df):
    """Train a linear regression model and return predictions."""
    df = prepare_data(df)

    # Features: days, category_encoded
    X = df[['days', 'category_encoded']]
    y = df['amount']

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    # Predict
    predictions = model.predict(X)

    # Add predictions to DataFrame
    df['predicted_amount'] = predictions

    return df[['date', 'amount', 'category', 'predicted_amount']].to_dict(orient='records')