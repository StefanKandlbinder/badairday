export default class BadAirDayNotifications {
    constructor() {
        this.convertedVapidKey = this.urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY);
    }

    requestPermission() {
        if ('Notification' in window && navigator.serviceWorker) {
            // Display the UI to let the user toggle notifications
            Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status);
            });
        }
    }

    displayNotification() {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.getRegistration().then(function (reg) {
                var options = {
                    body: 'Here is a notification body!',
                    icon: 'images/example.png',
                    vibrate: [100, 50, 100],
                    data: {
                        dateOfArrival: Date.now(),
                        primaryKey: 1
                    },
                    actions: [
                        {
                            action: 'explore', title: 'Explore this new world',
                            icon: 'images/checkmark.png'
                        },
                        {
                            action: 'close', title: 'Close notification',
                            icon: 'images/xmark.png'
                        },
                    ]
                };
                reg.showNotification('Hello world!', options);
            });
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4)
        // eslint-disable-next-line
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    sendSubscription(subscription) {
        return fetch(`${process.env.REACT_APP_API_URL}/notifications/subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    subscribeUser() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                if (!registration.pushManager) {
                    console.log('Push manager unavailable.')
                    return
                }

                registration.pushManager.getSubscription().then(existedSubscription => {
                    if (existedSubscription === null) {
                        console.log('No subscription detected, make a request.')
                        registration.pushManager.subscribe({
                            applicationServerKey: this.convertedVapidKey,
                            userVisibleOnly: true,
                        }).then(newSubscription => {
                            console.log('New subscription added.')
                            this.sendSubscription(newSubscription)
                        }).catch(function (e) {
                            if (Notification.permission !== 'granted') {
                                console.log('Permission was not granted.')
                            } else {
                                console.error('An error ocurred during the subscription process.', e)
                            }
                        })
                    } else {
                        console.log('Existed subscription detected.')
                        this.sendSubscription(existedSubscription)
                    }
                })
            })
                .catch(function (e) {
                    console.error('An error ocurred during Service Worker registration.', e)
                })
        }
    }
}