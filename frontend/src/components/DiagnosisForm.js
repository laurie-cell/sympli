import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

function DiagnosisForm({ probabilities, onSubmit }) {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDiagnosis) {
            onSubmit(selectedDiagnosis)
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-4">
            <Row className="align-items-center">
                <Col xs="auto">
                    <Form.Select
                        value={selectedDiagnosis}
                        onChange={(e) => setSelectedDiagnosis(e.target.value)}
                    >
                        <option value="">Select a diagnosis</option>
                        {Object.keys(probabilities || {}).map((disease) => (
                            <option key={disease} value={disease}>
                                {disease}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                <Col xs="auto">
                    <Button type="submit" variant="success" disabled={!selectedDiagnosis}>Submit Diagnosis</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default DiagnosisForm;
