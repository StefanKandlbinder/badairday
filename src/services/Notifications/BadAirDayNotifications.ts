export default class BadAirDayNotifications {
  private convertedVapidKey: Uint8Array;

  constructor() {
    this.convertedVapidKey = this.urlBase64ToUint8Array(
      import.meta.env.VITE_PUBLIC_VAPID_KEY ?? ''
    );
  }

  requestPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!('Notification' in window) || !navigator.serviceWorker) {
        reject(false);
        return;
      }
      Notification.requestPermission().then((result) => {
        if (result === 'granted') resolve(true);
        else reject(false);
      });
    });
  }

  subscribeUser(): Promise<PushSubscription> {
    return navigator.serviceWorker.ready.then((registration) =>
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.convertedVapidKey,
      })
    );
  }

  sendSubscription(subscription: PushSubscription): Promise<{ name: string }> {
    return fetch(`${import.meta.env.VITE_API_URL}subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json());
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }
}
