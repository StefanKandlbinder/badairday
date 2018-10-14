export default function getStringDate(date) {
    let tmpDate = new Date(date);
    let year = tmpDate.getFullYear();
    let month = (tmpDate.getMonth() + 1);
    let day = tmpDate.getUTCDate();
    let hours = tmpDate.getHours();
    let minutes = tmpDate.getMinutes();
    let seconds = tmpDate.getSeconds();
    let stringDate = "";

    if (seconds === 0)
        seconds = "0" + 0;
    
    if (minutes === 0)
        minutes = "0" + 0;

    if (hours < 10)
        hours = "0" + hours;

    if (month < 10)
        month = "0" + month;

    if (day < 10)
        day = "0" + day;

    stringDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    return stringDate;
}