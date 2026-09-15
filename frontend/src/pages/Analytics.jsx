import React, { useEffect, useState } from 'react';
import { getPredictionHistory } from '../services/api';
import { BarChart2, DollarSign, Home, MapPin, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getPredictionHistory({ limit: 100 });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Metrics & Aggregation
  const totalCount = data.length;
  const avgPrice = totalCount > 0
    ? Math.round(data.reduce((acc, curr) => acc + curr.predictedPrice, 0) / totalCount)
    : 0;

  // Location Averages for Bar Chart
  const locationMap = {};
  data.forEach((item) => {
    if (!locationMap[item.location]) {
      locationMap[item.location] = { location: item.location, totalPrice: 0, count: 0 };
    }
    locationMap[item.location].totalPrice += item.predictedPrice;
    locationMap[item.location].count += 1;
  });

  const locationChartData = Object.values(locationMap).map((loc) => ({
    location: loc.location,
    avgPriceLakhs: Number((loc.totalPrice / loc.count / 100000).toFixed(2))
  }));

  // Scatter Data (Area vs Price)
  const scatterData = data.map((item) => ({
    area: item.area,
    priceLakhs: Number((item.predictedPrice / 100000).toFixed(2)),
    location: item.location
  }));

  // Trend Data over Time
  const trendData = [...data]
    .reverse()
    .map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      priceLakhs: Number((item.predictedPrice / 100000).toFixed(2))
    }));

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart2 color="#06B6D4" size={28} />
          Prediction Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Visual insights and real-estate market trend analytics derived from prediction queries.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon">
            <Home size={24} />
          </div>
          <div>
            <div className="metric-val">{totalCount}</div>
            <div className="metric-title">Total Predictions Logged</div>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-val">
              {avgPrice >= 10000000
                ? `₹${(avgPrice / 10000000).toFixed(2)} Cr`
                : `₹${(avgPrice / 100000).toFixed(2)} Lakhs`}
            </div>
            <div className="metric-title">Average Estimated Price</div>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-indigo)' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="metric-val" style={{ fontSize: '1.25rem' }}>
              {locationChartData.length > 0
                ? locationChartData.sort((a, b) => b.avgPriceLakhs - a.avgPriceLakhs)[0].location
                : 'N/A'}
            </div>
            <div className="metric-title">Highest Valued City</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Generating analytics charts...
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No prediction data available yet for visual analytics. Please perform some property price predictions on the Home page first!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Chart 1: Average Price by Location */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#06B6D4" />
              Average Price by Location (₹ Lakhs)
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="location" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" unit=" L" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  <Bar dataKey="avgPriceLakhs" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Price vs Area Scatter */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#10B981" />
              Property Area (sq.ft) vs Predicted Price (₹ Lakhs)
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" dataKey="area" name="Area" unit=" sqft" stroke="#9CA3AF" />
                  <YAxis type="number" dataKey="priceLakhs" name="Price" unit=" L" stroke="#9CA3AF" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  <Scatter name="Properties" data={scatterData} fill="#10B981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: History Price Timeline */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} color="#6366F1" />
              Historical Prediction Price Trend Timeline
            </h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" unit=" L" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                  <Area type="monotone" dataKey="priceLakhs" stroke="#6366F1" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
