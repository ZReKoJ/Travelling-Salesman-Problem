'use strict'

var CONFIG = {
    DELIMITER: ",",
    CLASS: "5",
    METHOD: "k-means",
    MAX_NODES: 50,
    ALGORITHMS: {
        "PSO": {
            "iterations": 10000,
            "population" : 100,
            "alpha": 0.5,
            "beta": 0.5
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