// The data has a ~2 hour publication delay (HMW half-hour averages).
// Always format in Austrian timezone (Europe/Vienna) so this works
// correctly on both local (CEST) and UTC production servers.
const DELAY = 120;

function formatViennaDate(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Vienna',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).formatToParts(date);
    const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export default class GetDateFromTo {
    constructor() {
        this.dateFrom = new Date();
        this.dateTo = new Date();
        this.dateFrom.setMinutes(this.dateFrom.getMinutes() - DELAY);
        // Round down to the nearest full hour
        this.dateFrom.setMinutes(0, 0, 0);
    }

    stringDateFrom() {
        return formatViennaDate(this.dateFrom);
    }

    stringDateTo() {
        return formatViennaDate(this.dateTo);
    }
}
