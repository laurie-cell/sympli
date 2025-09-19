import { useState } from "react";

function TestOrdering({ caseData, onTestOrdered }) {
  const [selectedTest, setSelectedTest] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const availableTests = [
    "Abdominal_Ultrasound",
    "CT_Scan",
    "MRI",
    "WBC_Count",
    "CRP",
    "Hyponatremia"
  ];

  const formatText = (text) => {
    return text
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleOrderTest = async () => {
    if (!selectedTest) return;

    setIsOrdering(true);
    try {
      const response = await fetch('http://127.0.0.1:5050/api/order_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: selectedTest }),
      });

      const data = await response.json();

      if (response.ok) {
        onTestOrdered(data);
        setSelectedTest("");
      } else {
        console.error('Error ordering test:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to order test:', error);
      alert('Failed to order test. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const formatTestName = (testName) => {
    return testName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTestResult = (result) => {
    if (typeof result === 'string') {
      return result.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (Array.isArray(result)) {
      return result.length > 0
        ? result.map((r) => formatText(r)).join(', ')
        : 'No findings';
    }
    return 'No result';
  };

  const getTestResultClass = (result) => {
    if (typeof result === 'string') {
      return result.toLowerCase() === 'positive' ? 'positive' : 'negative';
    }
    if (Array.isArray(result)) {
      return result.length > 0 ? 'positive' : 'negative';
    }
    return '';
  };

  return (
    <div className="medical-card">
      <h3>Diagnostic Tests</h3>

      {/* Test Ordering */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h4>Order Test</h4>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            style={{ flex: '1', minWidth: '150px', fontSize: '0.8rem' }}
          >
            <option value="">Select test</option>
            {availableTests.map((test) => (
              <option key={test} value={test}>
                {formatTestName(test)}
              </option>
            ))}
          </select>
          <button
            className="medical-btn"
            onClick={handleOrderTest}
            disabled={!selectedTest || isOrdering}
            style={{ minWidth: '80px', fontSize: '0.7rem' }}
          >
            {isOrdering ? 'Ordering...' : 'Order'}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {caseData?.tests && Object.keys(caseData.tests).length > 0 && (
        <div>
          <h4>Test Results</h4>
          <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.7rem' }}>
            {Object.entries(caseData.tests).map(([testName, result], index) => (
              <div key={testName} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--tertiary-bg)',
                padding: '0.25rem',
                borderRadius: '3px',
                border: '1px solid var(--card-border)',
                borderLeft: `3px solid ${getTestResultClass(result) === 'positive' ? 'var(--success-color)' : 'var(--error-color)'}`
              }}>
                <span style={{
                  minWidth: '20px',
                  color: 'var(--accent-blue)',
                  fontSize: '0.6rem',
                  fontWeight: '600'
                }}>
                  #{index + 1}
                </span>
                <span style={{
                  minWidth: '100px',
                  color: 'var(--text-primary)',
                  fontSize: '0.7rem'
                }}>
                  {formatTestName(testName)}
                </span>
                <span style={{
                  minWidth: '30px',
                  fontSize: '0.6rem',
                  fontWeight: '600',
                  color: getTestResultClass(result) === 'positive' ? 'var(--success-color)' : 'var(--error-color)',
                  textAlign: 'center'
                }}>
                  {getTestResultClass(result) === 'positive' ? 'POS' : 'NEG'}
                </span>
                <span style={{
                  flex: 1,
                  color: 'var(--text-secondary)',
                  fontSize: '0.65rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {formatTestResult(result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!caseData?.tests || Object.keys(caseData.tests).length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          fontSize: '0.7rem'
        }}>
          No tests ordered yet.
        </div>
      )}
    </div>
  );
}

export default TestOrdering;
