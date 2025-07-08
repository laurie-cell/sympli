import math

def update(priors, likelihoods):
    """
    Updates priors using Bayes Theorem.

    Params:
        priors (dict): {name: prob (float)}
        likelihoods (dict): {name: prob (float)}

    Returns:
        posts (dict): {name: prob (float)}; updated posteriors
    """
    unnormalized_posts = {}

    for name, prior in priors.items():
        unnormalized_posts[name] = prior * likelihoods[name]

    total = sum(unnormalized_posts.values())
    if total == 0:
        return {name: 0 for name in priors}

    return {name: p/total for name, p in unnormalized_posts.items()}


def comp_starting_likelihoods(disease_templates, demographics, symptoms, vitals):
    """
    Computes P(demographics, symptoms, vitals|disease) for each disease in disease_templates.

    Params:
        disease_templates (list): list of dicts describing diseases
        demographics (dict): {"age": (int), "sex": (str), "race": (str)}
        symptoms (dict): {symptom: T/F}
        vitals (dict): {vital: (int/float)}

    Returns:
        likelihoods (dict): name => adjusted likelihood factor
    """
    likelihoods = {}

    for disease in disease_templates:
        likelihood = 1.0

        # For all demographics, multiply likelihood by P(demographic|disease)
        likelihood *= normal_pdf(demographics["age"], disease["demographics"]["age"]["mean"], disease["demographics"]["age"]["std"])
        likelihood *= disease["demographics"]["sex_distribution"][demographics["sex"]]
        likelihood *= disease["demographics"]["race_distribution"][demographics["race"]]

        # For all symptoms, multiply likelihood by P(symptom|disease)
        for symptom, present in symptoms.items(): # update symptoms
            p = disease["symptoms"][symptom]["probability"]
            likelihood *= p if present else (1-p)

        # For all vitals, multiply likelihood by P(vital|disease)
        for vital, details in disease["vitals"].items():
            likelihood *= normal_pdf(vitals[vital], details["mean"], details["std"])

        likelihoods[disease["name"]] = likelihood

    return likelihoods


def comp_test_likelihood(disease_templates, test_name, result):
    """
    Computes P(test_results|disease) for each disease in disease_templates.

    Params:
        disease_templates (list): list of dicts describing diseases
        test (str): name of test
        result (str/list): "positive"/"negative" for binary tests, list of findings otherwise

    Returns:
        likelihoods (dict): name => adjusted likelihood factor
    """
    likelihoods = {}

    for disease in disease_templates:
        likelihood = 1.0

        # Binary test
        if disease["diagnostic_tests"][test_name]["Binary"]:
            if test_name in disease["diagnostic_tests"]:
                sens = disease["diagnostic_tests"][test_name]["sensitivity"]
                spec = disease["diagnostic_tests"][test_name]["specificity"]
            else:
                sens = 0.01
                spec = 0.99

            # Multiply likelihood by sens if test is positive (true pos) and spec if test is negative (false neg)
            if result == "positive":
                likelihood *= sens
            else:
                likelihood *= (1 - spec)
        # Not binary test, multiply likelihood by sensitivity or (1 - spec) for each possible finding
        else:
            for finding in disease["diagnostic_tests"][test_name]:
                if finding != "Binary":
                    if finding in result:
                        likelihood *= disease["diagnostic_tests"][test_name][finding]["sensitivity"]
                    else:
                        likelihood *= (1 - disease["diagnostic_tests"][test_name][finding]["specificity"])

        likelihoods[disease["name"]] = likelihood

    return likelihoods


def normal_pdf(x, mean, std):
    """
    Calculates the probability that the value of a random variable X is x
    given the mean and std.

    Params:
        x (float): value
        mean (float): mean of normal distr
        std (float): stdev of normal distr

    Returns:
        prob (float): probability that X = x.

    """
    var = std ** 2
    return math.exp(-((x - mean) ** 2) / (2 * var)) / math.sqrt(2 * math.pi * var)
