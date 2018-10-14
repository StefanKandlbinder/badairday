export default class GetDateFromTo {
    constructor() {
        this.dateFrom = new Date();
        this.dateTo = new Date();
        
        this.dateFrom.setMinutes(this.dateFrom.getMinutes() - 100);
    }

    stringDateFrom() {
        return this.dateFrom.getFullYear() + "-" + ((this.dateFrom.getMonth() + 1) < 10 ? "0" + (this.dateFrom.getMonth() + 1) : (this.dateFrom.getMonth() + 1)) + "-" + (this.dateFrom.getDate() < 10 ? "0" + this.dateFrom.getDate() : this.dateFrom.getDate()) + " " + (this.dateFrom.getHours() < 10 ? "0" + this.dateFrom.getHours() : this.dateFrom.getHours()) + ":" + (this.dateFrom.getMinutes() < 10 ? "0" + this.dateFrom.getMinutes() : this.dateFrom.getMinutes());
    }

    stringDateTo() {
        return this.dateTo.getFullYear() + "-" + ((this.dateTo.getMonth() + 1) < 10 ? "0" + (this.dateTo.getMonth() + 1) : (this.dateTo.getMonth() + 1)) + "-" + (this.dateTo.getDate() < 10 ? "0" + this.dateTo.getDate() : this.dateTo.getDate()) + " " + (this.dateTo.getHours() < 10 ? "0" + this.dateTo.getHours() : this.dateTo.getHours()) + ":" + (this.dateTo.getMinutes() < 10 ? "0" + this.dateTo.getMinutes() : this.dateTo.getMinutes());
    }
}