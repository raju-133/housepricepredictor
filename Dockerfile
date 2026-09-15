# Production Dockerfile for House Price Predictor Backend + Python ML
FROM node:20-slim

# Install Python 3 and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy ML Service and install Python dependencies
COPY ml-service /app/ml-service
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install --no-cache-dir -r /app/ml-service/requirements.txt

# Ensure ML model is trained inside container
RUN cd /app/ml-service && python3 dataset/generate_dataset.py && python3 train.py

# Copy Backend package files & install Node dependencies
COPY backend/package*.json /app/backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy remaining Backend source files
COPY backend /app/backend

# Environment configuration
ENV PORT=5000
ENV PYTHON_PATH="/app/venv/bin/python3"
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
