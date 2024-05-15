'use client';

import useFcmToken from "@/utils/hooks/useFcmToken";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseApp from "@/utils/firebase/firebase";

export default function Home() {

  const [token, setToken] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });

      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  async function handleAskNotifications() {
    if ("Notification" in window) {
      const permission = Notification.permission;
      if (permission === "granted") {
        console.log('granted')
      } else {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log('granted')
        } else {
          console.log('Not granted')
        }
      }

      if (permission === 'granted') {
        const messaging = getMessaging(firebaseApp);

        const currentToken = await getToken(messaging, {
          vapidKey:
            'BECY6OCKFyotjM1GkUXqLQrUXX_lwdWfd-FzV2QbCTlRbPNhVz4Y2t66B48Vq17Xp44RGAsss_z_CERZsNWEqjc',
        });
        if (currentToken) {
          setToken(currentToken)
          console.log('token -> ',currentToken)
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      }
    } else {
      console.error("NotificationsAPI not supported")
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText((token).toString())
             .then(() => {
               alert('Copied to clipboard')
             })
             .catch((error: string) => {
               alert(`Failed copied to clipboard ${error}`)
             });
  }

  return <div>
    <button onClick={handleAskNotifications}>Ask Notification</button>

    <div onClick={copyToClipboard}>{token}</div>
  </div>;
}
