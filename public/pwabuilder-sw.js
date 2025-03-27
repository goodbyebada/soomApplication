// firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js"
);

console.log("self");
console.log(self);
console.log(self.self);

self.addEventListener("install", function (e) {
  console.log("fcm service worker가 install.");

  // ServiceWorkerGlobalScope.skipWaiting() 메소드는 waiting 상태의 서비스 워커를 active 상태의 서비스 워커로 변경하도록 강제한다.
  // 제어중인 서비스 워커가 존재해도 대기 상태를 건너뛴다.
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  // console.log(self.clients);
  // e.waitUntil(self.clients.claim());
  console.log("fcm service worker가 activate.");
});

const firebaseConfig = {
  apiKey: "AIzaSyDSqU0TbdqtY8Ji67b4MeZleWcep9NAm8c",
  authDomain: "http://hy-thon-team-4.firebaseapp.com",
  projectId: "hy-thon-team-4",
  storageBucket: "hy-thon-team-4.firebasestorage.app",
  messagingSenderId: "463766640178",
  appId: "1:463766640178:web:a9833194904c7e53c60e2b",
};

firebase.initializeApp(firebaseConfig);
// 초기화

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("onBackground");
  console.log(payload);

  // TODO title || body null undefined 0 이면 안됨 노티 줘야함
  // NOTE FCM 백그라운드 undefined 메시지 추가로 오는 버그 방지 위한 코드
  if (!payload.title || !payload.content) {
    return;
  }

  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.content,
    icon: payload.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// // push 알림이 왔을시
// // TODO mac 크롬 사용시 알림을 열어야 확인 가능
// // TODO event.data.json()으로 추후 수정 예정
self.addEventListener("push", function (e) {
  console.log("push: ", e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json().data;
  const notificationTitle = resultData.title;

  //TEST용
  // const testRestID = "1";
  // const testText = "노을 사진 찍기";
  // const testURL = `/action?restId=${Number(testRestID)}&todo=${testText}`;

  const notificationOptions = {
    body: resultData.content ? resultData.content : resultData.body,
    data: {
      url: `/action?restId=${Number(resultData.restId)}&todo=${
        resultData.text
      }`,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  // console.log("push");
  // console.log(payload);
  // // const data = event.data.json(); // Assuming the server sends JSON

  // const notificationTitle = payload.title;
  // const notificationOptions = {
  //   body: payload.content,
  //   icon: payload.icon,
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// push 알림을 클릭했을시

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  console.log(event);

  const url = event.notification.data.url;

  // TODO /action/${restId}로 이동하게 할거임 url이 비워져있다면 /main으로 이동한다.
  const finalUrl = url ? url : "/main";
  event.notification.close();
  event.waitUntil(clients.openWindow(finalUrl));
});
