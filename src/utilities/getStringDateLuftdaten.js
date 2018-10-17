import getStringDate from './getStringDate';

export default function getStringDateLuftdaten(date) {
    var newDate = new Date(date);
    newDate = newDate.getTime() / 1000.0;
    newDate += 7200;

    return getStringDate(newDate * 1000);
}