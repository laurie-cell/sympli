import { Table } from "react-bootstrap";

function CaseDisplay({ caseData }) {
    if (!caseData) return null;

    const formatKey = (key) => key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    return(
        <div>

            <h2 className="mb-3">Case Details</h2>

            <h4>Vitals</h4>
            <Table striped bordered hover size="sm">
                <tbody>
                    {Object.entries(caseData.vitals || {}).map(([key, value]) => (
                        <tr key={key}>
                            <td>{formatKey(key)}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4>Symptoms</h4>
            <Table striped bordered hover size="sm">
                <tbody>
                    {Object.entries(caseData.symptoms || {}).map(([MediaEncryptedEvent, value]) => (
                        <tr key={key}>
                            <td>{formatKey(key)}</td>
                            <td>{value ? "Present" : "Absent"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4>Probabilities</h4>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Disease</th>
                        <th>Likelihood</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(caseData.probabilities || {}).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{(value * 100).toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>
    )
}
