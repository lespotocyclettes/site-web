/*
 * Client de rechargement automatique, adapté de vite-live-preview 0.4.0 :
 * https://github.com/Shakeskeyboarde/vite-live-preview (licence Unlicense, domaine public).
 *
 * Écart avec l'original : le serveur n'est pas celui de la page. La page est le vrai site,
 * le serveur tourne sur la machine du développeur : son adresse arrive par
 * `window.__POTO_DEV_SERVER__`, que pose le chargeur de développement.
 */
const serverUrl = window.__POTO_DEV_SERVER__;
const socket = new WebSocket(serverUrl.replace(/^http/, "ws"));

socket.addEventListener("open", () => {
	console.info("[poto] Rechargement automatique branché.");
});

socket.addEventListener("message", (event) => {
	try {
		const message = JSON.parse(event.data);
		if (message?.type === "page-reload") window.location.reload();
	} catch {
		// Un message illisible ne nous concerne pas.
	}
});

socket.addEventListener("close", (event) => {
	// Une fermeture propre, c'est un changement de page ; sinon, le serveur s'est arrêté.
	if (!event.wasClean) {
		console.info(
			"[poto] Serveur de développement perdu, on attend son retour…",
		);
	}
	waitForServer().then(() => window.location.reload());
});

async function waitForServer() {
	while (true) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		try {
			// En-tête reconnu par vite-live-preview, qui y répond sans servir de page.
			await fetch(serverUrl, {
				mode: "no-cors",
				headers: { Accept: "text/x-vite-ping" },
			});
			return;
		} catch {
			// Toujours pas là.
		}
	}
}
