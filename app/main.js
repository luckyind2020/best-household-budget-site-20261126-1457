// Hearth Budget — entry point: boots the app once the page is ready.
import { initApp } from "./app.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
