"use strict"

class Algorithm {
    constructor() {}

    setData(data) {
        this.rawData = data;
        return this;
    }

    train() {}
}

class KMeans extends Algorithm {
    constructor() {
        super();
    }

    setData(data) {
        super.setData(data);

        this.data = {};
        this.classes = [];

        Array(data.columns).fill().forEach((element, index) => {
            if (index + 1 < CONFIG.CLASS) {
                this.data[index] = [];
                for (let j = 0; j < data.body.length; j++) {
                    this.data[index].push(Number(data.body[j][index]));
                }
            } else {
                for (let j = 0; j < data.body.length; j++) {
                    this.classes.push(String(data.body[j][index]));
                }
            }
        });

        return this;
    }

    train() {
        let centers = {};
        Array.from(new Set(this.classes)).forEach(c => {
            centers[c] = {};
            let count = this.classes.reduce((ac, n) => (c == n) ? ac + 1 : ac, 0);
            Object.keys(this.data).forEach(key => {
                let sum = this.data[key].reduce((ac, n, index) => (c == this.classes[index]) ? ac + n : ac, 0);
                centers[c][key] = sum / count;
            });
        });

        this.centers = this.iterate(centers);
    }

    iterate(centers) {
        let belongingDegrees = this.belongingDegree(centers);
        let newCenters = this.center(centers, belongingDegrees);
        if (this.difference(centers, newCenters)) {
            return newCenters;
        } else {
            return this.iterate(newCenters);
        }
    }

    difference(centers, newCenters) {
        return Object.keys(centers).every(key =>
            Number(CONFIG.ALGORITHMS["k-means"].tolerance) > Math.sqrt(
                Object.keys(centers[key]).reduce((ac, n) => Math.pow(centers[key][n] - newCenters[key][n], 2) + ac, 0)
            )
        );
    }

    center(centers, belongingDegrees) {
        let newCenters = {};
        Object.keys(centers).forEach(
            key => {
                newCenters[key] = {};
                Object.keys(this.data).forEach(
                    row => {
                        let dividend = this.data[row].reduce(
                            (ac, n, index) => Math.pow(belongingDegrees[key][index], CONFIG.ALGORITHMS["k-means"]["exponential-weight"]) * n + ac, 0);
                        let divider = this.data[row].reduce(
                            (ac, n, index) => Math.pow(belongingDegrees[key][index], CONFIG.ALGORITHMS["k-means"]["exponential-weight"]) + ac, 0);
                        newCenters[key][row] = dividend / divider;
                    }
                );
            }
        )
        return newCenters;
    }

    belongingDegree(centers) {
        let belongingDegrees = {};
        let distances = Array(this.classes.length).fill().map(
            (element, index) => {
                let distance = {}
                Object.keys(centers).forEach(
                    key => {
                        distance[key] = Object.keys(centers[key]).reduce(
                            (ac, n) => Math.pow(this.data[n][index] - centers[key][n], 2) + ac, 0)
                    }
                );
                distance["sum"] = Object.values(distance).reduce((ac, n) =>
                    ac + Math.pow(1 / n, 1 / (CONFIG.ALGORITHMS["k-means"]["exponential-weight"] - 1)), 0);
                return distance;
            }
        );
        Object.keys(centers).forEach(
            key => {
                belongingDegrees[key] = distances.map(
                    element => Math.pow(1 / element[key], 1 / (CONFIG.ALGORITHMS["k-means"]["exponential-weight"] - 1)) / element["sum"]
                )
            }
        )
        return belongingDegrees;
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