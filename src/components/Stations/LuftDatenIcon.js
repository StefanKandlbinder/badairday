import L from 'leaflet';

export function LuftDatenIcon(props) {
    return L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" 
            class="" viewBox="0 0 24 24"
            data-marker-id="${props.properties.id}"
            style="fill: ${props.properties.moodRGBA}">
            <use xlink:href="#airSVGLuftdatenMarker"></use>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg"
                data-notify-id="${props.properties.id}"
                fill="${props.properties.notify ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                viewBox="0 0 24 24"
                class="air__stations-notified-icon">
                <use xlink:href="#airSVGNotify"></use>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg"
                data-favorized-id="${props.properties.id}"
                fill="${props.properties.favorized ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                viewBox="0 0 24 24"
                class="air__stations-favorized-icon">
                <use xlink:href="#airSVGFavorize"></use>
            </svg>`,
        className: "air__stations-luftdaten-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });     
}