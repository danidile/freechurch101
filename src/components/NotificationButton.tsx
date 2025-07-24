"use client";

import { useEffect, useState } from "react";
import { LuLogs } from "react-icons/lu";
import { MdNotificationsActive } from "react-icons/md";

export default function NotificationButton() {
  const [showButton, setShowButton] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInApplePWA = isApplePWA();
    const permissionFetch = Notification?.permission;
    setPermission(permissionFetch);
    if (isInApplePWA) {
      setShowButton(true);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    console.log("Permission:", result);
    if (result === "granted") {
      setShowButton(false);
      await subscribeUserToPush();
    }
  };
  if (!showButton) return null;

  return (
    <li className="sidebar-li">
      <button onClick={requestPermission} className="sidebar-link">
        <div className="sidebar-element">
          <MdNotificationsActive className="dashboard-icon" />
          <p>
            {" "}
            Notifiche
            {permission === "granted" ? " abilitate" : " disabilitate"}{" "}
          </p>
        </div>
      </button>
    </li>
  );
}

// ✅ Utility function aggiornata
function isApplePWA(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent.toLowerCase();

  const isIOS = /iphone|ipod|ipad/.test(ua);

  const isIPadOS13Plus =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  const isSafari =
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios");

  const isStandalone =
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;

  const isMacPWASafari =
    navigator.platform === "MacIntel" && isSafari && isStandalone;

  return (
    (isIOS && isStandalone) ||
    (isIPadOS13Plus && isStandalone) ||
    isMacPWASafari
  );
}
const subscribeUserToPush = async () => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("<YOUR_PUBLIC_VAPID_KEY>"),
  });

  console.log("Push subscription:", subscription);

  // Send subscription to your Supabase DB or API route
  await fetch("/api/save-subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
