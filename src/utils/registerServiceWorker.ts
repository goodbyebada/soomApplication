import { messaging } from "../firebase"; // Firebase 메시징 객체 가져오
import { getToken } from "firebase/messaging";
// import { fcmTokenRegister } from "@apis/fcmApi";

// let count = 0;
// const retryCount = 10;

export const registerServiceWorker = async () => {
  try {
    const registration: ServiceWorkerRegistration =
      await navigator.serviceWorker.register("/pwabuilder-sw.js", {
        scope: "firebase-messaging",
      });

    if (registration) {
      return registration;
    } else {
      throw new Error(`registration is ${registration}`);
    }
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
};

export async function generalSendKey() {
  try {
    const registration = await registerServiceWorker();

    const vapidKey = import.meta.env.VITE_VAPID_KEY;

    // registration이 있다면
    if (registration) {
      //그래도 에러 나야함 activate 되지 않았다면

      console.log(registration);
      console.log(registration.active);
      if (registration.active) {
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log("FCM Token:", token);
        } else {
          throw new Error("token invalid");
        }
      }
    }

    // // active의 상태
    // if (registration?.active) {
    //   console.log("active.state");
    //   console.log(registration?.active.state);
    //   const token = await getToken(messaging, {
    //     vapidKey,
    //     serviceWorkerRegistration: registration,
    //   });

    //   if (token) {
    //     console.log("FCM Token:", token);
    //   }

    //   // const response = await fcmTokenRegister({ fcmToken: token });
    // } else {
    //   throw new Error("token invalid");
    // }
  } catch (e) {
    console.error(e);
  }
}

export async function sendKeyToServer(recursiveCount: number) {
  recursiveCount;
  // try {
  //   if (!registration) {
  //     await registerServiceWorker();
  //     await sendKeyToServer(0);
  //     return;
  //   }
  //   const vapidKey = import.meta.env.VITE_VAPID_KEY;
  //   // FCM 토큰 요청
  //   const token = await getToken(messaging, {
  //     vapidKey,
  //     serviceWorkerRegistration: registration,
  //   });
  //   if (token) {
  //     console.log("FCM Token:", token);
  //     // const response = await fcmTokenRegister({ fcmToken: token });
  //     // console.log(response);
  //   } else {
  //     throw new Error("token invalid");
  //   }
  // } catch {
  //   console.error("No registration token available.");
  //   if (recursiveCount < retryCount) {
  //     sendKeyToServer(recursiveCount + 1);
  //   }
  // }
}
