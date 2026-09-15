import os
import sys
import json
import warnings

# Suppress sklearn/pandas warnings from stdout
warnings.filterwarnings("ignore")
os.environ["PYTHONWARNINGS"] = "ignore"

# Ensure UTF-8 stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def format_indian_currency(amount):
    """Format numeric amount into human readable Indian currency string (Crores/Lakhs/Thousands)"""
    val = float(amount)
    if val >= 10000000:
        return f"₹{val / 10000000:.2f} Cr"
    elif val >= 100000:
        return f"₹{val / 100000:.2f} Lakhs"
    else:
        return f"₹{val:,.0f}"

def main():
    try:
        # Load input JSON from command-line argument or stdin
        if len(sys.argv) > 1:
            raw_input = sys.argv[1]
        else:
            raw_input = sys.stdin.read()

        if not raw_input or not raw_input.strip():
            raise ValueError("No input payload provided to predict.py")

        data = json.loads(raw_input)

        # Validate required input fields
        required_fields = ["area", "bedrooms", "bathrooms", "floors", "parking", "location", "yearBuilt"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Parse numeric & categorical values
        area = float(data["area"])
        bedrooms = int(data["bedrooms"])
        bathrooms = int(data["bathrooms"])
        floors = int(data["floors"])
        parking = str(data["parking"])
        location = str(data["location"])
        yearBuilt = int(data["yearBuilt"])

        # Feature engineering matching training logic
        current_year = 2026
        property_age = current_year - yearBuilt
        total_rooms = bedrooms + bathrooms

        # Prepare DataFrame input
        import pandas as pd
        import joblib

        input_df = pd.DataFrame([{
            "area": area,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "floors": floors,
            "parking": parking,
            "location": location,
            "yearBuilt": yearBuilt,
            "property_age": property_age,
            "total_rooms": total_rooms
        }])

        # Load trained joblib model pipeline
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "house_price_model.joblib")
        meta_path = os.path.join(base_dir, "models", "model_meta.json")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}. Please run train.py first.")

        model_pipeline = joblib.load(model_path)
        
        # Load metadata if available
        model_name = "Gradient Boosting Regressor"
        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
                model_name = meta.get("best_model_name", model_name)

        # Predict price
        raw_pred = model_pipeline.predict(input_df)[0]
        predicted_price = max(500000, round(float(raw_pred), -3)) # Round to nearest thousand

        response = {
            "success": True,
            "predictedPrice": int(predicted_price),
            "formattedPrice": format_indian_currency(predicted_price),
            "modelName": model_name,
            "inputData": {
                "area": area,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "floors": floors,
                "parking": parking,
                "location": location,
                "yearBuilt": yearBuilt
            }
        }

        # Print ONLY JSON to stdout
        sys.stdout.write(json.dumps(response))
        sys.stdout.flush()

    except Exception as e:
        error_response = {
            "success": False,
            "error": str(e)
        }
        sys.stdout.write(json.dumps(error_response))
        sys.stdout.flush()
        sys.exit(1)

if __name__ == "__main__":
    main()
