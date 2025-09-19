function CaseDisplay({ caseData }) {
    if (!caseData) return null;

    const formatKey = (key) => key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    const formatValue = (value) => {
        if (typeof value === "string") {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };

    return(
        <div className="medical-card">
            <h2>Patient Data</h2>

            {/* Demographics */}
            {caseData.demographics && (
                <div style={{ marginBottom: '0.5rem' }}>
                    <h4>Demographics</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', fontSize: '0.7rem' }}>
                        {Object.entries(caseData.demographics).map(([key, value]) => (
                            <div key={key} style={{
                                background: 'var(--tertiary-bg)',
                                padding: '0.25rem',
                                borderRadius: '3px',
                                border: '1px solid var(--card-border)'
                            }}>
                                <div style={{ color: 'var(--accent-blue)', fontSize: '0.6rem' }}>{formatKey(key)}</div>
                                <div style={{ color: 'var(--text-primary)' }}>{typeof value === 'object' ? JSON.stringify(value) : formatValue(value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Vitals and symptoms in a grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                    <h4>Vitals</h4>
                    <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.7rem' }}>
                        {Object.entries(caseData.vitals || {}).map(([key, value]) => (
                            <div key={key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: 'var(--tertiary-bg)',
                                padding: '0.25rem',
                                borderRadius: '3px',
                                border: '1px solid var(--card-border)'
                            }}>
                                <span style={{ color: 'var(--accent-blue)' }}>{formatKey(key)}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4>Symptoms</h4>
                    <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.7rem' }}>
                        {Object.entries(caseData.symptoms || {}).map(([key, value]) =>
                            value? (
                                <div key={key} style={{
                                    background: 'var(--tertiary-bg)',
                                    padding: '0.25rem',
                                    borderRadius: '3px',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--text-primary)'
                                }}>
                                    {formatKey(key)}
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>

            {/* Probabilities */}
            <div>
                <h4>Probabilities</h4>
                <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.7rem' }}>
                    {Object.entries(caseData.probabilities || {})
                        .sort(([,a], [,b]) => b - a)
                        .map(([key, value]) => (
                        <div key={key} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'var(--tertiary-bg)',
                            padding: '0.25rem',
                            borderRadius: '3px',
                            border: '1px solid var(--card-border)'
                        }}>
                            <span style={{ minWidth: '80px', color: 'var(--text-primary)' }}>{key}</span>
                            <span style={{ minWidth: '35px', color: 'var(--accent-blue)' }}>{(value * 100).toFixed(1)}%</span>
                            <div className="probability-bar" style={{ flex: 1, height: '3px' }}>
                                <div
                                    className="probability-fill"
                                    style={{ width: `${value * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CaseDisplay;
