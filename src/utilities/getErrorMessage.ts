export default function getErrorMessage(status: number | undefined, provider: string): string {
  let message = '';

  switch (provider) {
    case 'luftdaten':
      message += 'Luftdaten';
      break;
    case 'upperaustria':
      message += 'Oberösterreich';
      break;
  }

  switch (status) {
    case 400:
    case 403:
    case 404:
    case 405:
    case 500:
      message += ' liefert derzeit keine aktuellen Daten!';
      break;
    default:
      message += ' liefert derzeit keine aktuellen Daten';
  }

  if (!navigator.onLine) {
    message = 'Es besteht derzeit keine Internetverbindung!';
  }

  return message;
}
