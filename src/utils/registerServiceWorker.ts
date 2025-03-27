import { messaging } from "../firebase"; // Firebase 메시징 객체 가져오
import { getToken } from "firebase/messaging";
// import { fcmTokenRegister } from "@apis/fcmApi";

// let count = 0;
// const retryCount = 10;
const vapidKey = import.meta.env.VITE_VAPID_KEY;

// export const registerServiceWorker = async () => {
//   try {
//     const registration: ServiceWorkerRegistration =
//       await navigator.serviceWorker.register("/pwabuilder-sw.js", {
//         scope: "firebase-messaging",
//       });

//     if (registration) {
//       return registration;
//     } else {
//       throw new Error(`registration is ${registration}`);
//     }
//   } catch (error) {
//     console.error("Service Worker registration failed:", error);
//   }
// };

async function registerReady(scriptURL: string, options?: RegistrationOptions) {
  return navigator.serviceWorker
    .register(scriptURL, options)
    .then((registration) => {
      // If there is an active worker and nothing incoming, we are done.
      const incomingSw = registration.installing || registration.waiting;
      if (registration.active && !incomingSw)
        return Promise.resolve(registration);

      // If not, wait for the newest service worker to become activated.
      return new Promise<ServiceWorkerRegistration>((fulfill, reject) => {
        if (incomingSw) {
          incomingSw.onstatechange = (evt) => {
            if ((evt.target as ServiceWorker)?.state === "activated") {
              incomingSw.onstatechange = null;
              return fulfill(registration);
            }
          };
        } else {
          reject(new Error("No incoming service worker found."));
        }
      });
    })
    .catch((err) => {
      console.error("Error registering service worker:", err);
      return Promise.reject(err);
    });
}

export async function generalSendKey() {
  try {
    const readyRegistration = await registerReady("/pwabuilder-sw.js", {
      scope: "firebase-messaging",
    });


    if (readyRegistration) {
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: readyRegistration,
      });

      if (token) {
        console.log("FCM Token:", token);
      }
    } else {
      throw new Error("token invalid");
    }
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
