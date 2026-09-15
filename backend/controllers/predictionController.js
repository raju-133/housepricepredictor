const Prediction = require('../models/Prediction');
const { validatePredictionInput } = require('../utils/validation');
const { predictHousePrice, getModelMetadata } = require('../services/mlService');

/**
 * Handles POST /api/predict
 * Validates input -> calls Python ML process -> saves to MongoDB -> returns JSON
 */
exports.createPrediction = async (req, res) => {
  try {
    const { isValid, errors, sanitized } = validatePredictionInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Call ML prediction service (Child Process -> Python -> Stdout)
    const mlResult = await predictHousePrice(sanitized);

    // Save prediction record to MongoDB
    let savedPrediction = null;
    try {
      savedPrediction = await Prediction.create({
        ...sanitized,
        predictedPrice: mlResult.predictedPrice,
        formattedPrice: mlResult.formattedPrice,
        modelName: mlResult.modelName || 'Gradient Boosting Regressor'
      });
    } catch (dbError) {
      console.warn('[MongoDB Save Warning]: Could not persist prediction to database:', dbError.message);
      // Even if DB fails, return prediction result to user with warning flag
    }

    return res.status(201).json({
      success: true,
      message: 'Property price prediction generated successfully',
      data: {
        id: savedPrediction ? savedPrediction._id : null,
        predictedPrice: mlResult.predictedPrice,
        formattedPrice: mlResult.formattedPrice,
        modelName: mlResult.modelName,
        inputData: sanitized,
        createdAt: savedPrediction ? savedPrediction.createdAt : new Date()
      }
    });

  } catch (error) {
    console.error('[Prediction Controller Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while generating house price prediction.'
    });
  }
};

/**
 * Handles GET /api/predictions
 * Retrieves historical predictions with optional search & location filters
 */
exports.getAllPredictions = async (req, res) => {
  try {
    const { location, search, limit = 50 } = req.query;
    const query = {};

    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (search && search.trim()) {
      query.$or = [
        { location: { $regex: search.trim(), $options: 'i' } },
        { modelName: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const totalCount = await Prediction.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: predictions.length,
      totalCount,
      data: predictions
    });
  } catch (error) {
    console.error('[Get Predictions Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve prediction history.'
    });
  }
};

/**
 * Handles GET /api/predictions/:id
 */
exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Invalid prediction ID format or server error.'
    });
  }
};

/**
 * Handles DELETE /api/predictions/:id
 */
exports.deletePrediction = async (req, res) => {
  try {
    const deleted = await Prediction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Prediction history record deleted successfully.',
      id: req.params.id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete prediction record.'
    });
  }
};

/**
 * Handles GET /api/model-info
 * Returns ML metrics and feature importances
 */
exports.getModelInfo = async (req, res) => {
  try {
    const meta = getModelMetadata();
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Model metadata not found. Please train the model.'
      });
    }
    return res.status(200).json({
      success: true,
      data: meta
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve model info.'
    });
  }
};
