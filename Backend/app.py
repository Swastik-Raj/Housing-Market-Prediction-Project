from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn
import os
print("BACKEND FILE LOADED")
app = FastAPI(title="Housing Price Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("CORS MIDDLEWARE ATTACHED")

MODEL_PATH = os.environ.get("MODEL_PATH", "./model.pkl")

class PredictRequest(BaseModel):
    state: str
    income: float
    mortgage_type: str


class PredictResponse(BaseModel):
    predicted_mean: float
    lower_bound: float
    upper_bound: float
    units: str = "USD"


@app.on_event("startup")
def load_model():
    global model, encoder
    try:
        data = joblib.load(MODEL_PATH)

        # Accept either a single object or a dict
        if isinstance(data, dict):
            model = data.get("model")
            encoder = data.get("encoder")
        else:
            model = data
            encoder = None

        print("Model loaded from", MODEL_PATH)

    except Exception as e:
        print("Warning: could not load model:", e)
        model = None
        encoder = None


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on server")

    try:
        df = pd.DataFrame([{
            "income": float(req.income),
            "mortgage_type": req.mortgage_type,
            "state": req.state
        }])

        pred = model.predict(df)
        mean_pred = float(np.asarray(pred).ravel()[0])

        lower = mean_pred * 0.9
        upper = mean_pred * 1.1

        return PredictResponse(
            predicted_mean=round(mean_pred, 2),
            lower_bound=round(lower, 2),
            upper_bound=round(upper, 2)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
