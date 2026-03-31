import joblib
import numpy as np
from datetime import datetime

# Load model
model = joblib.load("ml/ml_model.pkl")

def predict_prices(days_ahead=3):
    today = datetime.now().day

    predictions = []

    for i in range(1, days_ahead + 1):
        future_day = today + i
        pred = model.predict(np.array([[future_day]]))[0]

        predictions.append(round(float(pred), 2))

    return predictions