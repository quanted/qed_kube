// General js for hms model/submodel pages //
var taskID;
var counter = 25;
var componentData;
var resultMetaTable;
var resultDataTable;
var dyGraph;

google.charts.load('current', {'packages': ['table', 'corechart']});

$(function () {
    $("#component_tabs").tabs({
        disabled: [2]
    });

    var datepicker_options = {
        changeMonth: true,
        changeYear: true,
        autosize: true,
        yearRange: '1900:2100'
    };
    // Page load functions
    $("#id_startDate").datepicker(datepicker_options);
    $("#id_endDate").datepicker(datepicker_options);

    // $('.submit_data_request').on('click', getTestData);
    $('.submit_data_request').on('click', getData2);
    setTimeout(pageLoad, 400);
});

function pageLoad() {
    $('#load_page').fadeToggle(600);
    browserCheck();
    return false;
}

function getData() {
    toggleLoader();
    var params = getParameters();
    $.ajax({
        type: "POST",
        url: baseUrl,
        accepts: "application/json",
        data: JSON.stringify(params),
        processData: false,
        timeout: 0,
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            console.log("Data request success");
            componentData = data;
            setOutputUI();
            // setMetadata();
            // setDataGraph();
            $('#component_tabs').tabs("enable", 2);
            $('#component_tabs').tabs("option", "active", 2);
            toggleLoader();
            dyGraph.resize();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Data request error...");
            console.log(errorThrown);
            toggleLoader();
        },
        complete: function (jqXHR, textStatus) {
            console.log("Data request complete");
        }
    });
    return false;
}

function getData2() {
    toggleLoader();
    var params = getParameters();
    $.ajax({
        type: "POST",
        url: baseUrl,
        accepts: "application/json",
        data: JSON.stringify(params),
        processData: false,
        timeout: 0,
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            taskID = data.job_id;
            console.log("Data request success. Task ID: " + taskID);
            setTimeout(getDataPolling, 12000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Data request error...");
            console.log(errorThrown);
            toggleLoader();
        },
        complete: function (jqXHR, textStatus) {
            console.log("Data request complete");
        }
    });
    return false;
}

