export default function getGeoLocation() {
    console.log(navigator.geolocation);
    
    /* if (!navigator.geolocation) {
        return Error("Geolocation ist leider nicht verfügbar!");
    } */

    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position) {
            if (position.coords) {
                resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
            }
            else {
                reject(Error("Geolocation ist leider nicht verfügbar!"));
            }
        });
    });
}