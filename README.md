# House Price Predictor System

A complete, production-grade full-stack **House Price Prediction System** built with **React, Vite, Node.js, Express, MongoDB Atlas, and Python Scikit-Learn**. 

Designed as a final-year B.Tech portfolio project that demonstrates a real-world property estimation platform powered by Machine Learning regression models.

---

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["React Frontend (Vite)"]
        UI[User Input Form] -->|1. Submit Payload| Axios[Axios API Client]
        ResultCard[Display Result & Charts] <--|10. Render Price & History| Axios
    end

    subgraph Backend["Node.js + Express Backend"]
        Axios -->|2. POST /api/predict| Express[Express Server]
        Express -->|3. Validate Input| Val[Validation Middleware]
        Val -->|4. Spawn Child Process| CP[Node child_process]
        CP -->|7. Receive Stdout JSON| Express
        Express -->|8. Save Prediction| Mongo[(MongoDB Atlas)]
        Express -->|9. Send HTTP JSON Response| Axios
    end

    subgraph MLService["Python ML Pipeline"]
        CP -->|5. Pass Args / Stdin| PyScript[predict.py]
        ModelArtifacts[house_price_model.joblib] -->|Load Trained Pipeline| PyScript
        PyScript -->|6. Feature Transform & Predict| ModelOutput[Output Clean JSON to Stdout]
    end
```

---

## Features

- **Interactive Property Valuation**: Real-time property price estimation based on area (sq.ft), bedrooms, bathrooms, floors, parking, location, and property age.
- **Trained Machine Learning Pipeline**: Scikit-Learn regression pipeline trained on 1,500 property records with **R² > 0.99**.
- **Child-Process Micro-Integration**: Direct process-level communication between Node.js and Python (`child_process.execFile`) avoiding web server overhead.
- **MongoDB Atlas Persistence**: Automatically logs prediction history with instant CRUD operations.
- **Analytical Dashboard**: Dynamic visual analytics powered by Recharts (Price vs Area scatter plots, location price distribution, trend timelines).
- **Comprehensive Model Benchmarks**: Displays comparison of Linear Regression, Random Forest, and Gradient Boosting Regressor metrics ($R^2$, MAE, RMSE).
- **Responsive UI**: Dark slate/navy theme with glassmorphism cards and smooth animations.

---

## Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript | Component-based UI layer |
| **Styling** | Vanilla CSS, Glassmorphism | Custom design tokens & animations |
| **Charts & Icons** | Recharts, Lucide React | Visual analytics & UI icons |
| **HTTP Client** | Axios | REST API communication |
| **Backend** | Node.js, Express.js | API routing, validation & process execution |
| **Inter-Process** | Node `child_process.execFile` | Executing Python prediction script via stdout |
| **Database** | MongoDB Atlas, Mongoose | Storing historical predictions |
| **Machine Learning** | Python 3.12, Scikit-Learn | Regression modeling & feature engineering |
| **Serialization** | Joblib | Model artifact save/load pipeline |

---

## Machine Learning Architecture

The ML pipeline inside `ml-service/` operates as follows:

1. **Dataset Generation**: 1,500 property records generated across major Indian metropolitan cities (*Hyderabad, Bangalore, Mumbai, Delhi, Pune, Chennai*).
2. **Preprocessing & Feature Engineering**:
   - `property_age` = $2026 - \text{yearBuilt}$
   - `total_rooms` = $\text{bedrooms} + \text{bathrooms}$
3. **Encoding & Scaling**:
   - Numerical features standardized using `StandardScaler`.
   - Categorical features (`location`, `parking`) encoded using `OneHotEncoder(handle_unknown='ignore')`.
4. **Model Comparison**:
   - **Linear Regression**: Baseline model ($R^2 \approx 0.9406$).
   - **Random Forest Regressor**: Tree ensemble ($R^2 \approx 0.9884$).
   - **Gradient Boosting Regressor**: Winning model ($R^2 \approx 0.9902$).
5. **Artifact Saving**: Winning model exported as a Scikit-Learn `Pipeline` to `models/house_price_model.joblib`.

---

## Project Structure

```
house-price-predictor/
├── ml-service/
│   ├── dataset/
│   │   ├── generate_dataset.py
│   │   └── house_prices.csv
│   ├── models/
│   │   ├── house_price_model.joblib
│   │   └── model_meta.json
│   ├── train.py
│   ├── predict.py
│   ├── requirements.txt
│   └── README.md
├── backend/
│   ├── controllers/
│   │   ├── predictionController.js
│   │   └── healthController.js
│   ├── models/
│   │   └── Prediction.js
│   ├── routes/
│   │   ├── predictionRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   └── mlService.js
│   ├── utils/
│   │   └── validation.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AboutModel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas account (or local MongoDB server)

---

### Step 1: Machine Learning Setup

```bash
cd ml-service

# Install Python packages
pip install -r requirements.txt

# Generate dataset
python dataset/generate_dataset.py

# Train & compare regression models
python train.py
```

Expected Output:
```
[4/6] Best Performing Model: >>> Gradient Boosting Regressor <<< (R2 = 0.9902)
[5/6] Saved best model pipeline to: ml-service/models/house_price_model.joblib
```

---

### Step 2: Backend Setup

```bash
cd ../backend

# Install Node dependencies
npm install

# Configure environment variables in .env
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/housepricedb
# PORT=5000

# Start Express Server
npm start
```

