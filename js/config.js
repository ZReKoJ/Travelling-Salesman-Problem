'use strict'

var CONFIG = {
    DELIMITER: ",",
    CLASS: "5",
    METHOD: "k-means",
    MAX_NODES: 100,
    ALGORITHMS: {
        "PSO": {
            "iterations": 10000,
            "population" : 100,
            "alpha": 0.5,
            "beta": 0.5
        },
        "ACO": {
            "iterations": 100,
            "population" : 10,
            "evaporation": 0.5,
            "alpha": 0.5,
            "beta": 0.5
        }
    },
    SHOW_MESSAGES_INTERVAL: 30000
}