'use client';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseApp from "@/utils/firebase/firebase";

export default function Home() {

  const [token, setToken] = useState('')
  const [delay, setDelay] = useState<string>('');
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
        alert(JSON.stringify({
          title: payload.notification?.title,
          body: payload.notification?.body
        }, null, 2));
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
          console.log('token -> ', currentToken)
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
    <form>
      <label>Delay</label>
      <input
        type="number"
        onChange={(e) => {
          const value = e.target.value;
          console.log(Number(value))
          setDelay(value)
        }}
        value={delay}
      />

      <label>Title</label>
      <input type="text" onChange={(e) => {
        setTitle(e.target.value)
      }} value={title}/>

      <label>Body</label>
      <input type="text" onChange={(e) => {
        setBody(e.target.value)
      }} value={body}/>
    </form>
    <button onClick={async () => {
      await fetch('/api/send-push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationToken: token,
          title: title,
          body: body,
          delay: Number(delay) ?? 0
        })
      })
    }}>Send Notification
    </button>
  </div>;
}
