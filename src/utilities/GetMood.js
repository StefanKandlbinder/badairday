import { scaleLinear } from "d3-scale";

const valueDomain = [20, 40, 60, 100, 500];
let colorRange = ['rgba(0, 121, 107, 0.75)', 'rgba(249, 168, 37, 0.75)', 'rgba(230, 81, 0, 0.75)', 'rgba(221, 44, 0, 0.75)', 'rgba(150, 0, 132, 0.75)'];

export default function getMood(value, opacity) {
    colorRange = [`rgba(0, 121, 107, ${opacity})`, `rgba(249, 168, 37, ${opacity})`, `rgba(230, 81, 0, ${opacity})`, `rgba(221, 44, 0, ${opacity})`, `rgba(150, 0, 132, ${opacity})`];

    let mood = scaleLinear()
        .domain(valueDomain)
        .range(colorRange)
        .clamp(true);

    return mood(parseInt(value, 10));

}