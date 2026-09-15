const mongoose = require('mongoose');
const { getModelMetadata } = require('../services/mlService');

exports.getHealthStatus = (req, res) => {
  const meta = getModelMetadata();
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  return res.status(200).json({
    status: 'UP',
    system: 'House Price Predictor API',
    timestamp: new Date(),
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      connected: dbState === 1
    },
    mlModel: {
      available: !!meta,
      modelName: meta ? meta.best_model_name : 'Not Trained',
      r2Score: meta ? meta.metrics?.R2 : null
    }
  });
};
