function getStartTime() {
    console.log("start")
    var date = new Date();
    var timeOffset = date.getTimezoneOffset() / 60;
    var localDate = new Date(date.getTime() - timeOffset * 3600 * 1000);
    return localDate.toISOString();
}

export {getStartTime}