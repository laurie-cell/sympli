import { useState } from "react";
import ActionButton from "./components/ActionButton";
import CaseDisplay from "./components/CaseDisplay";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Table, Alert } from "react-bootstrap";

function App() {
  const [currentCase, setCurrentCase] = useState(null);
  const [log, setLog] = useState([]);

  const callBackend = async (endpoint, onSuccess) => {
    try {
      const res = await fetch(`http://127.0.0.1:5050/api/${endpoint}`);
      const data = await res.json();
      // console.log("✅ Response from backend:", data); // For debugging
      // setLog((prev) => [...prev, JSON.stringify(data, null, 2)]); // Pretty print JSON
      onSuccess(data);
    } catch (err) {
      console.error("❌ Failed to fetch:", err);
      setLog((prev) => [...prev, "❌ Failed to fetch"]);
    }
  };

  return (
    <Container>

      <h1 className="mb-4 text-center">Medical Simulator</h1>

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
            {log.map((entry) => (
              <Alert key={index} variant="info">
                {entry}
              </Alert>
            ))}
        </Col>
      </Row>

    </Container>
  );
}

export default App;
