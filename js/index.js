'use strict'

var notifier = new Notifier();
var map;
var raphael;
var color = "#000000";
var raphaelParams = {
    x: {
        max: 0,
        min: Number.MAX_VALUE
    },
    y: {
        max: 0,
        min: Number.MAX_VALUE
    }
};
var data = [];

var algorithms = {
    "PSO": new PSO(),
    "ACO": new ACO()
}

$(() => {
    loadExternalData();

    makeResizableDiv('.setting-panel');

    map = $(".draw-panel");
    worldMap();

    let settingFunctions = settingPanel('.setting-panel>.setting');
});

function loadDataFile(link, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            callback(parseData(request.responseText));
        }
    };
    request.open("GET", link, true);
    request.send();
}

// This parse is very simple, so it could get error in case the format is not correct
// All point variables should be starting with "X XXX XXX" as index, number, number
// the other values will be filtered 
function parseData(data) {
    raphaelParams.x.max = 0;
    raphaelParams.x.min = Number.MAX_VALUE;
    raphaelParams.y.max = 0;
    raphaelParams.y.min = Number.MAX_VALUE;
    let parsedData = data.split("\n").map(
        lines => lines.split(" ")
    ).filter(
        lines => Number(lines[0]) != "" && Number.isInteger(Number(lines[0]))
    ).map(lines => {
        raphaelParams.x.max = Math.max(lines[2], raphaelParams.x.max);
        raphaelParams.x.min = Math.min(lines[2], raphaelParams.x.min);
        raphaelParams.y.max = Math.max(lines[1], raphaelParams.y.max);
        raphaelParams.y.min = Math.min(lines[1], raphaelParams.y.min);
        return [Number(lines[1]), Number(lines[2])]
    });
    return parsedData.sort(() => 0.5 - Math.random()).slice(0, CONFIG.ALGORITHMS[CONFIG.METHOD].node);
}

function settingPanel(div) {
    let setting = $(div);

    let executeButton = setting.find("button.execute");
    executeButton.on("click", () => {
        let sol = algorithms[CONFIG.METHOD].setData(data).solution();
        color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        sol.path.forEach(element => {
            if (dataSelect.val() != "world") {
                drawLineRaphael(element[0], element[1])
            } else {
                drawLineMapael(element[0], element[1])
            }
        })
    });

    let dataSelect = setting.find(".data");
    dataSelect.on("change", (e) => {
        $(".draw-panel").empty();
        if (dataSelect.val() == "world") {
            worldMap();
        } else {
            filesMap(dataSelect.val());
        }
    });

    let clearButton = setting.find("button.clear");
    clearButton.on("click", () => {
        $(".draw-panel").empty();
        if (dataSelect.val() == "world") {
            worldMap();
        } else {
            filesMap(dataSelect.val());
        }
    });

    let methodSelect = setting.find(".methods");
    methodSelect.on("change", (e) => {
        CONFIG.METHOD = methodSelect.val();
        setting.find(".full-box").hide();
        setting.find("." + CONFIG.METHOD).show();
    });

    setting.find(".full-box").hide();
    setting.find("." + CONFIG.METHOD).show();
    Object.keys(CONFIG.ALGORITHMS).forEach(algorithm => {
        let element = setting.find("." + algorithm);
        Object.keys(CONFIG.ALGORITHMS[algorithm]).forEach(attr => {
            let attribute = element.find("." + attr);
            attribute.val(CONFIG.ALGORITHMS[algorithm][attr]);
            attribute.on("change", (e) => {
                CONFIG.ALGORITHMS[algorithm][attr] = attribute.val();
                if (attr == "node") {
                    $(".draw-panel").empty();
                    if (dataSelect.val() == "world") {
                        worldMap();
                    } else {
                        filesMap(dataSelect.val());
                    }
                }
            });
        });
    });
}

function filesMap(country) {
    raphael = new Raphael("draw-panel", map.width(), map.height());
    loadDataFile("https://zrekoj.github.io/Travelling-Salesman-Problem/data/" + country + ".txt", (parsedData) => {
        data = parsedData;
        parsedData.forEach((dataValue) => {
            drawCircle(dataValue[0], dataValue[1]);
        });
    });
}

function drawLineRaphael(from, to) {
    raphael.path([
            "M",
            (from[1] - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min),
            map.height() - ((from[0] - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
            "L",
            (to[1] - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min),
            map.height() - ((to[0] - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
        ])
        .attr("stroke", color)
        .attr("stroke-width", "1")
        .attr("opacity", 0.5)
        .translate(0.5, 0.5);
}

function drawLineMapael(from, to) {
    let fromId = String(from[0]) + '-' + String(from[1]);
    let toId = String(to[0]) + '-' + String(to[1]);
    let linkId = fromId + '-' + toId;
    let updateOptions = {
        'newLinks': {}
    };
    updateOptions.newLinks[linkId] = {
        factor: -0.3,
        between: [fromId, toId],
        attrs: {
            "stroke-width" : 0.5,
            "stroke" : color
        }
    }
    map.trigger('update', [updateOptions]);
}

function drawCircle(y, x) {
    raphael.circle(
        (x - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min),
        map.height() - ((y - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
        1
    ).attr("stroke", "#ffffff");
}

function worldMap() {
    data = []
    map.append('<div class="map">Cargando ...</div>');

    // Mapael initialisation
    map.mapael({
        map: {
            name: "world_countries",
            zoom: {
                enabled: true,
                step: 0.25,
                maxLevel: 100
            }
        }
    });

    map.trigger('update', {
        deletePlotKeys: "all",
        deleteLinkKeys: "all",
        animDuration: 1000
    })

    map.on('dblclick', (e) => {
        let coords = map.data('mapael').mapPagePositionToXY(e.pageX, e.pageY);
        let plotId = String(coords.x) + '-' + String(coords.y);
        if (map.data('mapael').options.plots[plotId] == undefined) {
            let updateOptions = {
                'newPlots': {}
            };
            updateOptions.newPlots[plotId] = {
                x: coords.x,
                y: coords.y,
                size: 5
            }
            data.push([coords.x, coords.y]);
            map.trigger('update', [updateOptions]);
        }
    });
}