export function detectDisplayMode() {
  if (typeof window === "undefined") return;

  const updateDisplayMode = () => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const mode = isStandalone ? "standalone" : "browser";
    document.documentElement.setAttribute("data-display-mode", mode);
  };

  updateDisplayMode();
  window.addEventListener("DOMContentLoaded", updateDisplayMode);
}
