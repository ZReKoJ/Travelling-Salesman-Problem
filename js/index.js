'use strict'

var notifier = new Notifier();
var map;
var data = [];

$(() => {
    loadExternalData();

    makeResizableDiv('.setting-panel');

    map = $(".draw-panel");
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
            data.push({
                x: coords.x,
                y: coords.y,
            });
            map.trigger('update', [updateOptions]);
        }
    });

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
    return data.split("\n").map(
        lines => lines.split(" ")
    ).filter(
        lines => Number(lines[0]) != "" && Number.isInteger(Number(lines[0]))
    ).map(
        lines => [Number(lines[2]), Number(lines[1])]
    );
}

function settingPanel(div) {
    let setting = $(div);

    let executeButton = setting.find("button.execute");
    executeButton.on("click", () => {});

    let clearButton = setting.find("button.clear");
    clearButton.on("click", () => {
        map.trigger('update', {
            deletePlotKeys: "all",
            deleteLinkKeys: "all",
            animDuration: 1000
        })
    });
}