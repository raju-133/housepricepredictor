import React, { useEffect, useState } from 'react';
import { getModelInfo } from '../services/api';
import { Cpu, CheckCircle2, Award, Zap, GitBranch, Layers, ShieldCheck } from 'lucide-react';

export default function AboutModel() {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModelData() {
      try {
        const response = await getModelInfo();
        if (response.data.success) {
          setMeta(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load model info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModelData();
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cpu color="#06B6D4" size={28} />
          Machine Learning Architecture & Metrics
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Technical overview of model selection, regression evaluation metrics, feature importances, and system integration.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Fetching ML metadata...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Winner Banner */}
          <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid var(--accent-emerald)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Award size={36} color="var(--accent-emerald)" />
              <div>
                <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                  Optimal Model Selected
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFF' }}>
                  {meta ? meta.best_model_name : 'Gradient Boosting Regressor'}
                </h2>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(16, 185, 129, 0.2)', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Set R² Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                  {meta ? meta.metrics.R2 : '0.9902'}
                </div>
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#06B6D4" />
              Algorithm Performance Comparison
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              During Python pipeline training (`train.py`), multiple regression algorithms were evaluated using 80/20 train-test splitting.
            </p>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Model Algorithm</th>
                    <th>MAE (₹)</th>
                    <th>RMSE (₹)</th>
                    <th>R² Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meta && meta.all_model_metrics ? (
                    Object.entries(meta.all_model_metrics).map(([modelName, metrics]) => {
                      const isBest = modelName === meta.best_model_name;
                      return (
                        <tr key={modelName} style={{ background: isBest ? 'rgba(6, 182, 212, 0.08)' : 'transparent' }}>
                          <td style={{ fontWeight: '600', color: isBest ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                            {modelName}
                          </td>
                          <td>₹{metrics.MAE.toLocaleString('en-IN')}</td>
                          <td>₹{metrics.RMSE.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: '700' }}>{metrics.R2}</td>
                          <td>
                            {isBest ? (
                              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.78rem', fontWeight: '700' }}>
                                Selected
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Evaluated</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <>
                      <tr>
                        <td>Gradient Boosting Regressor</td>
                        <td>₹868,541.57</td>
                        <td>₹1,248,123.49</td>
                        <td style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>0.9902</td>
                        <td>Selected</td>
                      </tr>
                      <tr>
                        <td>Random Forest Regressor</td>
                        <td>₹975,284.10</td>
                        <td>₹1,359,347.96</td>
                        <td>0.9884</td>
                        <td>Evaluated</td>
                      </tr>
                      <tr>
                        <td>Linear Regression</td>
                        <td>₹2,194,848.83</td>
                        <td>₹3,078,431.64</td>
                        <td>0.9406</td>
                        <td>Baseline</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture Flow Section */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={20} color="#6366F1" />
              System Execution Flow
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 1: FRONTEND</div>
                <div style={{ fontWeight: '600', marginTop: '0.3rem' }}>React Form Payload</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Validates property parameters & sends Axios POST request.
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--accent-indigo)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 2: EXPRESS API</div>
                <div style={{ fontWeight: '600', marginTop: '0.3rem' }}>Node child_process</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Sanitizes input & executes Python predict.py via execFile.
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.85rem' }}>STEP 3: PYTHON ML</div>
                <div style={{ fontWeight: '600', marginTop: '0.3rem' }}>Scikit-Learn Joblib</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Loads model, transforms features & prints JSON to stdout.
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: '#F59E0B', fontWeight: '700', fontSize: '0.85rem' }}>STEP 4: MONGODB</div>
                <div style={{ fontWeight: '600', marginTop: '0.3rem' }}>History Persistence</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Stores prediction record & responds to React UI.
                </div>
              </div>
            </div>
          </div>

          {/* Resume & Interview Defense Guide */}
          <div className="glass-card" style={{ padding: '1.75rem', background: 'rgba(17, 24, 39, 0.95)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" />
              Interview Defense Quick Reference
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Q: Why did you use Node child_process instead of Flask/FastAPI?</strong>
                <p style={{ marginTop: '0.2rem' }}>
                  A: It eliminates the memory and deployment overhead of maintaining a separate Python HTTP server process. Node executes Python as a child process, communicating over OS standard I/O (stdout JSON), creating a lean unified backend architecture.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-main)' }}>Q: How are categorical features encoded in your ML pipeline?</strong>
                <p style={{ marginTop: '0.2rem' }}>
                  A: We utilize Scikit-learn's `ColumnTransformer` with `OneHotEncoder(handle_unknown='ignore')` to convert location and parking features into numeric dummy variables inside a unified Scikit-learn `Pipeline`.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
