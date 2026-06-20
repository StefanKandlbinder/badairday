export default function getStringDate(date: number): string {
  date += 60 * 60 * 1000; // SUMMERTIME
  const tmpDate = new Date(date);
  const year = tmpDate.getFullYear();
  let month: string | number = tmpDate.getMonth() + 1;
  let day: string | number = tmpDate.getUTCDate();
  let hours: string | number = tmpDate.getHours();
  let minutes: string | number = tmpDate.getMinutes();
  let seconds: string | number = tmpDate.getSeconds();

  if (seconds < 10) seconds = '0' + seconds;
  if (minutes < 10) minutes = '0' + minutes;
  if (hours < 10) hours = '0' + hours;
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
