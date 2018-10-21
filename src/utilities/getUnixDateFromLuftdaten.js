export default function getUnixDateFormLuftdaten(date) {
    // IOS BUG https://stackoverflow.com/questions/26657353/date-on-ios-device-returns-nan/26671796
    var t = date.split(/[- :]/);
    var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    var newDate = new Date(d);
    newDate = newDate.getTime() / 1000.0;

    return newDate;
}