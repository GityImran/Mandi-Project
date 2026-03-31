import pandas as pd
from xgboost import XGBRegressor
import joblib
from datetime import datetime, timedelta

# 🔴 Dummy dataset (replace with DB data later)
data = []

base_price = 2000

for i in range(30):
    data.append({
        "day": i,
        "price": base_price + (i * 5)  # simple trend
    })

df = pd.DataFrame(data)

X = df[["day"]]
y = df["price"]

model = XGBRegressor(n_estimators=50, learning_rate=0.1)
model.fit(X, y)

# 💾 Save model
joblib.dump(model, "ml_model.pkl")

print("Model trained and saved!")