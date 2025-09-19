from flask import Flask, jsonify, render_template, request, session
from flask_cors import CORS
from flask_cors import cross_origin
import json
import random
import os
import math
import uuid
import load_case
import bayes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.secret_key = "my_secret_key"

user_cases = {}

@app.before_request
def ensure_session_id():
    """
    Initiates and saves a session if no session_id exists for this session.
    """
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())


DISEASE_TEMPLATES = load_case.load_disease_templates()

@app.route('/api/new_case', methods=['GET'])
def new_case():
    """
    Generates a new case from DISEASE_TEMPLATES and saves it into user_cases with
    key session_id.
    """
    # session_id = session.get('session_id', 'test_user')  # fallback ID
    session_id = 'test_user'
    new_case = load_case.generate_random_case(DISEASE_TEMPLATES)
    user_cases[session_id] = new_case
    case = user_cases[session_id]

    case["probabilities"] = bayes.update(case["probabilities"], bayes.comp_starting_likelihoods(DISEASE_TEMPLATES, case["demographics"], case["symptoms"], case["vitals"]))

    visible = {k: v for k, v in new_case.items() if k != "name"}

    return jsonify(visible)


@app.route('/api/current_case', methods=['GET'])
def get_current_case():
    """
    Gets current session_id and uses it to get current case, which is displayed without disease name.
    Returns 404 error if the case does not exist.
    """
    session_id = 'test_user'
    # session_id = session.get('session_id', 'test_user')  # fallback ID
    case = user_cases.get(session_id)
    if not case:
        return jsonify({"error": "No case generated yet"}), 404

    visible = {k: v for k, v in case.items() if k != "name"}
    return jsonify(visible)


@app.route('/api/order_test', methods=['POST'])
def order_test():
    """
    Gets current session_id and uses it to get current case and disease name.
    Returns 400 error if the case does not exist.

    Takes test name from request and returns 400 error if "test" does not exist.

    Pulls test_data from DISEASE_TEMPLATES and returns 404 error if "test_name" does not exist for the disease.

    Randomly generates test result ("positive" or "negative") based on sensitivity.

    Returns JSON of {"test_name": test_name, "result": ("positive" or "negative")}
    """
    session_id = 'test_user'  # Use same session ID as new_case
    case = user_cases.get(session_id)
    if not case:
        return jsonify({"error": "No case generated"}), 400

    data = request.get_json()
    test_name = data.get("test")
    if not test_name:
        return jsonify({"error": "No test specified"}), 400

    if test_name in case["tests"]:
        return jsonify({"error": "Test already ordered."}), 400

    test_data = None
    hidden_disease = case["name"]
    for d in DISEASE_TEMPLATES:
        if d["name"].lower() == hidden_disease.lower():
            test_data = d["diagnostic_tests"][test_name]

    if not test_data:
        return jsonify({"error": f"Test '{test_name}' not available"}), 404

    if test_data["Binary"]:
        result = "positive" if random.random() < test_data["sensitivity"] else "negative"
    else:
        result = []
        for finding in test_data:
            if finding != "Binary":
                if random.random() < test_data[finding]["sensitivity"]:
                    result.append(finding)
    case["tests"][test_name] = result

    case["probabilities"] = bayes.update(case["probabilities"], bayes.comp_test_likelihood(DISEASE_TEMPLATES, test_name, result))

    return jsonify({
        "test_name": test_name,
        "result": result
    })


@app.route('/submit_diagnosis', methods=['POST'])
@cross_origin()
def submit_diagnosis():
    """
    Gets current session_id and uses it to get the current disease and disease name.
    Returns 400 error if case does not exist.

    Takes guess from data and compares against actual disease name.

    Returns JSON of {"correct": T/F, "submitted": user guess, "feedback": Correct/Incorrect + details}
    """
    session_id = 'test_user'  # Use same session ID as new_case
    current_case = user_cases.get(session_id)
    if not current_case:
        return jsonify({"error": "No case generated"}), 400

    data = request.get_json()
    guess = data.get("diagnosis", "").lower()
    actual = current_case["name"].lower()

    correct = guess == actual
    feedback = "Correct!" if correct else f"Incorrect. The correct answer was '{actual.title()}'."

    return jsonify({
        "correct": correct,
        "submitted": guess,
        "feedback": feedback
    })


@app.route('/api/reset')
def reset_case():
    """
    Removes case associated with current session_id from user_cases.
    """
    session_id = 'test_user'  # Use same session ID as new_case
    user_cases.pop(session_id, None)
    return jsonify({"status": "case cleared"})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5050, debug=True)
