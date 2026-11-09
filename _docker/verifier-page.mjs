// Ouvre chaque page du site servi par le conteneur et echoue en cas d'erreur
// de console (dont les blocages de la Content-Security-Policy) ou de ressource introuvable.
// Usage : node _docker/verifier-page.mjs http://127.0.0.1:8080
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:8080";
const pages = [
  "/clipotheque/",
  "/clipotheque/cgu.html",
  "/clipotheque/cgv.html",
  "/clipotheque/confidentialite.html",
  "/clipotheque/mentions-legales.html",
  "/clipotheque/remboursement.html",
  "/clipotheque/signalement.html",
];

const navigateur = await chromium.launch({ channel: "chrome" });
const erreurs = [];
for (const chemin of pages) {
  const page = await navigateur.newPage();
  page.on("console", (m) => { if (m.type() === "error") erreurs.push(`${chemin} : ${m.text()}`); });
  page.on("pageerror", (e) => erreurs.push(`${chemin} : ${e.message}`));
  page.on("response", (r) => { if (r.status() >= 400) erreurs.push(`${chemin} : ${r.status()} ${r.url()}`); });
  await page.goto(base + chemin, { waitUntil: "networkidle" });
  await page.close();
  console.log(`OK ${chemin}`);
}
await navigateur.close();

if (erreurs.length) {
  console.error(erreurs.join("\n"));
  process.exit(1);
}
console.log("Aucune erreur de console ni ressource manquante.");
