export default function getGeoLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position) {
            resolve({lat: position.coords.latitude, lng: position.coords.longitude});
        });
    });
}