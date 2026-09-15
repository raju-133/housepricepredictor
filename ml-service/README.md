# ML Service - House Price Predictor

Python-based Machine Learning pipeline for residential real-estate price regression modeling.

## Directory Structure

```
ml-service/
├── dataset/
│   ├── generate_dataset.py  # Dataset generator script
│   └── house_prices.csv     # 1,500 property records dataset
├── models/
│   ├── house_price_model.joblib # Saved trained model pipeline
│   └── model_meta.json          # Metrics, features, and model metadata
├── train.py                 # Data preprocessing, training & benchmark script
├── predict.py               # Child-process friendly JSON prediction endpoint
└── requirements.txt         # Python dependencies
```

## ML Architecture & Models Evaluated

1. **Linear Regression** (Baseline model)
2. **Random Forest Regressor** (Ensemble tree model)
3. **Gradient Boosting Regressor** (Best performing model, $R^2 > 0.99$)

## Metrics Tracked

- **MAE** (Mean Absolute Error)
- **MSE** (Mean Squared Error)
- **RMSE** (Root Mean Squared Error)
- **$R^2$ Score** (Coefficient of Determination)

## Usage Commands

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Train Model Pipeline
```bash
python train.py
```

### Run Prediction Script
```bash
python predict.py "{\"area\":1500,\"bedrooms\":3,\"bathrooms\":2,\"floors\":1,\"parking\":\"Yes\",\"location\":\"Hyderabad\",\"yearBuilt\":2018}"
```
