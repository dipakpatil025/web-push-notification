'use client';

import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import firebaseApp from "@/utils/firebase/firebase";
import { MyForm } from "@/components/my-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {


  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);

      const unsubscribe = onMessage(messaging, (payload) => {

        let notificationTitle, notificationBody;

        if (!payload.data) return toast.error("No payload data available")

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

        toast.success(JSON.stringify({
          title: notificationTitle,
          body: notificationBody
        }, null, 2));
      });

      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return <div>

    <MyForm/>
    <ToastContainer />
  </div>;
}
