import getMood from '../../utilities/getMood';

export default class StationModel {
    constructor(
        type="Feature",
        geometry={},
        properties={
            provider: "",
            id: 0,
            name: "Messstation",
            date: "",
            components: {},
            mood: 0,
            moodRGBA: "rgba(70, 70, 70, 0.75)",
            marker: {},
            favorized: false,
            notify: false,
        }) {
            this.type       = type;
            this.geometry   = geometry
            this.properties = properties;
            this.properties.moodRGBA = getMood(properties.mood, 0.75);
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

    set setMoodRGBA(moodRGBA) {
        this.moodRGBA = moodRGBA;
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

    get getMoodRGBA() {
        return this.moodRGBA;
    }

    get getDate() {
        return this.date;
    }
}