import math
import load_case

def update(priors, likelihoods):
    """
    Params:
        prior (dict): disease_name (str) -> prior prob (float)
        likelihoods (dict): disease_name (str) -> adjusted likelihood factor (float)

    Returns:
        (dict): disease_name (str) -> adjusted probs (float)
    """
    unnormalized_posts = {}

    for disease, prior in priors.items():
        unnormalized_posts[disease] = prior * likelihoods[disease]

    total = sum(unnormalized_posts.values())
    if total == 0:
        return {disease: 0 for disease in priors}

    return {disease: p/total for disease, p in unnormalized_posts.items()}

def compute_likelihoods(diseases, demographics={}, symptoms_observed={}, vitals={}, test_results={}):
    """
    Params:
        diseases (dict): disease_name (str) -> info (dict)
        symptoms (dict): symptom_name (str) -> True/False (bool)
        test_results (dict): test_name (str) -> "positive"/"negative" (str)

    Returns:
        likelihoods (dict): disease_name (str) -> adjusted likelihood factor (float)
    """
    likelihoods = {}

    for disease, info in diseases.items():
        likelihood = 1.0

        for demographic, (mean, std) in info["demographics"].items():
            likelihood *= normal_pdf(demographics[demographic], mean, std)

        for symptom, present in symptoms_observed.items(): # update symptoms
            p = info["symptoms"].get(symptom)
            likelihood *= p if present else (1-p)

        for vital, (mean, std) in info["vitals"].items():
            likelihood *= normal_pdf(vitals[vital], mean, std)

        for test, result in test_results.items(): # update tests
            if test in info["tests"]:
                sens = info["tests"][test]["sensitivity"]
                spec = info["tests"][test]["specificity"]
            else:
                sens = 0.01
                spec = 0.99

            if result == "positive": # use sensitivity if positive test
                likelihood *= sens
            else:
                likelihood *= (1 - spec)

        likelihoods[disease] = likelihood

    return likelihoods

def normal_pdf(x, mean, std):
    """
    Params:
        x (float): value
        mean (float): mean of normal distr
        std (float): stdev of normal distr

    Returns:

    """
    var = std ** 2
    return math.exp(-((x - mean) ** 2) / (2 * var)) / math.sqrt(2 * math.pi * var)
