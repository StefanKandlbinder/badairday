export default function getWebShare(title: string, text: string, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (navigator.share) {
      navigator.share({ title, text, url })
        .then(() => resolve())
        .catch(() => reject(new Error('Web Share fehlgeschlagen!')));
    } else {
      reject(new Error('Web Share ist nicht verfügbar!'));
    }
  });
}
