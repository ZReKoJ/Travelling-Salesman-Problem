'use strict'

var notifier = new Notifier();

var data = null;
/*
var algorithms = {
    "k-means": new KMeans().setData(data),
    "bayes": new Bayes().setData(data),
    "lloyd": new Lloyd().setData(data),
    "som": new SOM().setData(data)
}
*/
$(() => {
    loadExternalData();

    makeResizableDiv('.setting-panel');
    makeResizableDiv('.info-panel');

    console.log(dataFiles);
    // the path where is located the data
    loadDataFile("https://zrekoj.github.io/Travelling-Salesman-Problem/data/argentina.txt", (parsedData) => {
        data = parsedData;
        console.log(data)
    })


    //let settingFunctions = settingPanel('.setting-panel>.setting');

    //infoMessages();
    //updateData();
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
        lines => Number.isInteger(Number(lines[0]))
    ).map(
        lines => [Number(lines[1]), Number(lines[2])]
    );
}

/*
function settingPanel(div) {
    let setting = $(div);

    let bodyInput = setting.find("input[type='file']#data-body");
    bodyInput.on("change", (e) => {
        let reader = new FileReader();
        reader.onload = function () {
            let body = reader.result.split("\n").map(line => line.split(CONFIG.DELIMITER));
            let max = Math.max.apply(null, body.map(line => line.length));
            body = body.filter(line => line.length == max);
            CONFIG.CLASS = max;
            data = {
                columns: max,
                body: body
            };
            updateData();
        };
        reader.readAsText(event.target.files[0]);
    });

    let delimiterInput = setting.find("input[type='text'].delimiter");
    delimiterInput.val(CONFIG.DELIMITER);
    delimiterInput.on("change", (e) => {
        CONFIG.DELIMITER = delimiterInput.val();
    });

    let selectResult = $(".draw-panel>.result");
    selectResult.hide();

    let stateButton = setting.find("button.state");
    stateButton.on("click", () => {
        try {
            selectResult.empty();
            selectResult.hide();
            let result = algorithms[CONFIG.METHOD].execute(getInputsData());
            result.forEach((res, index) => {
                let selected = (index == 0) ? " selected" : "";
                selectResult.append($("<option" + selected + ">" + res.title + " (" + res.probability + ")" + "</option>"))
            });
            selectResult.show();
        } catch (err) {
            console.log(err)
            notifier.error(err.message)
        }
    });

    let classSelect = setting.find(".class");
    classSelect.on("change", (e) => {
        CONFIG.CLASS = classSelect.val();
        updateData();
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
                algorithms[algorithm].train();
            });
        });
    });

    return {};
}

function updateData() {
    let table = $(".info-panel>.information>table");
    table.empty();

    let selectInput = $(".setting-panel .class");
    selectInput.empty();

    let classifyForm = $(".draw-panel form.classify");
    classifyForm.empty();

    let row = undefined;

    row = $("<tr></tr>");
    Array(data.columns).fill().forEach((element, index) => {
        let selected = (index + 1 == CONFIG.CLASS) ? "selected" : "";
        selectInput.append($("<option value='" + (index + 1) + "' " + selected + ">" + (index + 1) + "</option>"));
        if (index + 1 != CONFIG.CLASS) {
            classifyForm.append($("<div class='data-input'><label>" + (index + 1) + "</label><input type='number'></div>"))
        }
        row.append($("<th>" + (index + 1) + "</th>"));
    });
    table.append(row);

    data.body.forEach(line => {
        row = $("<tr></tr>");
        line.forEach(element => {
            row.append($("<td>" + element + "</td>"));
        });
        table.append(row);
    });

    Object.values(algorithms).forEach(algorithm => {
        algorithm.setData(data).train();
    });
}

function getInputsData() {
    let inputsData = {};

    $(".data-input", $(".draw-panel>form.classify")).each((index, element) => {
        let label = $(element).find("label").text();
        let input = $(element).find("input[type='number']").val();
        inputsData[String(label - 1)] = input;
    });

    Object.values(inputsData).forEach(element => {
        if (element == undefined || element == null || element == "") {
            throw new Error(messages.error.inputsNotFilled)
        }
    });

    return inputsData;
}

function infoMessages() {
    let allInfoMessages = messages.info.uses.recursiveValues();
    setInterval(() => {
        notifier.info(allInfoMessages[
            Math.floor(Math.random() * allInfoMessages.length)
        ]);
    }, CONFIG.SHOW_MESSAGES_INTERVAL);
}
*/