function getDataPolling() {
    counter = counter - 1;
    var requestUrl = "hms/rest/api/v2/hms/data";
    if (counter > 0) {
        $.ajax({
            type: "GET",
            url: requestUrl + "?job_id=" + taskID,
            accepts: "application/json",
            timeout: 0,
            contentType: "application/json",
            success: function (data, textStatus, jqXHR) {
                if (data.status === "SUCCESS") {
                    componentData = data.data;
                    console.log("Task successfully completed and data was retrieved.");
                    setOutputUI();
                    $('#component_tabs').tabs("enable", 2);
                    $('#component_tabs').tabs("option", "active", 2);
                    toggleLoader();
                    dyGraph.resize();
                    counter = 25;
                }
                else if (data.status === "FAILURE") {
                    console.log("Task failed to complete.");
                }
                else {
                    setTimeout(getDataPolling, 12000);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Data request error...");
                console.log(errorThrown);
                toggleLoader();
            },
            complete: function (jqXHR, textStatus) {
                console.log("Data request complete");
            }
        });
    }
    else {
        console.log("Failed to get data, reached polling cap.")
    }
    return false;
}

function setMetadata() {
    var metaDataTile = componentData.dataset;
    var sourceTitle = componentData.dataSource.toUpperCase();
    $('#output_metadata_title').html(metaDataTile + ": " + sourceTitle + " Metadata");
    resultMetaTable = new google.visualization.DataTable();
    resultMetaTable.addColumn('string', 'Metadata');
    resultMetaTable.addColumn('string', 'Value');
    $.map(componentData.metadata, function (key, value) {
        resultMetaTable.addRow([value, key]);
    });
    var metaTable = new google.visualization.Table(document.getElementById('output_metadata'));
    var tableOptions = {
        pageSize: 10,
        width: '100%'
    };
    metaTable.draw(resultMetaTable, tableOptions);
    return false;
}

function setDataGraph() {
    var dataTile = componentData.dataset;
    var sourceTitle = componentData.dataSource;
    $('#output_data_title').html(dataTile + ": " + sourceTitle + " Data");
    var chartOption = {
        title: componentData.dataset,
        curveType: 'none',
        legend: {position: 'right'},
        width: 800,
        height: 600
    };

    resultDataTable = new google.visualization.DataTable();
    resultDataTable.addColumn({type: 'datetime', label: 'Date', pattern: 'MM-DD-YYYY HH'});
    var j = 2;
    $.each(componentData.metadata, function (k, v) {
        var testKey = "column_" + j.toString();
        if (k === testKey) {
            resultDataTable.addColumn({type: 'number', label: v});
            j++;
        }
    });
    var colNum = componentData.data[Object.keys(componentData.data)[0]].length;
    if ((j - 1) < colNum) {
        var i;
        for (i = colNum; i < j - 1; i++) {
            resultDataTable.addColumn({type: 'number', label: 'Data Column ' + i.toString()});
        }
    }

    $.each(componentData['data'], function (index, row) {
        var r = [];
        var dt = index.split(' ');
        var d = dt[0].split('-');
        r.push(new Date(d[0], d[1] - 1, d[2], dt[1], 0, 0, 0));

        $.each(row, function (key, value) {
            r.push(parseFloat(value));
        });
        if (r.length < j - 1) {
            var k;
            for (k = r.length; k < j - 1; k++) {
                r.push(0.0);
            }
        }
        console.log(r);
        resultDataTable.addRow(r);
    });
    var chart = new google.visualization.LineChart(document.getElementById("output_data"));
    chart.draw(resultDataTable, chartOption);
    return false;
}

function setDataGraph2() {
    var dataTitle = componentData.dataset;
    var sourceTitle = componentData.dataSource.toUpperCase();

    var labels = [];
    var maxColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    $.each(maxColumns, function (v) {
        var testKey = "column_" + v.toString();
        if (testKey in componentData.metadata) {
            labels.push(componentData.metadata[testKey]);
        }
    });
    var dataCSV = [];
    var graphOptions = {
        labels: labels,
        title: dataTitle + ": " + sourceTitle + " Data",
        legend: 'always',
        showRangeSelector: true,
        width: 600
    };
    $.each(componentData['data'], function (index, row) {
        if (row.length + 1 === labels.length) {
            var rowD = [];
            var dt = index.split(' ');
            var d = dt[0].split('-');
            var date;
            if (dt.length === 2) {
                var hr = dt[1].split(':');
                if (hr.length === 2) {
                    date = new Date(d[0], d[1] - 1, d[2], hr[0], hr[1], 0, 0);
                }
                else {
                    date = new Date(d[0], d[1] - 1, d[2], dt[1], 0, 0, 0);
                }
            }
            else {
                date = new Date(d[0], d[1] - 1, d[2], 0, 0, 0);
            }
            rowD.push(date);
            $.each(row, function (key, value) {
                var datapoint = parseFloat(value);
                if(datapoint === -9999 || datapoint === -9998){
                    datapoint = -1;
                }
                rowD.push(datapoint);
            });
            dataCSV.push(rowD);
        }
    });
    var graphEle = document.getElementById('output_data');
    dyGraph = new Dygraph(graphEle, dataCSV, graphOptions);
}

function toggleLoader() {
    $('.submit_data_request_loader').toggleClass("loading_icon");
    $('.submit_data_request').toggleClass("hidden");
}

function exportDataToJSON() {
    var fileName = componentData.dataset + "_" + componentData.dataSource + ".json";
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(componentData)));
    pom.setAttribute('download', fileName);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function exportDataToCSV() {
    var fileName = componentData.dataset + "_" + componentData.dataSource;
    var metadata = "";
    $.each(componentData.metadata, function (k, v) {
        metadata += k + "," + v + "\n";
    });
    var columns = "Date";
    var c_index = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    $.each(c_index, function (v) {
        if (componentData.metadata["column_" + v] && componentData.metadata["column_" + v] !== "Date") {
            columns += "," + componentData.metadata["column_" + v];
        }
    });
    var data = "";
    $.each(componentData.data, function (k, v) {
        data += k;
        $.each(v, function (j, w) {
            data += "," + w;
        });
        data += "\n";
    });
    var csvFinal = columns + "\n" + data + "\n\nMetadata\n" + metadata;
    var dataStr = 'data:data:text/csv;charset=utf-8,' + encodeURIComponent(csvFinal);
    var pom = document.createElement('a');
    pom.setAttribute('href', dataStr);
    pom.setAttribute('download', fileName + '.csv');
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
