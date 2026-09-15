const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [50, 'Area must be at least 50 sq.ft']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Bedrooms count is required'],
      min: [1, 'At least 1 bedroom required']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Bathrooms count is required'],
      min: [1, 'At least 1 bathroom required']
    },
    floors: {
      type: Number,
      required: [true, 'Floors count is required'],
      min: [1, 'At least 1 floor required']
    },
    parking: {
      type: String,
      required: [true, 'Parking status is required'],
      enum: ['Yes', 'No']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    yearBuilt: {
      type: Number,
      required: [true, 'Year built is required'],
      min: [1900, 'Year built must be after 1900'],
      max: [2026, 'Year built cannot be in the future']
    },
    predictedPrice: {
      type: Number,
      required: true
    },
    formattedPrice: {
      type: String,
      required: true
    },
    modelName: {
      type: String,
      default: 'Gradient Boosting Regressor'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);
