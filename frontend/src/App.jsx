import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const response = await fetch(`${API_URL}/api/scan/history`);

      if (!response.ok) {
        throw new Error("Failed to load scan history");
      }

      const data = await response.json();

      setHistory(data.scans || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleScan(event) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setResult(data);

      await loadHistory();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>SentinelScan</h1>
          <p>Web Security Assessment Platform</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Scanner Online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">WEB SECURITY SCANNER</p>

          <h2>Assess a website's security posture.</h2>

          <p className="hero-description">
            Analyze transport security, HTTP security headers and common
            security misconfigurations.
          </p>

          <form className="scan-form" onSubmit={handleScan}>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Scanning..." : "Scan Website"}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
        </section>

        {loading && (
          <section className="loading-card">
            <div className="loader"></div>

            <div>
              <h3>Security assessment in progress</h3>
              <p>Analyzing the target's exposed security configuration...</p>
            </div>
          </section>
        )}

        {result && <ScanResults result={result} />}

        <ScanHistory history={history} />
      </main>
    </div>
  );
}

function ScanResults({ result }) {
  const { assessment, scan, findings, target } = result;

  return (
    <section className="results">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ASSESSMENT RESULTS</p>
          <h2>{target}</h2>
        </div>

        <span className={`risk-badge ${assessment.riskLevel.toLowerCase()}`}>
          {assessment.riskLevel} Risk
        </span>
      </div>

      <div className="summary-grid">
        <div className="score-card">
          <p>Security Score</p>

          <div className="score">
            {assessment.score}
            <span>/100</span>
          </div>
        </div>

        <StatCard
          title="Total Findings"
          value={assessment.totalFindings}
        />

        <StatCard
          title="Response Time"
          value={`${scan.reachability.responseTime} ms`}
        />

        <StatCard
          title="HTTP Status"
          value={scan.reachability.statusCode}
        />
      </div>

      <div className="severity-grid">
        <SeverityCard
          label="Critical"
          value={assessment.severityCounts.Critical}
        />

        <SeverityCard
          label="High"
          value={assessment.severityCounts.High}
        />

        <SeverityCard
          label="Medium"
          value={assessment.severityCounts.Medium}
        />

        <SeverityCard
          label="Low"
          value={assessment.severityCounts.Low}
        />
      </div>

      <SecurityChecks scan={scan} />

      <div className="findings-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SECURITY FINDINGS</p>
            <h2>Identified Issues</h2>
          </div>
        </div>

        {findings.length === 0 ? (
          <div className="empty-state">
            No security findings were identified by the current scan checks.
          </div>
        ) : (
          <div className="findings-list">
            {findings.map((finding, index) => (
              <FindingCard
                key={`${finding.name}-${index}`}
                finding={finding}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}

function SeverityCard({ label, value }) {
  return (
    <div className="severity-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SecurityChecks({ scan }) {
  const checks = [
    {
      label: "HTTPS Available",
      passed: scan.https.httpsAvailable,
    },
    {
      label: "HTTP Redirects to HTTPS",
      passed: scan.https.httpRedirectsToHttps,
    },
    {
      label: "Content Security Policy",
      passed: scan.headers.contentSecurityPolicy.present,
    },
    {
      label: "HSTS",
      passed: scan.headers.strictTransportSecurity.present,
    },
    {
      label: "X-Frame-Options",
      passed: scan.headers.xFrameOptions.present,
    },
    {
      label: "X-Content-Type-Options",
      passed: scan.headers.xContentTypeOptions.present,
    },
    {
      label: "Referrer-Policy",
      passed: scan.headers.referrerPolicy.present,
    },
    {
      label: "Permissions-Policy",
      passed: scan.headers.permissionsPolicy.present,
    },
  ];

  return (
    <div className="checks-section">
      <p className="eyebrow">SECURITY CONTROLS</p>
      <h2>Configuration Checks</h2>

      <div className="checks-grid">
        {checks.map((check) => (
          <div className="check-item" key={check.label}>
            <span
              className={
                check.passed ? "check-icon passed" : "check-icon failed"
              }
            >
              {check.passed ? "✓" : "×"}
            </span>

            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindingCard({ finding }) {
  return (
    <article className="finding-card">
      <div className="finding-header">
        <div>
          <span className="finding-category">
            {finding.category || "Security"}
          </span>

          <h3>{finding.name}</h3>
        </div>

        <span className={`severity ${finding.severity.toLowerCase()}`}>
          {finding.severity}
        </span>
      </div>

      <div className="finding-content">
        <div>
          <h4>Description</h4>
          <p>{finding.description}</p>
        </div>

        <div>
          <h4>Recommendation</h4>
          <p>{finding.recommendation}</p>
        </div>
      </div>
    </article>
  );
}

function ScanHistory({ history }) {
  return (
    <section className="history-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SCAN HISTORY</p>
          <h2>Recent Assessments</h2>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          No previous security scans.
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Target</th>
                <th>Score</th>
                <th>Risk</th>
                <th>Findings</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((scan) => (
                <tr key={scan.id}>
                  <td>{scan.target_url}</td>
                  <td>{scan.score}/100</td>
                  <td>
                    <span
                      className={`risk-badge ${scan.risk_level.toLowerCase()}`}
                    >
                      {scan.risk_level}
                    </span>
                  </td>
                  <td>{scan.total_findings}</td>
                  <td>{scan.status_code}</td>
                  <td>
                    {new Date(scan.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default App;