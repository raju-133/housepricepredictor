import os
import json
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Ensure stdout handles UTF-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def train_and_evaluate():
    print("=" * 60)
    print("       HOUSE PRICE PREDICTION - MODEL TRAINING PIPELINE")
    print("=" * 60)
    
    # 1. Load dataset
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "dataset", "house_prices.csv")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset file not found at: {dataset_path}")
        
    df = pd.read_csv(dataset_path)
    print(f"\n[1/6] Loaded dataset with {df.shape[0]} rows and {df.shape[1]} columns.")
    
    # 2. Inspect and Handle Missing Values
    null_counts = df.isnull().sum().sum()
    if null_counts > 0:
        print(f"--> Found {null_counts} missing values. Dropping null rows...")
        df.dropna(inplace=True)
    else:
        print("--> Data cleanliness check passed: No missing values found.")
        
    # 3. Feature Engineering
    current_year = 2026
    df["property_age"] = current_year - df["yearBuilt"]
    df["total_rooms"] = df["bedrooms"] + df["bathrooms"]
    print("--> Feature engineering completed: Created 'property_age' and 'total_rooms'.")
    
    # 4. Separate Features & Target
    X = df.drop(columns=["price"])
    y = df["price"]
    
    numeric_features = ["area", "bedrooms", "bathrooms", "floors", "yearBuilt", "property_age", "total_rooms"]
    categorical_features = ["location", "parking"]
    
    # 5. Build Preprocessor Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )
    
    # 6. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"\n[2/6] Split data into Training set ({len(X_train)}) and Test set ({len(X_test)}).")
    
    # 7. Model Definitions
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    }
    
    results = {}
    fitted_pipelines = {}
    
    print("\n[3/6] Training and evaluating regression models...")
    print("-" * 75)
    print(f"{'Model Name':<30} | {'MAE (INR)':<12} | {'RMSE (INR)':<12} | {'R2 Score':<10}")
    print("-" * 75)
    
    best_model_name = None
    best_r2 = -float("inf")
    best_pipeline = None
    
    for name, model in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])
        
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        results[name] = {
            "MAE": round(mae, 2),
            "MSE": round(mse, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4)
        }
        fitted_pipelines[name] = pipeline
        
        print(f"{name:<30} | {mae:<12,.2f} | {rmse:<12,.2f} | {r2:<10.4f}")
        
        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_pipeline = pipeline
            
    print("-" * 75)
    print(f"\n[4/6] Best Performing Model: >>> {best_model_name} <<< (R2 = {best_r2:.4f})")
    
    # 8. Save Model & Meta Artifacts
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "house_price_model.joblib")
    joblib.dump(best_pipeline, model_path)
    print(f"[5/6] Saved best model pipeline to: {model_path}")
    
    # Extract Feature Importances if available
    feature_importances = {}
    regressor = best_pipeline.named_steps["regressor"]
    
    # Get encoded feature names
    cat_encoder = best_pipeline.named_steps["preprocessor"].named_transformers_["cat"]
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_features).tolist()
    all_feature_names = numeric_features + encoded_cat_names
    
    if hasattr(regressor, "feature_importances_"):
        importances = regressor.feature_importances_
        for feat, imp in sorted(zip(all_feature_names, importances), key=lambda x: x[1], reverse=True):
            feature_importances[feat] = round(float(imp), 4)
            
    meta_info = {
        "best_model_name": best_model_name,
        "metrics": results[best_model_name],
        "all_model_metrics": results,
        "feature_names": all_feature_names,
        "feature_importances": feature_importances,
        "trained_date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_samples": len(df)
    }
    
    meta_path = os.path.join(models_dir, "model_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_info, f, indent=2)
    print(f"[6/6] Saved metadata to: {meta_path}")
    print("\nTraining completed successfully!\n")

if __name__ == "__main__":
    train_and_evaluate()
