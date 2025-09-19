import { useState } from "react";

function DiagnosisForm({ probabilities, onSubmit }) {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDiagnosis) {
            onSubmit(selectedDiagnosis)
        }
    };

    return (
        <div className="medical-card">
            <h3>Final Diagnosis</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={selectedDiagnosis}
                        onChange={(e) => setSelectedDiagnosis(e.target.value)}
                        style={{ flex: '1', minWidth: '200px', fontSize: '0.8rem' }}
                    >
                        <option value="">Select diagnosis</option>
                        {Object.keys(probabilities || {})
                            .sort((a, b) => (probabilities[b] || 0) - (probabilities[a] || 0))
                            .map((disease) => (
                            <option key={disease} value={disease}>
                                {disease} ({(probabilities[disease] * 100).toFixed(1)}%)
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="medical-btn medical-btn-success"
                        disabled={!selectedDiagnosis}
                        style={{ minWidth: '100px', fontSize: '0.7rem' }}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DiagnosisForm;
