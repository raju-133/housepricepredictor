import React, { useEffect, useState } from 'react';
import { getPredictionHistory, deletePrediction } from '../services/api';
import { History as HistoryIcon, Trash2, Search, Filter, RefreshCw } from 'lucide-react';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getPredictionHistory({
        search,
        location: locationFilter
      });
      if (response.data.success) {
        setPredictions(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [locationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction record?')) return;
    try {
      await deletePrediction(id);
      setPredictions(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert('Error deleting prediction record.');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HistoryIcon color="#06B6D4" size={28} />
            Prediction History
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Historical house price estimation logs stored in MongoDB.
          </p>
        </div>

        <button className="btn-secondary" onClick={fetchHistory} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} />
          Refresh Log
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <button type="submit" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} />
            Filter
          </button>
        </form>
      </div>

      {/* History Table */}
      <div className="glass-card table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            Loading prediction logs from MongoDB...
          </div>
        ) : predictions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No prediction records found. Try predicting a house price on the Home page!
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Area (sq.ft)</th>
                <th>BHK</th>
                <th>Baths</th>
                <th>Floors</th>
                <th>Parking</th>
                <th>Year</th>
                <th>Predicted Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.location}</td>
                  <td>{item.area}</td>
                  <td>{item.bedrooms} BHK</td>
                  <td>{item.bathrooms}</td>
                  <td>{item.floors}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      background: item.parking === 'Yes' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: item.parking === 'Yes' ? 'var(--accent-emerald)' : '#F87171'
                    }}>
                      {item.parking}
                    </span>
                  </td>
                  <td>{item.yearBuilt}</td>
                  <td style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    {item.formattedPrice || `₹${item.predictedPrice.toLocaleString('en-IN')}`}
                  </td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(item._id)}
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
