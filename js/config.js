'use strict'

var CONFIG = {
    METHOD: "PSO",
    ALGORITHMS: {
        "PSO": {
            "iteration": 1000,
            "population" : 100,
            "alpha": 0.5,
            "beta": 0.5,
            "node": 50
        },
        "ACO": {
            "iteration": 100,
            "population" : 10,
            "evaporation": 0.5,
            "alpha": 0.5,
            "beta": 0.5,
            "node": 50
        }
    },
    SHOW_MESSAGES_INTERVAL: 30000
}