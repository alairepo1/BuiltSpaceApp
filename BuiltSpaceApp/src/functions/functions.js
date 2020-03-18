function getStartTime() {
    console.log("start")
    var date = new Date();
    var timeOffset = date.getTimezoneOffset() / 60;
    var localDate = new Date(date.getTime() - timeOffset * 3600 * 1000);
    return localDate.toISOString();
}

function calculateDurationInspection(starttime, endtime) {
    var duration = ((Date.parse(endtime) - Date.parse(starttime)) / (1000 * 60)).toFixed(2);
    return duration;
}

export {getStartTime, calculateDurationInspection}