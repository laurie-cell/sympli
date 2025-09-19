import { useState } from "react";
import ActionButton from "./components/ActionButton";
import CaseDisplay from "./components/CaseDisplay";
import DiagnosisForm from "./components/DiagnosisForm";
import TestOrdering from "./components/TestOrdering";
import AIFeedback from "./components/AIFeedback";
import "./App.css"

function App() {
  const [currentCase, setCurrentCase] = useState(null);
  const [lastDiagnosis, setLastDiagnosis] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const callBackend = async (endpoint, onSuccess, method="GET", body=null) => {
    try {
      const res = await fetch(`http://127.0.0.1:5050/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body? JSON.stringify(body) : null,
      });
      const data = await res.json();
      onSuccess(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  const handleTestOrdered = (testResult) => {
    callBackend("api/current_case", (data) => {
      setCurrentCase(data);
    });
  };

  return (
    <div className="medical-container">
      <div className="medical-header">
        <h1>Sympli</h1>
        <p>Advanced AI-powered tool for Bayesian medical case analysis</p>
      </div>

      <div className="left-panel">
        <div className="medical-card">
          <h3>Control Panel</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ActionButton
              label="New Case"
              onClick={() =>
                callBackend("api/new_case", (data) => {
                  setCurrentCase(data);
                  setLastDiagnosis(null);
                  setDiagnosisResult(null);
                })
              }
            />
            <ActionButton
              label="Load Case"
              onClick={() =>
                callBackend("api/current_case", (data) => {
                  setCurrentCase(data);
                })
              }
              variant="secondary"
            />
          </div>
        </div>

        {currentCase && (
          <CaseDisplay caseData={currentCase} />
        )}
      </div>

      <div className="center-panel">
        {currentCase && (
          <TestOrdering
            caseData={currentCase}
            onTestOrdered={handleTestOrdered}
          />
        )}
      </div>

      <div className="right-panel">
        {currentCase && (
          <>
            <DiagnosisForm
              probabilities={currentCase.probabilities}
              onSubmit={(diagnosis) =>
                callBackend("submit_diagnosis", (data) => {
                  setLastDiagnosis(diagnosis);
                  setDiagnosisResult(data);
                  console.log(`Diagnosis: ${diagnosis} - ${data.feedback}`);
                }, "POST", { diagnosis })
              }
            />

            {lastDiagnosis && diagnosisResult && (
              <>
                <div className="medical-card">
                  <h3>Diagnosis Result</h3>
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `2px solid ${diagnosisResult.correct ? 'var(--success-color)' : 'var(--error-color)'}`,
                    background: diagnosisResult.correct ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: diagnosisResult.correct ? 'var(--success-color)' : 'var(--error-color)',
                      marginBottom: '0.25rem'
                    }}>
                      {diagnosisResult.correct ? '✅ CORRECT' : '❌ INCORRECT'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      Your diagnosis: <strong>{lastDiagnosis}</strong>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {diagnosisResult.feedback}
                    </div>
                  </div>
                </div>

                <AIFeedback
                  caseData={currentCase}
                  diagnosis={lastDiagnosis}
                  isCorrect={diagnosisResult.correct}
                  onGetFeedback={(feedback) => console.log('AI Feedback:', feedback)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
