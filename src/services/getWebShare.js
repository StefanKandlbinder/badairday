export default function getWebShare(title, text, url) {
    return new Promise(function (resolve, reject) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            })
                .then(() => resolve())
                .catch((error) => reject(Error("Web Share fehlgeschlagen!")));
        }

        else {
            reject(Error("Web Share ist nicht verfügbar!"));
        }
    });
}