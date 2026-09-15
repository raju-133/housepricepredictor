const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getAllPredictions,
  getPredictionById,
  deletePrediction,
  getModelInfo
} = require('../controllers/predictionController');

router.post('/predict', createPrediction);
router.get('/predictions', getAllPredictions);
router.get('/predictions/:id', getPredictionById);
router.delete('/predictions/:id', deletePrediction);
router.get('/model-info', getModelInfo);

module.exports = router;
