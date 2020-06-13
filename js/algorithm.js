"use strict"

class Graph {
    constructor(data) {
        this.vertex = data;
        this.edges = [];
        this.numVertex = data.length;
        this.complexGraph(this.numVertex);
    }

    // builds up a complex graph by giving the number of vertex
    // as the distance from a - b is same as b - a, in this graph can only get one (less memory)
    // created double dimension array in which first index is always bigger than second index
    /*
    [
        [],                 position 0 has no links
        [x],                position 1 has 1 link
        [x, x],             position 2 has 2 links
        [x, x, x],          position 3 has 3 links
        [x, x, x, x],       position 4 has 4 links
    ]
    the links above are edges, and Xs are distances 
    so if i wanna know distance between vertex 1 and 3, access [3][1]
    */
    complexGraph(numVertex) {
        this.edges = Array(this.numVertex)
            .fill(undefined)
            .map(
                (a, i) => Array(i)
                .fill(undefined)
                .map(
                    (b, j) => {
                        return {
                            distance: this.calculateDistance(i, j)
                        }
                    }
                )
            );
    }

    calculateDistance(i, j) {
        let value = Math.sqrt(
            Math.pow(this.vertex[i][0] - this.vertex[j][0], 2) +
            Math.pow(this.vertex[i][1] - this.vertex[j][1], 2)
        );
        return value == 0 ? 0.0000000001 : value;
    }

    getRandomPath() {
        // shuffle random order giving random paths
        return Array(this.numVertex)
            .fill(undefined)
            .map((a, index) => index)
            .sort(() => 0.5 - Math.random())
    }

    getValue(i, j) {
        // the first index must be the bigger one as the structure of the graph is defined like this
        return this.edges[Math.max(i, j)][Math.min(i, j)];
    }

    // the func param is an inner function with the following parameters:
    // i, j of the position of the node in the graph, and the currect 
    // basically is a map for each value in case we need to add more information to edges
    addToGraphAttribute(func) {
        this.edges = this.edges.map(
            (node, i) => node.map(
                (value, j) => func(i, j, value)
            )
        );
    }

    getPrintFormat(path) {
        return path.map(
            (element, index) => [
                this.vertex[element],
                this.vertex[path[(index + 1) % path.length]]
            ]
        )
    }

    getPathCost(path) {
        return path.reduce(
            (accumulator, from, index) =>
            accumulator + this.getValue(from, path[(index + 1) % path.length])["distance"], 0);
    }
}

class Algorithm {
    constructor() {}

    setData(data) {
        this.graph = new Graph(data);
        return this;
    }

    solution() {}
}

class Bee {
    constructor(graph) {
        this.graph = graph;
        this.path = graph.getRandomPath();
        this.personalBestPath = this.path.slice(0);
        this.cost = this.getCost();
        this.personalBestCost = this.cost;
    }

    getCost() {
        return this.graph.getPathCost(this.path);
    }

    getPath() {
        // return copy
        return this.path.slice(0);
    }

    setPath(path) {
        this.path = path;
        this.cost = this.getCost();
        if (this.cost < this.personalBestCost) {
            this.personalBestPath = this.path;
            this.personalBestCost = this.cost;
        }
    }

    getPersonalBestCost() {
        return this.personalBestCost;
    }

    getPersonalBestPath() {
        // return copy
        return this.personalBestPath.slice(0);
    }

    getPrintFormat() {
        return {
            cost: this.personalBestCost,
            path: this.graph.getPrintFormat(this.getPersonalBestPath())
        }
    }
}

class PSO extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);
        return this;
    }

    solution() {
        let bees = Array(CONFIG.ALGORITHMS["PSO"]["population"])
            .fill(undefined)
            .map(element =>
                new Bee(this.graph)
            );

        Array(CONFIG.ALGORITHMS["PSO"]["iteration"])
            .fill(undefined)
            .forEach((element, index) => {
                // first position is the best
                bees.sort((a, b) => a.getPersonalBestCost() - b.getPersonalBestCost());

                bees.forEach(bee => {
                    let swap = [];
                    let currentPath = bee.getPath();

                    this.getSwap(swap, currentPath, bee.getPersonalBestPath(), CONFIG.ALGORITHMS["PSO"]["alpha"]);
                    this.getSwap(swap, currentPath, bees[0].getPersonalBestPath(), CONFIG.ALGORITHMS["PSO"]["beta"]);

                    swap.forEach((sw) => {
                        if (Math.random() <= sw[2]) {
                            let aux = currentPath[sw[0]];
                            currentPath[sw[0]] = currentPath[sw[1]];
                            currentPath[sw[1]] = aux;
                        }
                    });

                    bee.setPath(currentPath);
                });
            });

        return bees.sort((a, b) => a.getPersonalBestCost() - b.getPersonalBestCost())[0].getPrintFormat();
    }

    getSwap(swap, solution, betterSolution, parameter) {
        Array(solution.length)
            .fill(undefined)
            .forEach((element, index) => {
                if (solution[index] != betterSolution[index]) {
                    swap.push([index, betterSolution.indexOf(solution[index]), parameter]);
                    // swap variables
                    let aux = betterSolution[swap[swap.length - 1][0]];
                    betterSolution[swap[swap.length - 1][0]] = betterSolution[swap[swap.length - 1][1]];
                    betterSolution[swap[swap.length - 1][1]] = aux;
                }
            });
    }
}

