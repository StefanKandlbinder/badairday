export default function getUnixDateFormLuftdaten(date) {
    var newDate = new Date(date);
    newDate = newDate.getTime() / 1000.0;

    return newDate;
}