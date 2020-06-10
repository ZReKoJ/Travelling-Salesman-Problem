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
                    (b, j) => this.calculateDistance(i, j)
                )
            );
    }

    calculateDistance(i, j) {
        return Math.sqrt(
            Math.pow(this.vertex[i][0] - this.vertex[j][0], 2) +
            Math.pow(this.vertex[i][1] - this.vertex[j][1], 2)
        );
    }

    getRandomPath() {
        // shuffle random order giving random paths
        return Array(this.numVertex)
            .fill(undefined)
            .map((a, index) => index)
            .sort(() => 0.5 - Math.random())
    }

    getDistance(i, j) {
        // the first index must be the bigger one as the structure of the graph is defined like this
        return this.edges[Math.max(i, j)][Math.min(i, j)];
    }

    getPrintFormat(path) {
        return path.map(
            (element, index) => [
                this.vertex[element],
                this.vertex[path[(index + 1) % path.length]]
            ]
        )
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
        return this.path.reduce(
            (accumulator, from, index) =>
            accumulator + this.graph.getDistance(from, this.path[(index + 1) % this.path.length]), 0);
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

        Array(CONFIG.ALGORITHMS["PSO"]["iterations"])
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

class Bayes extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);

        this.data = {};
        data.body.forEach(row => {
            let classTitle = row[CONFIG.CLASS - 1];
            if (!this.data[classTitle]) {
                this.data[classTitle] = [];
            }
            this.data[classTitle].push(row
                .filter((element, index) => index + 1 != CONFIG.CLASS)
                .map(element => Number(element))
            );
        });

        return this;
    }

    train() {
        this.measures = {};

        Object.keys(this.data).forEach(key => {
            this.measures[key] = {};
            this.measures[key].average = Array(this.rawData.columns - 1).fill(0);
            this.data[key].forEach(row => {
                row.forEach((element, index) => {
                    this.measures[key]["average"][index] += element;
                });
            });
            this.measures[key].average = this.measures[key].average.map(
                element => element / this.data[key].length
            );
            this.measures[key].matrix = [];
            this.measures[key].matrix = Matrix.divide(
                this.data[key].map(
                    // calculating differences
                    row => row.map(
                        (element, index) => element - this.measures[key].average[index]
                    )
                )
                .map(
                    // calculating product between transposed matrix and matrix 
                    row => math.multiply(math.transpose([row]), [row])
                )
                .reduce(
                    (ac, matrix) => ac ? Matrix.sum(ac, matrix) : matrix
                ), this.data[key].length);
        });
    }

    execute(inputsData) {
        let inputs = Object.values(inputsData).map(value => Number(value));
        let arrayResult = [];
        let total = 0;
        Object.keys(this.measures).forEach(key => {
            let result = math.inv(this.measures[key].matrix);
            result = math.multiply([inputs], result);
            result = math.multiply(result, math.transpose([inputs]));
            result = Number(result[0][0]);
            total += result;
            arrayResult.push({
                title: key,
                probability: result
            })
        });
        return arrayResult
            .map(element => {
                element.probability = 1 - (element.probability / total);
                return element;
            })
            .sort((a, b) => a.probability < b.probability ? 1 : -1);
    }
}

class Lloyd extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);

        this.classes = [];
        this.data = this.rawData.body.map(
            row => row
            .filter(element => {
                if (isNaN(element)) {
                    this.classes.push(element);
                    return false;
                } else {
                    return true;
                }
            })
            .map(
                element => Number(element)
            )
        );

        return this;
    }

    train() {
        let centers = {};
        Array.from(new Set(this.classes)).forEach(c => {
            centers[c] = new Array(this.data[0].length).fill(0);
        });
        this.data.forEach((row, i) => {
            row.forEach((element, j) => {
                centers[this.classes[i]][j] += element;
            })
        });
        Object.keys(centers).forEach(key => {
            let count = this.classes.reduce((ac, n) => key == n ? ac + 1 : ac, 0);
            centers[key] = centers[key].map(element => element / count);
        });

        this.iteration = 0;
        this.centers = this.iterate(centers);
    }

    iterate(centers) {
        this.iteration++;
        let newCenters = {};

        Object.keys(centers).forEach(key => {
            newCenters[key] = centers[key].map(element => element);
        });

        this.data.forEach(row => {
            this.updateCenters(newCenters, row);
        });

        if (this.iteration <= CONFIG.ALGORITHMS["lloyd"].iteration && !this.difference(centers, newCenters)) {
            return this.iterate(newCenters);
        } else {
            return newCenters;
        }
    }

    difference(centers, newCenters) {
        return Object.keys(centers).every(key =>
            Number(CONFIG.ALGORITHMS["lloyd"].tolerance) > Math.sqrt(
                Object.keys(centers[key]).reduce((ac, n) => Math.pow(centers[key][n] - newCenters[key][n], 2) + ac, 0)
            )
        );
    }

    updateCenters(centers, row) {
        let label;
        let min = Number.MAX_SAFE_INTEGER;
        Object.keys(centers).forEach(key => {
            let result = Math.sqrt(
                row.reduce(
                    (ac, n, index) => Math.pow(n - centers[key][index], 2) + ac, 0)
            );
            if (result < min) {
                min = result;
                label = key;
            }
        });

        centers[label] = row.map(
            (element, index) => centers[label][index] + (CONFIG.ALGORITHMS["lloyd"]["learning-ratio"] * (element - centers[label][index]))
        );
    }

    execute(inputsData) {
        let arrayResult = [];
        let total = 0;
        Object.keys(this.centers).forEach(key => {
            let result = Math.sqrt(
                Object.keys(this.centers[key]).reduce(
                    (ac, n) => Math.pow(Number(this.centers[key][n]) - Number(inputsData[n]), 2) + ac, 0)
            )
            total += result;
            arrayResult.push({
                title: key,
                probability: result
            })
        });

        return arrayResult
            .map(element => {
                element.probability = 1 - (element.probability / total);
                return element;
            })
            .sort((a, b) => a.probability < b.probability ? 1 : -1);
    }
}

