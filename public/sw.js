self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const type = data.type || "default";
  let title = "Notifica";
  let options = {
    body: "Hai una nuova notifica",
    icon: "/icon.png",
  };

  if (type === "reminder") {
    title = data.title || "Promemoria";
    options.body = data.body || "Hai un evento in arrivo";
  } else if (type === "alert") {
    title = data.title || "Avviso importante";
    options.body = data.body || "Controlla subito l'app!";
  } else {
    title = data.title || title;
    options.body = data.body || options.body;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});
