import getStringDate from './getStringDate';
import getUnixDateFromLuftdaten from './getUnixDateFromLuftdaten';

export default function getStringDateLuftdaten(date) {
    var newDate = getUnixDateFromLuftdaten(date);

    // add 2 hours because of timezone
    newDate += 7200;

    return getStringDate(newDate * 1000);
}