class SOM extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);

        this.classes = [];
        this.data = this.rawData.body.map(
            row => row
            .filter(element => {
                if (isNaN(element)) {
                    this.classes.push(element);
                    return false;
                } else {
                    return true;
                }
            })
            .map(
                element => Number(element)
            )
        );

        return this;
    }

    train() {
        let centers = {};
        Array.from(new Set(this.classes)).forEach(c => {
            centers[c] = new Array(this.data[0].length).fill(0);
        });
        this.data.forEach((row, i) => {
            row.forEach((element, j) => {
                centers[this.classes[i]][j] += element;
            })
        });
        Object.keys(centers).forEach(key => {
            let count = this.classes.reduce((ac, n) => key == n ? ac + 1 : ac, 0);
            centers[key] = centers[key].map(element => element / count);
        });

        this.iteration = 0;
        this.centers = this.iterate(centers);
    }

    iterate(centers) {
        this.iteration++;
        let newCenters = {};

        Object.keys(centers).forEach(key => {
            newCenters[key] = centers[key].map(element => element);
        });

        let alpha = CONFIG.ALGORITHMS["som"]["alpha-initial"] * Math.pow(
            CONFIG.ALGORITHMS["som"]["alpha-final"] / CONFIG.ALGORITHMS["som"]["alpha-initial"],
            this.iteration / CONFIG.ALGORITHMS["som"]["iteration"]
        );

        this.data.forEach(row => {
            this.updateCenters(newCenters, row, alpha);
        });

        if (this.iteration <= CONFIG.ALGORITHMS["som"].iteration && !this.difference(centers, newCenters)) {
            return this.iterate(newCenters);
        } else {
            return newCenters;
        }
    }

    difference(centers, newCenters) {
        return Object.keys(centers).every(key =>
            Number(CONFIG.ALGORITHMS["som"].tolerance) > Math.sqrt(
                Object.keys(centers[key]).reduce((ac, n) => Math.pow(centers[key][n] - newCenters[key][n], 2) + ac, 0)
            )
        );
    }

    updateCenters(centers, row, alpha) {
        Object.keys(centers).forEach(key => {
            let result = row.reduce(
                (ac, n, index) => Math.pow(n - centers[key][index], 2) + ac, 0);
            result = Math.exp(
                -1 * (result / (2 * Math.pow(alpha, 2)))
            );
            if (result >= CONFIG.ALGORITHMS["som"]["t"]) {
                centers[key] = row.map(
                    (element, index) => centers[key][index] + CONFIG.ALGORITHMS["som"]["learning-ratio"] * result * (element - centers[key][index])
                );
            }
        });
    }

    execute(inputsData) {
        let arrayResult = [];
        let total = 0;
        Object.keys(this.centers).forEach(key => {
            let result = Math.sqrt(
                Object.keys(this.centers[key]).reduce(
                    (ac, n) => Math.pow(Number(this.centers[key][n]) - Number(inputsData[n]), 2) + ac, 0)
            )
            total += result;
            arrayResult.push({
                title: key,
                probability: result
            })
        });

        return arrayResult
            .map(element => {
                element.probability = 1 - (element.probability / total);
                return element;
            })
            .sort((a, b) => a.probability < b.probability ? 1 : -1);
    }
}