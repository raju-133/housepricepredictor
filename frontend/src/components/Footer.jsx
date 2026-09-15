import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      marginTop: '4rem',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }}>
      <p style={{ marginBottom: '0.5rem' }}>
        <strong>House Price Predictor</strong> &mdash; Production ML Regression Architecture
      </p>
      <p style={{ color: 'var(--text-dim)' }}>
        React &bull; Node.js &bull; Express &bull; Python Scikit-Learn &bull; MongoDB Atlas
      </p>
    </footer>
  );
}
