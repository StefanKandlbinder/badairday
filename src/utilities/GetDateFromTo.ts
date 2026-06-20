// The data has a ~2 hour publication delay (HMW half-hour averages).
// Always format in Austrian timezone (Europe/Vienna) so this works
// correctly on both local (CEST) and UTC production servers.
const DELAY = 120;

function formatViennaDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Vienna',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export default function getDateFromTo(): { from: string; to: string } {
  const dateTo = new Date();
  const dateFrom = new Date();
  dateFrom.setMinutes(dateFrom.getMinutes() - DELAY);
  dateFrom.setMinutes(0, 0, 0);
  return { from: formatViennaDate(dateFrom), to: formatViennaDate(dateTo) };
}
