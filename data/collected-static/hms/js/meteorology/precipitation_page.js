// var baseUrl = "/hms/rest/api/hydrology/precipitation/";
var baseUrl = "/hms/rest/api/v3/hydrology/precipitation/";

$(function () {
    $('#id_stationID').parent().parent().hide();
    $('#id_source').on('change', updateSourceSelection);
});

function setOutputUI(){
    setMetadata();
    setDataGraph2();
    return false;
}

function getParameters() {
    // Dataset specific request object
    var requestJson = {
        "source": $('#id_source').val(),
        "dateTimeSpan": {
            "startDate": $("#id_startDate").val(),
            "endDate": $('#id_endDate').val(),
            "dateTimeFormat": $("#id_datetimeformat").val()
        },
        "geometry": {
            "point": {
                "latitude": $("#id_latitude").val(),
                "longitude": $("#id_longitude").val()
            },
            "geometryMetadata": {
                "stationID": $("#id_stationID").val()
            }
        },
        "dataValueFormat": $("#id_outputformat").val(),
        "temporalResolution": $("#id_temporalresolution").val(),
        "timeLocalized": $("#id_timelocalized").val(),
        "units": "default",
        "outputFormat": "json"
    };
    return requestJson;
}

function updateSourceSelection() {
    var selectedSource = $('#id_source').val();
    var ncdcSelect = $('#id_stationID').parent().parent();
    if (selectedSource === "ncdc") {
        ncdcSelect.show();
    }
    else {
        ncdcSelect.hide();
    }
    return false;
}
