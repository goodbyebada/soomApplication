// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbuPAl1pe1KJNF7F3XHZu4jgUVlWhZ76M",
  authDomain: "soom-refactor.firebaseapp.com",
  projectId: "soom-refactor",
  storageBucket: "soom-refactor.firebasestorage.app",
  messagingSenderId: "957533905906",
  appId: "1:957533905906:web:93f4b3b5db5edc77f3416b",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(firebaseApp);

export async function requestPermission() {
  const permission = await Notification.requestPermission();

  if (permission === "denied") {
    alert("푸시 알림을 허용하려면 브라우저 설정에서 알림을 활성화해 주세요.");
  }
  console.log(permission);
}

requestPermission();
