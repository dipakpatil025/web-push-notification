'use client';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseApp from "@/utils/firebase/firebase";
import { MyForm } from "@/components/my-form";

export default function Home() {


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


  function copyToClipboard() {
    navigator.clipboard.writeText(('token').toString())
             .then(() => {
               alert('Copied to clipboard')
             })
             .catch((error: string) => {
               alert(`Failed copied to clipboard ${error}`)
             });
  }


  return <div>

    <MyForm/>
  </div>;
}
