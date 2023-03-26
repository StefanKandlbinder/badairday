// the data is arriving with a delay
const DELAY = 45;

export default class GetDateFromTo {
    constructor() {
        this.dateFrom = new Date();
        this.dateTo = new Date();

        // Summertime
        this.dateFrom.setHours(this.dateFrom.getHours() - 1);
        this.dateTo.setHours(this.dateTo.getHours() - 1);

        // Wintertime
        // this.dateFrom.setMinutes(this.dateFrom.getMinutes() - DELAY);
        // this.dateTo.setHours(this.dateTo.getHours());

        // 40 minutes delay

        /* if (this.dateFrom.getMinutes() > 10 && this.dateFrom.getMinutes() < 40) {
            this.dateFrom.setMinutes(0);
            this.dateTo.setMinutes(10);
        }

        else if (this.dateFrom.getMinutes() > 40 && this.dateFrom.getMinutes() <= 60) {
            this.dateFrom.setMinutes(30);
            this.dateTo.setMinutes(40);
        }

        else if (this.dateFrom.getMinutes() >= 0 || this.dateFrom.getMinutes() <= 10) {
            this.dateFrom.setHours(this.dateFrom.getHours() - 1);
            this.dateTo.setHours(this.dateTo.getHours() - 1);
            this.dateFrom.setMinutes(30);
            this.dateTo.setMinutes(40);
        } */
    }

    stringDateFrom() {
        return this.dateFrom.getFullYear() + "-" + ((this.dateFrom.getMonth() + 1) < 10 ? "0" + (this.dateFrom.getMonth() + 1) : (this.dateFrom.getMonth() + 1)) + "-" + (this.dateFrom.getDate() < 10 ? "0" + this.dateFrom.getDate() : this.dateFrom.getDate()) + " " + (this.dateFrom.getHours() < 10 ? "0" + this.dateFrom.getHours() : this.dateFrom.getHours()) + ":" + (this.dateFrom.getMinutes() < 10 ? "0" + this.dateFrom.getMinutes() : this.dateFrom.getMinutes());
    }

    stringDateTo() {
        return this.dateTo.getFullYear() + "-" + ((this.dateTo.getMonth() + 1) < 10 ? "0" + (this.dateTo.getMonth() + 1) : (this.dateTo.getMonth() + 1)) + "-" + (this.dateTo.getDate() < 10 ? "0" + this.dateTo.getDate() : this.dateTo.getDate()) + " " + (this.dateTo.getHours() < 10 ? "0" + this.dateTo.getHours() : this.dateTo.getHours()) + ":" + (this.dateTo.getMinutes() < 10 ? "0" + this.dateTo.getMinutes() : this.dateTo.getMinutes());
    }
}