Backend will output:
```
Connecting to MongoDB Atlas...
Successfully connected to MongoDB Atlas database!
Express server running on http://localhost:5000
```

---

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite React Dev Server
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## API Endpoints

### 1. Generate Prediction
- **`POST /api/predict`**
- **Request Body**:
  ```json
  {
    "area": 1800,
    "bedrooms": 3,
    "bathrooms": 2,
    "floors": 2,
    "parking": "Yes",
    "location": "Hyderabad",
    "yearBuilt": 2020
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Property price prediction generated successfully",
    "data": {
      "id": "6aa94a2816b38dd9b4e3ff26",
      "predictedPrice": 13345000,
      "formattedPrice": "₹1.33 Cr",
      "modelName": "Gradient Boosting Regressor",
      "inputData": { ... },
      "createdAt": "2026-09-15T13:37:44.337Z"
    }
  }
  ```

### 2. Fetch Prediction History
- **`GET /api/predictions?location=Hyderabad`**

### 3. Delete Prediction Log
- **`DELETE /api/predictions/:id`**

### 4. Health Check & Model Info
- **`GET /api/health`**
- **`GET /api/model-info`**

---

## Resume Description

**House Price Prediction System | Full-Stack ML Web Application**
- Engineered an end-to-end real-estate price prediction platform leveraging **React (Vite)**, **Node.js (Express)**, **MongoDB Atlas**, and **Scikit-Learn**.
- Architected direct inter-process execution via **Node `child_process.execFile`**, communicating with a Python ML script using standard I/O streams (`stdout` JSON parsing) without web server overhead (no Flask/FastAPI).
- Built a Scikit-Learn machine learning pipeline comparing Linear Regression, Random Forest, and Gradient Boosting Regressor models, achieving an $R^2$ score of **0.9902** and exporting serialized `.joblib` pipelines.
- Implemented real-time history logging in MongoDB Atlas, input validation, and dynamic visualization dashboards using **Recharts**.

---

## Top 10 Technical Interview Questions & Answers

### Q1: Why did you choose Node `child_process` execution over a Python framework like Flask or FastAPI?
**Answer**: Using `child_process.execFile` allows Node.js to directly trigger Python execution at the OS process level without running a persistent secondary HTTP web server. This eliminates additional port management, network latency, memory usage, and CORS complexity. Node handles Web/API routing and database persistence while Python operates as a lightweight dedicated computational engine.

### Q2: How do you prevent Command Injection security vulnerabilities when spawning Python from Node.js?
**Answer**: We use `child_process.execFile` (or `spawn`) rather than `exec`. `execFile` passes arguments directly as an array of discrete process parameters to the OS executable without spawning a system shell (`cmd.exe` or `sh`), preventing shell injection attacks even if untrusted input is passed. Additionally, input data is strictly validated and sanitized before passing.

### Q3: How does the Python ML pipeline handle categorical features like property location?
**Answer**: Categorical features (`location` and `parking`) are processed using Scikit-Learn's `OneHotEncoder(handle_unknown='ignore')` wrapped inside a `ColumnTransformer`. This converts string values into binary indicator columns during both model training and inference.

### Q4: Why did you save a Scikit-Learn `Pipeline` object instead of just the trained model?
**Answer**: Saving the complete `Pipeline` (which includes `ColumnTransformer`, `StandardScaler`, `OneHotEncoder`, and the `GradientBoostingRegressor`) using `joblib` ensures that inference data receives the exact same preprocessing, scaling, and feature encoding transformations applied during training, preventing data leakage and feature mismatch errors.

### Q5: How do you ensure debug prints or Python warnings do not break Node's JSON parser?
**Answer**: In `predict.py`, warnings are suppressed (`warnings.filterwarnings('ignore')`), logging is isolated, and only the final result is written to `sys.stdout` as a valid JSON string using `sys.stdout.write(json.dumps(response))`.

### Q6: What metrics were used to compare model performance?
**Answer**: We evaluated MAE (Mean Absolute Error), MSE (Mean Squared Error), RMSE (Root Mean Squared Error), and $R^2$ (Coefficient of Determination). $R^2$ measures how well the regression model explains variance in property prices, while RMSE penalizes larger prediction deviations in Indian Rupees.

### Q7: What happens if the MongoDB database goes offline?
**Answer**: The backend implements graceful degradation. If MongoDB connection fails, the API captures the error, processes the Python ML prediction normally, and returns the result to the user with a DB fallback notification.

### Q8: How is state managed in the React frontend?
**Answer**: Component-level state (`useState`) handles form inputs, validation error alerts, prediction results, and loading indicators. Communication with the backend Express API is encapsulated cleanly within an `api.js` service module using `axios`.

### Q9: What feature engineering techniques were performed on the raw dataset?
**Answer**: We derived two key features: `property_age` calculated from the current year ($2026 - \text{yearBuilt}$) to capture building depreciation, and `total_rooms` ($\text{bedrooms} + \text{bathrooms}$) to represent total indoor spatial utility.

### Q10: How would you scale this system for high-concurrency production traffic?
**Answer**: Under high concurrency, spawning a new Python process per request can create CPU overhead. To scale:
1. Pool worker Python processes or utilize a background job queue (e.g., Redis + BullMQ).
2. Cache predictions for identical query parameters using Redis.
3. If throughput requirements exceed child-process limits, migrate prediction inference to a dedicated C++ or ONNX Runtime model executor.
