from fastapi import FastAPI, HTTPException
import pandas as pd
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn
import os

MODEL_PATH = os.environ.get("MODEL_PATH", "./model.pkl")


app = FastAPI(title="Housing Price Predictor API")

class PredictRequest(BaseModel):
    state: str
    income: float
    mortgage_type: str


# Output schema
class PredictResponse(BaseModel):
    predicted_mean: float
    lower_bound: float
    upper_bound: float
    units: str = "USD"


# Load model on startup
@app.on_event("startup")

def load_model():
    global model, encoder
    try:
        data = joblib.load(MODEL_PATH)
    # Accept either a single object (model) or a dict with extras
    if isinstance(data, dict):
        model = data.get("model")
        encoder = data.get("encoder")
    else:
        model = data
        encoder = None
        print("Model loaded from", MODEL_PATH)
    except Exception as e:(
        print("Warning: could not load model:", e))
        model = None
        encoder = None


@app.post("/predict", response_model=PredictResponse)

def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on server")
        # Build feature array in the same order your training used
        # Example order: [income, mortgage_encoded..., state_encoded...] - adapt to your model
        try:
            df = pd.DataFrame([{
                "income": float(req.income),
                "mortgage_type": req.mortgage_type,
                "state": req.state
            }])
        # If your model expects raw features (not a DataFrame), adapt here
        pred = model.predict(df)
        # If model.predict returns a single value or an array
        mean_pred = float(np.asarray(pred).ravel()[0])
        # Provide a simple +/- band for range (e.g., 10%) or if model supports quantiles, use them
        lower = mean_pred * 0.9
        upper = mean_pred * 1.1
        return PredictResponse(predicted_mean=round(mean_pred, 2), lower_bound=round(lower, 2),
                               upper_bound=round(upper, 2))
        except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
uvicorn.run(app, host="0.0.0.0", port=8000)