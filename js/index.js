'use strict'

var notifier = new Notifier();

var data = {
    columns: 5,
    body: [
        ["5.1", "3.5", "1.4", "0.2", "Iris-setosa"],
        ["4.9", "3.0", "1.4", "0.2", "Iris-setosa"],
        ["4.7", "3.2", "1.3", "0.2", "Iris-setosa"],
        ["4.6", "3.1", "1.5", "0.2", "Iris-setosa"],
        ["5.0", "3.6", "1.4", "0.2", "Iris-setosa"],
        ["5.4", "3.9", "1.7", "0.4", "Iris-setosa"],
        ["4.6", "3.4", "1.4", "0.3", "Iris-setosa"],
        ["5.0", "3.4", "1.5", "0.2", "Iris-setosa"],
        ["4.4", "2.9", "1.4", "0.2", "Iris-setosa"],
        ["4.9", "3.1", "1.5", "0.1", "Iris-setosa"],
        ["5.4", "3.7", "1.5", "0.2", "Iris-setosa"],
        ["4.8", "3.4", "1.6", "0.2", "Iris-setosa"],
        ["4.8", "3.0", "1.4", "0.1", "Iris-setosa"],
        ["4.3", "3.0", "1.1", "0.1", "Iris-setosa"],
        ["5.8", "4.0", "1.2", "0.2", "Iris-setosa"],
        ["5.7", "4.4", "1.5", "0.4", "Iris-setosa"],
        ["5.4", "3.9", "1.3", "0.4", "Iris-setosa"],
        ["5.1", "3.5", "1.4", "0.3", "Iris-setosa"],
        ["5.7", "3.8", "1.7", "0.3", "Iris-setosa"],
        ["5.1", "3.8", "1.5", "0.3", "Iris-setosa"],
        ["5.4", "3.4", "1.7", "0.2", "Iris-setosa"],
        ["5.1", "3.7", "1.5", "0.4", "Iris-setosa"],
        ["4.6", "3.6", "1.0", "0.2", "Iris-setosa"],
        ["5.1", "3.3", "1.7", "0.5", "Iris-setosa"],
        ["4.8", "3.4", "1.9", "0.2", "Iris-setosa"],
        ["5.0", "3.0", "1.6", "0.2", "Iris-setosa"],
        ["5.0", "3.4", "1.6", "0.4", "Iris-setosa"],
        ["5.2", "3.5", "1.5", "0.2", "Iris-setosa"],
        ["5.2", "3.4", "1.4", "0.2", "Iris-setosa"],
        ["4.7", "3.2", "1.6", "0.2", "Iris-setosa"],
        ["4.8", "3.1", "1.6", "0.2", "Iris-setosa"],
        ["5.4", "3.4", "1.5", "0.4", "Iris-setosa"],
        ["5.2", "4.1", "1.5", "0.1", "Iris-setosa"],
        ["5.5", "4.2", "1.4", "0.2", "Iris-setosa"],
        ["4.9", "3.1", "1.5", "0.1", "Iris-setosa"],
        ["5.0", "3.2", "1.2", "0.2", "Iris-setosa"],
        ["5.5", "3.5", "1.3", "0.2", "Iris-setosa"],
        ["4.9", "3.1", "1.5", "0.1", "Iris-setosa"],
        ["4.4", "3.0", "1.3", "0.2", "Iris-setosa"],
        ["5.1", "3.4", "1.5", "0.2", "Iris-setosa"],
        ["5.0", "3.5", "1.3", "0.3", "Iris-setosa"],
        ["4.5", "2.3", "1.3", "0.3", "Iris-setosa"],
        ["4.4", "3.2", "1.3", "0.2", "Iris-setosa"],
        ["5.0", "3.5", "1.6", "0.6", "Iris-setosa"],
        ["5.1", "3.8", "1.9", "0.4", "Iris-setosa"],
        ["4.8", "3.0", "1.4", "0.3", "Iris-setosa"],
        ["5.1", "3.8", "1.6", "0.2", "Iris-setosa"],
        ["4.6", "3.2", "1.4", "0.2", "Iris-setosa"],
        ["5.3", "3.7", "1.5", "0.2", "Iris-setosa"],
        ["5.0", "3.3", "1.4", "0.2", "Iris-setosa"],
        ["7.0", "3.2", "4.7", "1.4", "Iris-versicolor"],
        ["6.4", "3.2", "4.5", "1.5", "Iris-versicolor"],
        ["6.9", "3.1", "4.9", "1.5", "Iris-versicolor"],
        ["5.5", "2.3", "4.0", "1.3", "Iris-versicolor"],
        ["6.5", "2.8", "4.6", "1.5", "Iris-versicolor"],
        ["5.7", "2.8", "4.5", "1.3", "Iris-versicolor"],
        ["6.3", "3.3", "4.7", "1.6", "Iris-versicolor"],
        ["4.9", "2.4", "3.3", "1.0", "Iris-versicolor"],
        ["6.6", "2.9", "4.6", "1.3", "Iris-versicolor"],
        ["5.2", "2.7", "3.9", "1.4", "Iris-versicolor"],
        ["5.0", "2.0", "3.5", "1.0", "Iris-versicolor"],
        ["5.9", "3.0", "4.2", "1.5", "Iris-versicolor"],
        ["6.0", "2.2", "4.0", "1.0", "Iris-versicolor"],
        ["6.1", "2.9", "4.7", "1.4", "Iris-versicolor"],
        ["5.6", "2.9", "3.6", "1.3", "Iris-versicolor"],
        ["6.7", "3.1", "4.4", "1.4", "Iris-versicolor"],
        ["5.6", "3.0", "4.5", "1.5", "Iris-versicolor"],
        ["5.8", "2.7", "4.1", "1.0", "Iris-versicolor"],
        ["6.2", "2.2", "4.5", "1.5", "Iris-versicolor"],
        ["5.6", "2.5", "3.9", "1.1", "Iris-versicolor"],
        ["5.9", "3.2", "4.8", "1.8", "Iris-versicolor"],
        ["6.1", "2.8", "4.0", "1.3", "Iris-versicolor"],
        ["6.3", "2.5", "4.9", "1.5", "Iris-versicolor"],
        ["6.1", "2.8", "4.7", "1.2", "Iris-versicolor"],
        ["6.4", "2.9", "4.3", "1.3", "Iris-versicolor"],
        ["6.6", "3.0", "4.4", "1.4", "Iris-versicolor"],
        ["6.8", "2.8", "4.8", "1.4", "Iris-versicolor"],
        ["6.7", "3.0", "5.0", "1.7", "Iris-versicolor"],
        ["6.0", "2.9", "4.5", "1.5", "Iris-versicolor"],
        ["5.7", "2.6", "3.5", "1.0", "Iris-versicolor"],
        ["5.5", "2.4", "3.8", "1.1", "Iris-versicolor"],
        ["5.5", "2.4", "3.7", "1.0", "Iris-versicolor"],
        ["5.8", "2.7", "3.9", "1.2", "Iris-versicolor"],
        ["6.0", "2.7", "5.1", "1.6", "Iris-versicolor"],
        ["5.4", "3.0", "4.5", "1.5", "Iris-versicolor"],
        ["6.0", "3.4", "4.5", "1.6", "Iris-versicolor"],
        ["6.7", "3.1", "4.7", "1.5", "Iris-versicolor"],
        ["6.3", "2.3", "4.4", "1.3", "Iris-versicolor"],
        ["5.6", "3.0", "4.1", "1.3", "Iris-versicolor"],
        ["5.5", "2.5", "4.0", "1.3", "Iris-versicolor"],
        ["5.5", "2.6", "4.4", "1.2", "Iris-versicolor"],
        ["6.1", "3.0", "4.6", "1.4", "Iris-versicolor"],
        ["5.8", "2.6", "4.0", "1.2", "Iris-versicolor"],
        ["5.0", "2.3", "3.3", "1.0", "Iris-versicolor"],
        ["5.6", "2.7", "4.2", "1.3", "Iris-versicolor"],
        ["5.7", "3.0", "4.2", "1.2", "Iris-versicolor"],
        ["5.7", "2.9", "4.2", "1.3", "Iris-versicolor"],
        ["6.2", "2.9", "4.3", "1.3", "Iris-versicolor"],
        ["5.1", "2.5", "3.0", "1.1", "Iris-versicolor"],
        ["5.7", "2.8", "4.1", "1.3", "Iris-versicolor"]
    ]
};

var algorithms = {
    "k-means": new KMeans().setData(data),
    "bayes": new Bayes().setData(data),
    "lloyd": new Lloyd().setData(data),
    "som": new SOM().setData(data)
}

$(() => {
    loadExternalData()

    makeResizableDiv('.setting-panel');
    makeResizableDiv('.info-panel');

    let settingFunctions = settingPanel('.setting-panel>.setting');

    infoMessages();
    updateData();
});

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