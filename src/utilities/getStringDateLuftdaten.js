import getStringDate from './getStringDate';
import getUnixDateFromLuftdaten from './getUnixDateFromLuftdaten';

export default function getStringDateLuftdaten(date) {
    var newDate = getUnixDateFromLuftdaten(date);
    
    // add 1 hour because of timezone
    newDate += 7200;

    return getStringDate(newDate * 1000);
}
