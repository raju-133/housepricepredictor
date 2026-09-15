import pandas as pd
import numpy as np
import os

def generate_house_price_dataset(filename="house_prices.csv", num_samples=1500, seed=42):
    np.random.seed(seed)
    
    locations = ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Pune", "Chennai"]
    location_base_sqft_rates = {
        "Mumbai": 14000,
        "Delhi": 9500,
        "Bangalore": 8500,
        "Hyderabad": 7200,
        "Pune": 6500,
        "Chennai": 6000
    }
    
    areas = np.random.randint(500, 4800, size=num_samples)
    bedrooms = np.array([min(5, max(1, int(a / 700 + np.random.choice([-1, 0, 1])))) for a in areas])
    bathrooms = np.array([min(bedrooms[i], max(1, int(bedrooms[i] - np.random.choice([0, 1])))) for i in range(num_samples)])
    floors = np.random.randint(1, 16, size=num_samples)
    parkings = np.random.choice(["Yes", "No"], size=num_samples, p=[0.75, 0.25])
    locs = np.random.choice(locations, size=num_samples, p=[0.25, 0.20, 0.20, 0.15, 0.10, 0.10])
    years_built = np.random.randint(1995, 2025, size=num_samples)
    
    current_year = 2026
    prices = []
    
    for i in range(num_samples):
        base_rate = location_base_sqft_rates[locs[i]]
        area_component = areas[i] * base_rate
        bedroom_bonus = bedrooms[i] * 250000
        bathroom_bonus = bathrooms[i] * 180000
        floor_bonus = floors[i] * 40000
        parking_bonus = 350000 if parkings[i] == "Yes" else 0
        
        age = current_year - years_built[i]
        age_depreciation_factor = max(0.70, 1.0 - (age * 0.008))
        
        raw_price = (area_component + bedroom_bonus + bathroom_bonus + floor_bonus + parking_bonus) * age_depreciation_factor
        
        # Add controlled realistic noise (+/- 5%)
        noise = np.random.normal(0, 0.04)
        final_price = int(raw_price * (1.0 + noise))
        prices.append(round(final_price, -3)) # Round to nearest thousand
        
    df = pd.DataFrame({
        "area": areas,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "floors": floors,
        "parking": parkings,
        "location": locs,
        "yearBuilt": years_built,
        "price": prices
    })
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(output_dir, filename)
    df.to_csv(file_path, index=False)
    print(f"Dataset successfully created with {len(df)} records at {file_path}")
    print("\nDataset Summary:")
    print(df.describe())
    print("\nSample Data:")
    print(df.head())

if __name__ == "__main__":
    generate_house_price_dataset()
