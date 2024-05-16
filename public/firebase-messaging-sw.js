importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBt8fb2_RPtdR8oRVeTK-BM7OXJGXC6KJk',
  authDomain: 'push-notification-55b39.firebaseapp.com',
  projectId: 'push-notification-55b39',
  storageBucket: 'push-notification-55b39.appspot.com',
  messagingSenderId: '363552076788',
  appId: '1:363552076788:web:270f60cf305ade428fbfa1',
  measurementId: 'G-7Y2ND4TSCR',
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message either AWS/FCM ', payload.data);

    let notificationTitle, notificationBody;

    if (payload.data.title && payload.data.body) {
        notificationTitle = `FCM: ${payload.data.title}`;
        notificationBody = `FCM: ${payload.data.body}`;
    }
    else if (payload.data['pinpoint.notification.title'] && payload.data['pinpoint.notification.body']) {
        notificationTitle = `AWS: ${payload.data['pinpoint.notification.title']}`;
        notificationBody = `AWS: ${payload.data['pinpoint.notification.body']}`;
    }
    else {
        notificationTitle = 'Default Title';
        notificationBody = 'Default Body';
    }

    const notificationOptions = {
        body: notificationBody,
        icon: './icon-192x192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
