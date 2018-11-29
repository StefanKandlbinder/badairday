export default function getGeoLocation() {
    return new Promise(function (resolve, reject) {
        if (!navigator.geolocation) {
            reject(Error("Geolocation ist leider nicht verfügbar!"));
        }

        else {
            let options = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            
            const success = position => {
                resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
            }

            const error = error => {
                reject(Error("Geolocation ist für diese Seite blockiert!"));
            }
            
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    });
}