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
        console.log('Foreground push notification received:', payload.data);
        let notificationTitle, notificationBody;

        if (!payload.data) return alert("Noo data received")

        if (payload.data.title && payload.data.body) {
          notificationTitle = `FCM: ${payload.data.title}`;
          notificationBody = `FCM: ${payload.data.body}`;
        } else if (payload.data['pinpoint.notification.title'] && payload.data['pinpoint.notification.body']) {
          notificationTitle = `AWS: ${payload.data['pinpoint.notification.title']}`;
          notificationBody = `AWS: ${payload.data['pinpoint.notification.body']}`;
        } else {
          notificationTitle = 'Default Title';
          notificationBody = 'Default Body';
        }

        alert(JSON.stringify({
          title: notificationTitle,
          body: notificationBody
        }, null, 2));

      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  return <div>
    <MyForm/>
  </div>;
}
