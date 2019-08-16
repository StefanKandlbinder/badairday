import getMood from '../../utilities/getMood';

export default class StationModel {
    constructor(
        type="Feature",
        geometry={},
        properties={
            provider: "",
            id: 0,
            name: "Messstation",
            reverseGeoName: "Messstation",
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
            this.properties.provider = properties.provider;
            this.properties.id = properties.id;
            this.properties.name = properties.name;
            this.properties.reverseGeoName = properties.reverseGeoName;
            this.properties.date = properties.date;
            this.properties.components = properties.components;
            this.properties.mood = properties.mood;
            this.properties.moodRGBA = getMood(properties.mood, 0.75);
            this.properties.marker = properties.marker;
            this.properties.favorized = properties.favorized;
            this.properties.notify = properties.notify;
    }
}