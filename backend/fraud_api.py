from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import IsolationForest
from xgboost import XGBClassifier
import uvicorn
import pickle as pkl


# Load pre-trained models (Assume models are pre-loaded in memory)
iso_forest = pkl.load(open('./models/iso_forest', 'rb'))
xgb_model = pkl.load(open('./models/xgb_model', 'rb'))

# Assume this is our transaction history database (for user-card lookup)
transaction_data = pkl.load(open('./objects/transactions', 'rb'))  # Load historical transactions here

# FastAPI App Initialization
app = FastAPI()

class TransactionRequest(BaseModel):
    year: int
    month: int
    day: int
    mcc: int
    time_of_day: str  # Format: "HH:MM"
    city: int
    Use_chip_labeled: int
    amount: float
    has_error: int
    irs_reportable_labeled: int
    irs_description_labeled: int
    user_id: int
    card_id: int
    
def convert_to_utc(*data):
    
    year, month, day, time_str = data
    time_obj = datetime.strptime(time_str, "%H:%M").time()
    
    # Create full datetime object (assuming UTC)
    dt_obj = datetime(year, month, day, time_obj.hour, time_obj.minute)
    
    # Convert to UTC timestamp string
    return dt_obj.isoformat() + "Z"


# def convert_to_utc(year, month, day, time_of_day):
#     local_time = f"{year}-{month:02d}-{day:02d} {time_of_day}:00"
#     dt = datetime.strptime(local_time, "%Y-%m-%d %H:%M:%S")
#     return dt  # Assume UTC or apply timezone conversion if needed

def get_past_transactions(user_id, card_id, current_time, window_size=20):
    user_card_transactions = transaction_data[
        (transaction_data["User"] == user_id) & (transaction_data["Card"] == card_id)
    ]
    user_card_transactions = user_card_transactions.sort_values(by="UTC_Timestamp")

    # Select the last `window_size` transactions before the given timestamp
    past_transactions = user_card_transactions[user_card_transactions["UTC_Timestamp"] < current_time].tail(window_size)
    return past_transactions

def generate_features(transaction_window):
    """
    Compute statistical, behavioral, and frequency-based features from a transaction window.
    """
    if transaction_window.empty or len(transaction_window) < 2:
        return None  # Not enough data

    # Convert to NumPy array for faster calculations
    arr = transaction_window[['Month', 'Day', 'MCC', 'Minutes_Since_Midnight', 'city_labeled', 'Use_chip_labeled', 'Amount', 'has_error', 'irs_reportable_labeled', 'irs_description_labeled']].values

    # Compute features
    agg_mean = arr.mean(axis=0)
    agg_std = arr.std(axis=0)
    agg_min = arr.min(axis=0)
    agg_max = arr.max(axis=0)
    agg_range = agg_max - agg_min

    # Time-based features
    time_diffs = transaction_window["UTC_Timestamp"].diff().dt.total_seconds().dropna().values
    avg_time_diff = np.mean(time_diffs) if len(time_diffs) > 0 else 0
    max_time_diff = np.max(time_diffs) if len(time_diffs) > 0 else 0
    min_time_diff = np.min(time_diffs) if len(time_diffs) > 0 else 0

    # High-value transactions
    amounts = arr[:, 0]
    high_value_txns = np.sum(amounts > np.percentile(amounts, 75)) / len(amounts)
    rolling_sum = np.sum(amounts)
    rolling_avg = np.mean(amounts)

    # Merchant & MCC diversity
    try:
        unique_merchants = len(set(transaction_window["Merchant_ID"]))
    except:
        unique_merchants = 0
        
    unique_mcc_codes = len(set(transaction_window["MCC"]))

    # Combine all features
    features = np.concatenate([
        agg_mean, agg_std, agg_min, agg_max, agg_range,
        [avg_time_diff, max_time_diff, min_time_diff],  # Time-based
        [high_value_txns, rolling_sum, rolling_avg],    # Amount-based
        [unique_merchants, unique_mcc_codes]           # Merchant & MCC diversity
    ])

    return features

# Fraud Prediction Endpoint
@app.post("/predict")
async def predict_fraud(transaction: TransactionRequest):
    """
    Receive transaction data, retrieve historical transactions, generate features, and return fraud prediction.
    """
    try:
        # Convert timestamp to UTC
        current_time = convert_to_utc(transaction.year, transaction.month, transaction.day, transaction.time_of_day)
        print(current_time)

        # Retrieve past transactions for the user-card pair
        transaction_window = get_past_transactions(transaction.user_id, transaction.card_id, current_time, window_size=20)
        print(transaction_window)

        # Generate features
        features = generate_features(transaction_window)
        print(features)
        print(features.shape)
        
        if features is None:
            raise HTTPException(status_code=400, detail="Not enough transaction history for prediction.")

        # Compute anomaly score using Isolation Forest
        anomaly_score = iso_forest.decision_function([features])[0]  # Higher = more normal

        # Append anomaly score as a feature
        features_with_anomaly = np.concatenate([features, [anomaly_score]])

        # Predict fraud probability using XGBoost
        fraud_prob = xgb_model.predict_proba([features_with_anomaly])[:, 1][0]

        # Define a threshold (adjustable)
        threshold = 0.4
        fraud_prediction = int(fraud_prob >= threshold)

        return {
            "fraud_prediction": fraud_prediction,
            "confidence_score": round(fraud_prob, 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)