"use client";

import { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";

export default function TestNotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applePWA = isApplePWA();
    const standalone = isStandalonePWA();

    // Show button only if running as PWA (standalone) but NOT Apple PWA
    if (standalone && applePWA) {
      setShowButton(true);
      setPermission(Notification.permission);
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });

        // Send subscription to your API
        await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        setPopupMessage(
          "Notifiche abilitate! Per disabilitarle vai su Impostazioni > Notifiche."
        );
      } else if (result === "denied") {
        setPopupMessage(
          "Notifiche disabilitate! Per abilitarle vai su Impostazioni > Notifiche."
        );
      } else {
        setPopupMessage("Permesso notifiche non concesso.");
      }

      setShowPopup(true);
    } catch (error) {
      console.error("Errore nella richiesta permessi notifiche:", error);
    }
  };

  const sendTestNotification = async () => {
    if (Notification.permission !== "granted") {
      alert("Permessi notifiche non concessi.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    registration.showNotification("🔔 Notifica di Test", {
      body: "Questa è una notifica locale!",
      icon: "/icon.png",
      tag: "test-notification",
    });
  };

  if (!showButton) return null;

  return (
    <>
      <li className="sidebar-li">
        {permission !== "granted" ? (
          <button onClick={requestPermission} className="sidebar-link">
            <div className="sidebar-element">
              <MdNotificationsActive className="dashboard-icon" />
              <p>Abilita notifiche</p>
            </div>
          </button>
        ) : (
          <div onClick={requestPermission} className="sidebar-link">
            <div className="sidebar-element">
              <MdNotificationsActive className="dashboard-icon" />
              <p>Notifiche abilitate.</p>
            </div>
          </div>
        )}

        {permission === "granted" && (
          <button onClick={sendTestNotification} className="sidebar-link mt-2">
            <div className="sidebar-element">
              <MdNotificationsActive className="dashboard-icon" />
              <p>Invia notifica di test</p>
            </div>
          </button>
        )}
      </li>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[#000000a0] bg-opacity-50 z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// --- Helpers ---

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

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

function isStandalonePWA() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(display-mode: standalone)").matches;
}
