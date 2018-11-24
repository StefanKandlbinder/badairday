export default function getGeoLocation() {
    return new Promise(function (resolve, reject) {
        if (!navigator.geolocation) {
            reject(Error("Geolocation ist leider nicht verfügbar!"));
        }

        else {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
            }, (error) => {
                reject(Error("Geolocation ist für diese Seite blockiert!"));
            } );
        }
    });
}