class Ant {
    constructor(graph, city) {
        this.graph = graph;
        this.init = city;
        this.notVisited = Array(this.graph.numVertex)
            .fill(undefined)
            .map(
                (element, index) => index
            );
        this.cost = Number.MAX_VALUE;
        this.solution = [];
    }

    getSolution() {
        // return a copy
        return this.solution.slice(0);
    }

    getCost() {
        return this.cost;
    }

    calculateSolution() {
        let visited = [this.init];
        // get a copy
        let notVisited = this.notVisited.slice(0);
        notVisited.splice(notVisited.indexOf(this.init), 1);

        while (notVisited.length > 0) {
            let total = notVisited.reduce(
                (accumulator, city) => {
                    // value of the graph between last visited city and the new city
                    let value = this.graph.getValue(visited[visited.length - 1], city);
                    return accumulator + (
                        Math.pow(
                            value.pheromone,
                            CONFIG.ALGORITHMS["ACO"]["alpha"]
                        ) * Math.pow(
                            1 / value.distance,
                            CONFIG.ALGORITHMS["ACO"]["beta"]
                        )
                    )
                },
                0);

            let maxProbability = notVisited.reduce(
                (max, city) => {
                    // value of the graph between last visited city and the new city
                    let value = this.graph.getValue(visited[visited.length - 1], city);
                    // calculate probability and package into an object
                    let actual = {
                        probability: (
                            Math.pow(
                                value.pheromone,
                                CONFIG.ALGORITHMS["ACO"]["alpha"]
                            ) * Math.pow(
                                1 / value.distance,
                                CONFIG.ALGORITHMS["ACO"]["beta"]
                            )
                        ) / (total > 0 ? total : 1),
                        city: city
                    }
                    // compare
                    return actual.probability > max.probability ? actual : max
                }, {
                    probability: 0,
                    city: undefined
                });

            visited.push(maxProbability.city);
            notVisited.splice(notVisited.indexOf(maxProbability.city), 1);
        }

        let cost = this.graph.getPathCost(visited);
        if (cost < this.cost) {
            this.cost = cost;
            this.solution = visited.slice(0);
        }
        return visited;
    }

    getPrintFormat() {
        return {
            cost: this.cost,
            path: this.graph.getPrintFormat(this.getSolution())
        }
    }
}

class ACO extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);
        return this;
    }

    solution() {
        // initialize first random path to set up pheromones
        let randomPath = this.graph.getRandomPath();
        let pheromone = 1 / (this.graph.numVertex * this.graph.getPathCost(randomPath));
        this.graph.addToGraphAttribute((i, j, value) => {
            return {
                distance: value["distance"],
                pheromone: pheromone
            }
        });

        // initialize ants
        let ants = Array(CONFIG.ALGORITHMS["ACO"]["population"])
            .fill(undefined)
            .map(
                (ant, index) => new Ant(this.graph, randomPath[index % randomPath.length])
            )
            .sort(() => 0.5 - Math.random());

        // for each iteration
        Array(CONFIG.ALGORITHMS["ACO"]["iteration"])
            .fill(undefined)
            .forEach((element, index) => {
                // for each ant
                ants.forEach(ant => {
                    ant.calculateSolution();
                });

                this.graph.addToGraphAttribute((i, j, value) => {
                    let totalPheromone = ants.reduce((accumulator, ant) => {
                        let solution = ant.getSolution();
                        // if consecutive then it is a path
                        let indexOfI = solution.indexOf(i);
                        let indexOfJ = solution.indexOf(j);
                        let indexMin = Math.min(indexOfI, indexOfJ);
                        let indexMax = Math.max(indexOfI, indexOfJ);
                        if ((indexMin + 1) % solution.length == indexMax) {
                            return accumulator + (1 / ant.getCost());
                        }
                        return accumulator;
                    }, 0);

                    return {
                        distance: value["distance"],
                        pheromone: (
                            (1 - CONFIG.ALGORITHMS["ACO"]["evaporation"]) *
                            value.pheromone + totalPheromone
                        )
                    };
                });
            });

        return ants.sort((a, b) => a.getCost() - b.getCost())[0].getPrintFormat();
    }
}