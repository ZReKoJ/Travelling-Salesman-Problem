'use strict'

var CONFIG = {
    DELIMITER: ",",
    CLASS: "5",
    METHOD: "k-means",
    ALGORITHMS: {
        "PSO": {
            "iterations": 1000,
            "population" : 10,
            "alpha": 0.9,
            "beta": 1
        },
        "bayes": {},
        "lloyd": {
            "tolerance": Math.pow(10, -10),
            "iteration": 10,
            "learning-ratio": 0.1
        },
        "som": {
            "tolerance": Math.pow(10, -6),
            "iteration": 1000,
            "learning-ratio": 0.1,
            "alpha-initial": 0.1,
            "alpha-final": 0.01,
            "t": Math.pow(10, -5)
        }
    },
    SHOW_MESSAGES_INTERVAL: 30000
}