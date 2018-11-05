export default class Component {
    constructor(type = "", value = 0, unit = "") {
        this.type = type;
        this.value = parseFloat(value.toFixed(2));
        this.unit = unit;
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
}