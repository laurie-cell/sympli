import json
import random
import os
import math

def load_disease_templates(folder="digestive diseases"):
    """
    Returns list of disease templates from given folder.

    Params:
        folder (dir): folder with JSON disease templates.

    Returns:
        templates (list): list of disease templates (dict)
    """
    templates = []
    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            with open(os.path.join(folder, filename), 'r') as f:
                templates.append(json.load(f))
    return templates


def generate_random_case(templates):
    """
    Randomly selects case from templates based on priors in population, generates
    demographics, symptoms, and vitals from probabilities in the case template. Case
    also includes "tests" with empty dict.

    Params:
        templates (list): list of disease templates (dict)

    Returns:
        case (dict): {"name", "probabilities", "demographics", "symptoms", "vitals", "tests"}
    """
    # Build dictionary mapping disease name to template
    template_map = {d["name"]: d for d in templates}

    # Recalculate normalized priors
    probs = {d["name"]: d["prior"] for d in templates}
    total = sum(probs.values())
    probs = {k: v / total for k, v in probs.items()}

    # Use random.choices to pick a disease using priors
    disease_name = random.choices(
        population=list(probs.keys()),
        weights=list(probs.values()),
        k=1
    )[0]

    disease_template = template_map[disease_name]

    # Probabilities
    probs = {}
    for d in templates:
        probs[d["name"]] = d["prior"]

    total = sum(probs.values())
    probs = {p : probs[p]/total for p in probs}
    probs = dict(sorted(probs.items()))

    # Demographics
    age = int(random.gauss(disease_template["demographics"]["age"]["mean"], disease_template["demographics"]["age"]["std"]))
    if age < 0:
        age = 0

    sex = random.choices(
        population=list(disease_template["demographics"]["sex_distribution"].keys()),
        weights=list(disease_template["demographics"]["sex_distribution"].values())
    )[0]

    race = random.choices(
        population=list(disease_template["demographics"]["race_distribution"].keys()),
        weights=list(disease_template["demographics"]["race_distribution"].values())
    )[0]

    # Symptoms
    symptoms = {}
    for symptom, info in disease_template["symptoms"].items():
        symptoms[symptom] = random.random() < info["probability"]  # True with given probability

    # Vitals
    vitals_template = disease_template["vitals"]
    vitals = {
        "body_temperature": int(random.gauss(vitals_template["body_temperature"]["mean"], vitals_template["body_temperature"]["std"])),
        "pulse": int(random.gauss(vitals_template["pulse"]["mean"], vitals_template["pulse"]["std"])),
        "respiratory_rate": int(random.gauss(vitals_template["respiratory_rate"]["mean"], vitals_template["respiratory_rate"]["std"])),
        "blood_pressure_systolic": int(random.gauss(vitals_template["blood_pressure_systolic"]["mean"], vitals_template["blood_pressure_systolic"]["std"])),
        "blood_pressure_diastolic": int(random.gauss(vitals_template["blood_pressure_diastolic"]["mean"], vitals_template["blood_pressure_diastolic"]["std"]))
    }

    return {
        "name": disease_template["name"],
        "probabilities": probs,
        "demographics": {
            "age": age,
            "sex": sex,
            "race": race
            },
        "symptoms": symptoms,
        "vitals": vitals,
        "tests": {}
    }

if __name__ == "__main__":
    templates = load_disease_templates()
    case = generate_random_case(templates)

    # Hide disease before presenting to user
    for_display = {k: v for k, v in case.items() if k != "name"}
    print(json.dumps(for_display, indent=2))
