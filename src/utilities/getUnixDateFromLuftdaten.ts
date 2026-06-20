// iOS bug workaround: https://stackoverflow.com/a/26671796
export default function getUnixDateFormLuftdaten(date: string): number {
  const t = date.split(/[- :]/);
  const d = new Date(
    parseInt(t[0]), parseInt(t[1]) - 1, parseInt(t[2]),
    parseInt(t[3]), parseInt(t[4]), parseInt(t[5])
  );
  return new Date(d).getTime() / 1000.0;
}
