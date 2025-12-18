# Housing Market Prediction Project

> **Personal / Demo Project**  
> This is a personal, non-commercial project created for learning and portfolio purposes.  
> It does **not** use proprietary, client, or confidential data and should not be considered financial or real estate advice.

---

## Overview

The **Housing Market Prediction Project** is a full-stack machine learning web application that predicts a **housing price range** based on basic property characteristics such as:

- U.S. state
- Number of bedrooms
- Square footage

The project demonstrates the **end-to-end machine learning workflow**, from data preprocessing and model training to backend deployment and frontend integration.

---

## Project Objectives

- Build a complete ML pipeline from training to inference
- Serve a trained ML model through a REST API
- Connect a frontend UI to a backend ML service
- Gain hands-on experience with real-world ML deployment challenges

---

### Machine Learning
- Python
- scikit-learn
- pandas, numpy
- joblib

### Backend
- FastAPI
- Pydantic
- Uvicorn

### Frontend
- React (Vite)
- JavaScript
- Tailwind CSS (basic styling)

### Tools
- Google Colab (model training)
- Git & GitHub
- Node.js / npm
- Python virtual environments

---

## Model Training

Model training is performed in **Google Colab** using publicly available housing datasets.

### Training Workflow
- Data cleaning and preprocessing
- Feature selection
- Model pipeline creation using scikit-learn
- Model evaluation
- Model export using `joblib`

The trained model file (`model.pkl`) is **not committed to GitHub** in order to:
- Avoid large file size limitations
- Ensure reproducibility across environments
- Follow standard machine learning best practices

### Retraining the Model
1. Open `Training Notebook/housing_model_training.ipynb`
2. Run all cells
3. Export the model as `model.pkl`
4. Place the file in: `Backend/model.pkl`

## Run Backend Locally

```bash
cd Backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```
## Run Frontend Locally
```bash
cd Frontend
npm install
npm run dev
```

