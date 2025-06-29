from flask import Flask, jsonify, render_template, request, session
import json
import random
import os
import math
import uuid
import load_case
import bayes

app = Flask(__name__)
app.secret_key = "my_secret_key"

user_cases = {}

@app.before_request
def ensure_session_id():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())


DISEASE_TEMPLATES = load_case.load_disease_templates()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/new_case', methods=['GET'])
def new_case():
    session_id = session['session_id']
    new_case = load_case.generate_random_case(DISEASE_TEMPLATES)
    user_cases[session_id] = new_case
    # visible = {k: v for k, v in new_case.items() if k != "disease"}

    # print("New case generated for session:", session['session_id'])
    # print("Assigned disease:", new_case["disease"])

    # return jsonify(visible)

    print(f"[NEW CASE] session_id: {session_id}, disease: {new_case['disease']}")
    print("Backend generated disease:", new_case["disease"])  # Confirm backend logic

    return jsonify(new_case)

@app.route('/api/current_case', methods=['GET'])
def get_current_case():
    session_id = session['session_id']
    case = user_cases.get(session_id)
    if not case:
        return jsonify({"error": "No case generated yet"}), 404
    visible = {k: v for k, v in case.items() if k != "disease"}
    return jsonify(visible)

@app.route("/api/bayesian_update_demographics", methods=["POST"])
def bayesian_update_demographics():
    session_id = session["session_id"]
    case = user_cases.get(session_id)

    if not case:
        return jsonify({"error": "No case generated yet"}), 404

    data = request.json
    diseases = data.get("diseases")
    demographics = data.get("demographics")

    if not diseases or not demographics:
        return jsonify({"error": "Missing diseases or demographics"})

    return jsonify(bayes.update(case["probabilities"], bayes.compute_likelihoods(diseases, demographics=demographics)))

@app.route('/api/order_test', methods=['POST'])
def order_test():
    session_id = session['session_id']
    current_case = user_cases.get(session_id)
    if not current_case:
        return jsonify({"error": "No case generated"}), 400

    data = request.get_json()
    test_name = data.get("test")

    if not test_name:
        return jsonify({"error": "No test specified"}), 400

    hidden_disease = current_case["disease"]
    disease_template = next(d for d in DISEASE_TEMPLATES if d["disease"].lower() == hidden_disease.lower())
    test_data = disease_template.get("tests", {}).get(test_name)

    if not test_data:
        return jsonify({"error": f"Test '{test_name}' not available"}), 404

    sensitivity = test_data["sensitivity"]
    result_is_positive = random.random() < sensitivity
    result = "positive" if result_is_positive else "negative"

    return jsonify({
        "test": test_name,
        "result": result,
        "used_sensitivity": sensitivity
    })

@app.route('/submit_diagnosis', methods=['POST'])
def submit_diagnosis():
    session_id = session['session_id']
    current_case = user_cases.get(session_id)
    if not current_case:
        return jsonify({"error": "No case generated"}), 400

    data = request.get_json()
    guess = data.get("diagnosis", "").lower()
    actual = current_case["disease"].lower()

    correct = guess == actual
    feedback = "Correct!" if correct else f"Incorrect. The correct answer was '{actual.title()}'."

    # print("Diagnosis submitted for session:", session['session_id'])
    # print("Correct disease is:", current_case["disease"])

    print(f"[SUBMIT] session_id: {session_id}, stored disease: {current_case['disease'] if current_case else 'None'}")



    return jsonify({
        "correct": correct,
        "submitted": guess,
        "feedback": feedback
    })


@app.route('/api/reset')
def reset_case():
    session_id = session['session_id']
    user_cases.pop(session_id, None)
    return jsonify({"status": "case cleared"})

if __name__ == "__main__":
    app.run(debug=True)
