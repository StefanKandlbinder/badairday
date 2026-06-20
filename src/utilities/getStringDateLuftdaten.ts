import getStringDate from './getStringDate';
import getUnixDateFromLuftdaten from './getUnixDateFromLuftdaten';

export default function getStringDateLuftdaten(date: string): string {
  let newDate = getUnixDateFromLuftdaten(date);
  newDate += 3600; // add 1 hour for timezone
  return getStringDate(newDate * 1000);
}
