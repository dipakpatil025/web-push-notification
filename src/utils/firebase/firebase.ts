import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBt8fb2_RPtdR8oRVeTK-BM7OXJGXC6KJk',
  authDomain: 'push-notification-55b39.firebaseapp.com',
  projectId: 'push-notification-55b39',
  storageBucket: 'push-notification-55b39.appspot.com',
  messagingSenderId: '363552076788',
  appId: '1:363552076788:web:270f60cf305ade428fbfa1',
  measurementId: 'G-7Y2ND4TSCR',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp