'use strict'

var notifier = new Notifier();
var map;
var raphael;
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

$(() => {
    loadExternalData();

    makeResizableDiv('.setting-panel');

    map = $(".draw-panel");
    worldMap();

    let settingFunctions = settingPanel('.setting-panel>.setting');
    /*
        let ddd = ""
        ddd += "1 2 0\n"
        ddd += "2 1 1\n"
        ddd += "3 3 5\n"
        ddd += "4 5 4\n"
        ddd += "5 4 2\n"

        let arg = new PSO().setData(parseData(ddd)).solution();
    */
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
    return parsedData.sort(() => 0.5 - Math.random()).slice(0, 1000);
}

function settingPanel(div) {
    let setting = $(div);

    let executeButton = setting.find("button.execute");
    executeButton.on("click", () => {
        console.log(data);
        let sol = new PSO().setData(data).solution();
        console.log(sol)
        sol.path.forEach(element => {
            drawLine(element[0], element[1])
        })
    });

    let clearButton = setting.find("button.clear");
    clearButton.on("click", () => {
        map.trigger('update', {
            deletePlotKeys: "all",
            deleteLinkKeys: "all",
            animDuration: 1000
        })
    });

    let methodSelect = setting.find(".methods");
    methodSelect.on("change", (e) => {
        $(".draw-panel").empty();
        if (methodSelect.val() == "world") {
            worldMap();
        } else {
            filesMap(methodSelect.val());
        }
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

function drawLine(from, to) {
    raphael.path([
        "M",
        map.height() - ((from[1] - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
        (from[0] - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min), 
        "L", 
        map.height() - ((to[1] - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
        (to[0] - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min),
    ])
    .attr("stroke", "#000000");
}

function drawCircle(y, x) {
    raphael.circle(
        (x - raphaelParams.x.min) * map.width() / (raphaelParams.x.max - raphaelParams.x.min),
        map.height() - ((y - raphaelParams.y.min) * map.height() / (raphaelParams.y.max - raphaelParams.y.min)),
        1
    ).attr("stroke", "#ffffff");
}

function worldMap() {
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