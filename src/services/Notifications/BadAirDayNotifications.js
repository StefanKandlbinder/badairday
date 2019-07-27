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
        return new Promise((resolve, reject) => {
            let newSubscription = {
                subscription
            }

            return fetch(`https://badairday22.firebaseio.com/subscriptions.json`, {
                method: 'POST',
                body: JSON.stringify(newSubscription),
                headers: {
                    'Content-Type': 'application/json'
                }
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log('New Subscription added to Database:', JSON.stringify(response));

                        fetch(`${process.env.REACT_APP_API_URL}/notifications/subscribe`, {
                            method: 'POST',
                            body: JSON.stringify(newSubscription),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                
                        resolve(response);
                })
                .catch(error => {
                    console.error('Error:', error)
                    reject(Error("Couldn't add subscription do database: ", error));
                });
        });
    }

    subscribeUser() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    if (!registration.pushManager) {
                        console.log('Push manager unavailable.')
                        reject(Error("Push Manager nicht verfügbar"));
                        return
                    }

                    console.log(registration.pushManager);

                    registration.pushManager.getSubscription().then(existedSubscription => {
                        if (existedSubscription === null) {
                            console.log('No subscription detected, make a request.')
                            registration.pushManager.subscribe({
                                applicationServerKey: this.convertedVapidKey,
                                userVisibleOnly: true,
                            }).then(newSubscription => {
                                console.log('New subscription added.');
                                return resolve(newSubscription);
                                // this.sendSubscription(newSubscription, notifiedStations)
                            }).catch(function (e) {
                                if (Notification.permission !== 'granted') {
                                    console.log('Permission was not granted.');
                                    reject(Error("Permission not granted"));
                                } else {
                                    console.error('An error ocurred during the subscription process.', e);
                                    reject(Error('An error ocurred during the subscription process.', e));
                                }
                            })
                        } else {
                            console.log('Existed subscription detected: ', existedSubscription);
                            // reject(Error('Existed subscription detected.'));
                            // this.sendSubscription(existedSubscription, notifiedStations);
                        }
                    })
                })
                    .catch(function (e) {
                        console.error('An error ocurred during Service Worker registration.', e)
                    })
            }
        });


    }

    getSubscription() {
        let subscription = false;

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                if (!registration.pushManager) {
                    console.log('Push manager unavailable.')
                    return
                }

                registration.pushManager.getSubscription().then(existedSubscription => {
                    if (existedSubscription !== null) {
                        console.log('Existed subscription detected: ', existedSubscription)
                        subscription = true;
                    }
                    else {
                        return
                    }
                })
            })
                .catch(function (e) {
                    console.error('An error ocurred during Service Worker registration.', e)
                })
        }

        return subscription;
    }
}