export default function getErrorMessage(status, provider) {
    let message = "Oh Nein! ";

    switch (provider) {
        case "luftdaten":
            message += "Luftdaten"
            break;
        case "upperaustria":
            message += "Oberösterreich"
            break;
        default:
            break;
    }

    switch (status) {
        case 400:
        case 403:
        case 404:
        case 405:
            message += " ist leider gerade nicht erreichbar!"
            break;
        default:
            message += " ist leider gerade nicht erreichbar!";
            break;
    }

    return message
}