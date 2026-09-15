/**
 * Backend Input Validation Helper
 */
function validatePredictionInput(body) {
  const errors = [];

  const { area, bedrooms, bathrooms, floors, parking, location, yearBuilt } = body;

  // Validate Area
  const areaNum = Number(area);
  if (isNaN(areaNum) || areaNum <= 0) {
    errors.push('Area must be a positive number in square feet.');
  } else if (areaNum > 50000) {
    errors.push('Area cannot exceed 50,000 sq.ft.');
  }

  // Validate Bedrooms
  const bedNum = Number(bedrooms);
  if (!Number.isInteger(bedNum) || bedNum < 1 || bedNum > 20) {
    errors.push('Bedrooms must be a valid integer between 1 and 20.');
  }

  // Validate Bathrooms
  const bathNum = Number(bathrooms);
  if (!Number.isInteger(bathNum) || bathNum < 1 || bathNum > 15) {
    errors.push('Bathrooms must be a valid integer between 1 and 15.');
  }

  // Validate Floors
  const floorNum = Number(floors);
  if (!Number.isInteger(floorNum) || floorNum < 1 || floorNum > 50) {
    errors.push('Floors must be a valid integer between 1 and 50.');
  }

  // Validate Parking
  if (!parking || !['Yes', 'No'].includes(String(parking).trim())) {
    errors.push("Parking must be either 'Yes' or 'No'.");
  }

  // Validate Location
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required and must be a valid city/area name.');
  }

  // Validate Year Built
  const currentYear = 2026;
  const yearNum = Number(yearBuilt);
  if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > currentYear) {
    errors.push(`Year built must be a valid year between 1900 and ${currentYear}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      area: areaNum,
      bedrooms: bedNum,
      bathrooms: bathNum,
      floors: floorNum,
      parking: String(parking).trim(),
      location: String(location).trim(),
      yearBuilt: yearNum
    }
  };
}

module.exports = {
  validatePredictionInput
};
