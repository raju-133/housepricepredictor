import React, { useState } from 'react';
import { predictPrice } from '../services/api';
import { Calculator, CheckCircle, AlertTriangle, RefreshCw, MapPin, Building, Calendar, Layers, Car, Maximize2 } from 'lucide-react';

const CITIES = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'];

export default function Home() {
  const [formData, setFormData] = useState({
    area: 1500,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    parking: 'Yes',
    location: 'Hyderabad',
    yearBuilt: 2018
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form Client Validation
    if (formData.area <= 0) {
      setError('Area must be a positive number.');
      return;
    }
    if (formData.yearBuilt < 1900 || formData.yearBuilt > 2026) {
      setError('Please enter a valid year built between 1900 and 2026.');
      return;
    }

    setLoading(true);

    try {
      const response = await predictPrice({
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floors: Number(formData.floors),
        parking: formData.parking,
        location: formData.location,
        yearBuilt: Number(formData.yearBuilt)
      });

      if (response.data.success) {
        setPredictionResult(response.data.data);
      } else {
        setError(response.data.message || 'Failed to generate prediction.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || 'Error connecting to backend ML service.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="hero-title">
          House Price <span>Predictor</span>
        </h1>
        <p className="hero-subtitle">
          Estimate real-estate market valuation using trained machine learning regression pipelines.
        </p>
      </div>

      {!predictionResult ? (
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Calculator color="#06B6D4" size={24} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Property Details</h2>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: '1.5rem' }}>

              {/* Area */}
              <div className="form-group">
                <label className="form-label">
                  <Maximize2 size={16} color="#06B6D4" />
                  Area (sq.ft)
                </label>
                <input
                  type="number"
                  name="area"
                  className="form-input"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  min="100"
                  max="50000"
                  required
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} color="#06B6D4" />
                  Location / City
                </label>
                <select
                  name="location"
                  className="form-select"
                  value={formData.location}
                  onChange={handleChange}
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="form-group">
                <label className="form-label">
                  <Building size={16} color="#06B6D4" />
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  className="form-input"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              {/* Bathrooms */}
              <div className="form-group">
                <label className="form-label">
                  <Building size={16} color="#06B6D4" />
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-input"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              {/* Floors */}
              <div className="form-group">
                <label className="form-label">
                  <Layers size={16} color="#06B6D4" />
                  Total Floors
                </label>
                <input
                  type="number"
                  name="floors"
                  className="form-input"
                  value={formData.floors}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                />
              </div>

              {/* Year Built */}
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} color="#06B6D4" />
                  Year Built
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="form-input"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1950"
                  max="2026"
                  required
                />
              </div>

              {/* Parking */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">
                  <Car size={16} color="#06B6D4" />
                  Parking Available
                </label>
                <div className="btn-toggle-group">
                  <button
                    type="button"
                    className={`btn-toggle ${formData.parking === 'Yes' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, parking: 'Yes' }))}
                  >
                    Yes (Dedicated Parking)
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle ${formData.parking === 'No' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, parking: 'No' }))}
                  >
                    No (Street Parking)
                  </button>
                </div>
              </div>

            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  Executing ML Model...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Predict House Price
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Result UI Card */
        <div className="glass-card result-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.88rem', fontWeight: '600', marginBottom: '1rem' }}>
            <CheckCircle size={18} />
            Prediction Completed
          </div>

          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estimated Property Value
          </h3>

          <div className="result-price">
            {predictionResult.formattedPrice}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Exact Estimate: <strong>₹{predictionResult.predictedPrice.toLocaleString('en-IN')}</strong>
          </p>

          <div className="summary-grid">
            <div className="summary-item">
              <div className="label">Location</div>
              <div className="value">{predictionResult.inputData.location}</div>
            </div>
            <div className="summary-item">
              <div className="label">Area</div>
              <div className="value">{predictionResult.inputData.area} sq.ft</div>
            </div>
            <div className="summary-item">
              <div className="label">Bedrooms</div>
              <div className="value">{predictionResult.inputData.bedrooms} BHK</div>
            </div>
            <div className="summary-item">
              <div className="label">Bathrooms</div>
              <div className="value">{predictionResult.inputData.bathrooms}</div>
            </div>
            <div className="summary-item">
              <div className="label">Floors</div>
              <div className="value">{predictionResult.inputData.floors}</div>
            </div>
            <div className="summary-item">
              <div className="label">Parking</div>
              <div className="value">{predictionResult.inputData.parking}</div>
            </div>
            <div className="summary-item">
              <div className="label">Year Built</div>
              <div className="value">{predictionResult.inputData.yearBuilt}</div>
            </div>
            <div className="summary-item">
              <div className="label">ML Model</div>
              <div className="value" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                {predictionResult.modelName}
              </div>
            </div>
          </div>

          <div className="disclaimer-box">
            <strong>Disclaimer:</strong> This price estimation is generated by an algorithmic Machine Learning regression model trained on historical regional data. It serves as an analytical estimation and does not constitute a legal property valuation.
          </div>

          <button className="btn-primary" onClick={handleReset} style={{ maxWidth: '300px', margin: '0 auto' }}>
            <RefreshCw size={18} />
            Predict Another Property
          </button>
        </div>
      )}
    </div>
  );
}
