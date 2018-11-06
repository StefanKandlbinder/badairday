export default class Component {
    constructor(type = "", value = 0, unit = "", update=true) {
        this.type = type;
        this.value = Number(value.toFixed(2));
        this.unit = unit;
        this.update = update;
    }

    set setType(type) {
        this.type = type;
    }

    get getType() {
        return this.type;
    }

    set setValue(value) {
        this.value = value;
    }

    get getValue() {
        return this.value;
    }

    set setUnit(unit) {
        this.unit = unit;
    }

    get getUnit() {
        return this.unit;
    }
    
    set setUpdate(update) {
        this.update = update;
    }

    get getUpdate() {
        return this.update;
    }
}