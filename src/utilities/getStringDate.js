export default function getStringDate(date) {
    date += 60* 60 * 1000; // SUMMERTIME
    let tmpDate = new Date(date);
    let year = tmpDate.getFullYear();
    let month = (tmpDate.getMonth() + 1);
    let day = tmpDate.getUTCDate();
    let hours = tmpDate.getHours();
    let minutes = tmpDate.getMinutes();
    let seconds = tmpDate.getSeconds();
    let stringDate = "";

    if (seconds < 10)
        seconds = "0" + seconds;
    
    if (minutes < 10)
        minutes = "0" + minutes;

    if (hours < 10)
        hours = "0" + hours;

    if (month < 10)
        month = "0" + month;

    if (day < 10)
        day = "0" + day;

    stringDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    return stringDate;
}