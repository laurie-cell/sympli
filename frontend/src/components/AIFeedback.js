import { useState } from "react";

function AIFeedback({ caseData, diagnosis, isCorrect, onGetFeedback }) {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const getAIFeedback = async () => {
    if (!caseData || !diagnosis) return;

    setIsLoading(true);
    try {
      // Simulate AI feedback for now - in production, would call GPT-4 API
      const mockFeedback = generateMockFeedback(caseData, diagnosis, isCorrect);
      setFeedback(mockFeedback);
      setShowFeedback(true);
      onGetFeedback(mockFeedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockFeedback = (caseData, diagnosis, correct) => {
    const actualDisease = caseData.name || "Unknown";
    const symptoms = Object.entries(caseData.symptoms || {})
      .filter(([, value]) => value)
      .map(([key]) => key.replace(/_/g, ' '));

    const vitals = caseData.vitals || {};

    const probabilities = caseData.probabilities || {};

    if (correct) {
      return {
        overall: "excellent",
        score: 95,
        feedback: [
          "🎯 Excellent diagnostic reasoning! You correctly identified the condition.",
          "✅ Your systematic approach to analyzing symptoms and test results was spot-on.",
          "💡 Consider exploring differential diagnoses to strengthen your clinical thinking.",
          "📚 Review the pathophysiology of this condition to deepen your understanding."
        ],
        biases: [],
        suggestions: [
          "Practice with more complex cases to challenge your diagnostic skills",
          "Study the latest treatment guidelines for this condition",
          "Consider the patient's demographics in your diagnostic approach"
        ]
      };
    } else {
      return {
        overall: "needs_improvement",
        score: 65,
        feedback: [
          `❌ Incorrect diagnosis. The actual condition was ${actualDisease}.`,
          "🔍 Let's analyze what went wrong in your diagnostic process.",
          "📊 Review the probability calculations and test results more carefully.",
          "🧠 Consider common cognitive biases that may have influenced your decision."
        ],
        biases: [
          "Anchoring bias: You may have focused too early on one diagnosis",
          "Availability heuristic: Recent cases might have influenced your thinking",
          "Confirmation bias: You may have interpreted evidence to support your initial hypothesis"
        ],
        suggestions: [
          "Practice systematic differential diagnosis approach",
          "Review the key symptoms and their probabilities for each condition",
          "Consider the patient's age, sex, and demographics in your analysis",
          "Study the sensitivity and specificity of diagnostic tests"
        ]
      };
    }
  };

  return (
    <div className="medical-card">
      <h3>AI Medical Tutor</h3>

      {!showFeedback && (
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Get personalized feedback on your diagnostic reasoning and cognitive biases
          </p>
          <button
            className="medical-btn"
            onClick={getAIFeedback}
            disabled={!caseData || !diagnosis || isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Analyzing...' : 'Get AI Feedback'}
          </button>
        </div>
      )}

      {showFeedback && feedback && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: 0, color: 'var(--accent-blue)' }}>
              Performance Analysis
            </h4>
            <div style={{
              background: feedback.overall === 'excellent' ? 'var(--success-color)' : 'var(--warning-color)',
              color: 'var(--primary-bg)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: '600'
            }}>
              Score: {feedback.score}%
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Feedback
            </h5>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              {feedback.feedback.map((item, index) => (
                <div key={index} style={{
                  background: 'var(--tertiary-bg)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--card-border)',
                  fontSize: '0.7rem',
                  color: 'var(--text-primary)'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {feedback.biases.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Cognitive Biases Detected
              </h5>
              <div style={{ display: 'grid', gap: '0.25rem' }}>
                {feedback.biases.map((bias, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 68, 68, 0.1)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--error-color)',
                    fontSize: '0.7rem',
                    color: 'var(--text-primary)'
                  }}>
                    ⚠️ {bias}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Study Suggestions
            </h5>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--accent-cyan)',
                  fontSize: '0.7rem',
                  color: 'var(--text-primary)'
                }}>
                  💡 {suggestion}
                </div>
              ))}
            </div>
          </div>

          <button
            className="medical-btn medical-btn-secondary"
            onClick={() => setShowFeedback(false)}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            New Analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default AIFeedback;
