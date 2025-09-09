import { useState } from "react";
import ActionButton from "./components/ActionButton";
import CaseDisplay from "./components/CaseDisplay";
import DiagnosisForm from "./components/DiagnosisForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import "./App.css"

function App() {
  const [currentCase, setCurrentCase] = useState(null);
  const [log, setLog] = useState([]);

  const callBackend = async (endpoint, onSuccess, method="GET", body=null) => {
    try {
      const res = await fetch(`http://127.0.0.1:5050/api/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body? JSON.stringify(body) : null,
      });
      const data = await res.json();
      onSuccess(data);
    } catch (err) {
      console.error("❌ Failed to fetch:", err);
      setLog((prev) => [...prev, "❌ Failed to fetch"]);
    }
  };

  return (
    <div class="container">

      <h1 style={{ marginTop: "20px", textAlign: "center" }}>Medical Simulator</h1>

      <Row className="mb-3 justify-content-center">
        <Col xs="auto">
          <ActionButton
            label="New Case"
            onClick={() =>
              callBackend("new_case", (data) => {
                setCurrentCase(data);
                setLog((prev) => [...prev, "New case loaded."]);
              })
            }
          />
        </Col>
      </Row>

      <Col xs="auto">
          <ActionButton
            label="Current Case"
            onClick={() =>
              callBackend("current_case", (data) => {
                setCurrentCase(data);
                setLog((prev) => [...prev, "Current case fetched."]);
              })
            }
            variant = "secondary"
          />
      </Col>

      <CaseDisplay caseData={currentCase} />

      <Row className="mt-4">
        <Col>
            <h4>Action Log</h4>
            <div
              id="logContainer"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {log.map((entry, index) => (
                <Alert key={index} variant="info">
                  {entry}
                </Alert>
              ))}
            </div>
        </Col>
      </Row>

      {currentCase && (
        <DiagnosisForm
          probabilities={currentCase.probabilities}
          onSubmit={(diagnosis) =>
            callBackend(`submit_diagnosis/${encodeURIComponent(diagnosis)}`, (data) => {
              setLog((prev) => [...prev, `Submitted diagnosis: ${diagnosis}`, JSON.stringify(data, null, 2)]);
            },
          "POST")
          }
        />
      )}

    </div>
  );
}

export default App;
