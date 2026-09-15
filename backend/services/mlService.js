const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Executes Python predict.py using Node.js child_process
 * Passes property input JSON payload and parses output stdout JSON.
 */
function predictHousePrice(inputData) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = process.env.PYTHON_PATH || 'python';
    const scriptPath = path.resolve(__dirname, '../../ml-service/predict.py');
    const modelPath = path.resolve(__dirname, '../../ml-service/models/house_price_model.joblib');

    // Verify ML model file exists before spawning python process
    if (!fs.existsSync(modelPath)) {
      return reject(
        new Error('Trained ML model missing. Please run python train.py in ml-service directory.')
      );
    }

    const payloadString = JSON.stringify(inputData);

    // Execute Python script safely using execFile (prevents shell injection)
    execFile(
      pythonExecutable,
      [scriptPath, payloadString],
      {
        timeout: 10000, // 10 seconds timeout safeguard
        maxBuffer: 1024 * 1024 * 5, // 5MB buffer
        windowsHide: true
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error('[ML Service Error]:', stderr || error.message);
          return reject(
            new Error(
              `ML Prediction Execution Failed: ${stderr.trim() || error.message}`
            )
          );
        }

        try {
          const result = JSON.parse(stdout.trim());
          if (!result.success) {
            return reject(new Error(result.error || 'Prediction process failed.'));
          }
          return resolve(result);
        } catch (parseError) {
          console.error('[ML Output Parse Error]: Raw stdout:', stdout);
          return reject(
            new Error(`Failed to parse ML script output. Raw output: ${stdout.trim()}`)
          );
        }
      }
    );
  });
}

/**
 * Reads ML metadata saved during model training
 */
function getModelMetadata() {
  const metaPath = path.resolve(__dirname, '../../ml-service/models/model_meta.json');
  if (!fs.existsSync(metaPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(metaPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading model metadata:', err.message);
    return null;
  }
}

module.exports = {
  predictHousePrice,
  getModelMetadata
};
