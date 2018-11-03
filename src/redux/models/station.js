export default class StationModel {
    constructor(provider = "",
        id = 0,
        name = "Messstation",
        date = "",
        longitude = 0,
        latitude = 0,
        components = {},
        mood = 0,
        marker = {},
        favorized = false) {
            this.provider   = provider;
            this.id         = id;
            this.name       = name;
            this.date       = date;
            this.longitude  = longitude;
            this.latitude   = latitude;
            this.components = components;
            this.mood       = mood;
            this.marker     = marker;
            this.favorized  = favorized
    }

    set setProvider(provider) {
        this.provider = provider;
    }

    set setID(id) {
        this.id = id;
    }

    set setName(name) {
        this.name = name;
    }

    set setLongitude(longitude) {
        this.longitude = longitude;
    }

    set setLatitude(latitude) {
        this.latitude = latitude;
    }

    set setComponents(components) {
        this.components = components;
    }

    set setMood(mood) {
        this.mood = mood;
    }

    set setDate(date) {
        this.date = date;
    }

    get getLongitude() {
        return this.longitude;
    }

    get getLatitude() {
        return this.latitude;
    }

    get getID() {
        return this.id;
    }

    get getName() {
        return this.name;
    }

    get getComponents() {
        return this.components;
    }

    get getMood() {
        return this.mood;
    }

    get getDate() {
        return this.date;
    }
}