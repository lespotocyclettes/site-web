import { expect, test } from "vitest";
import { getPreviousHash, listenToEntryOrigins } from "./entry-origin";

/*
 * Un historique factice plutôt que celui de happy-dom, qui livre hashchange avec un temps
 * de retard et perd l'état d'une entrée quand on y revient. Ce qu'on teste ici, c'est notre
 * règle : l'origine s'écrit une fois, à l'arrivée. L'enchaînement réel des événements
 * appartient au navigateur, et se vérifie à la main.
 */
test("une entrée ouverte directement n'a pas d'origine", () => {
	const browser = createFakeBrowser();

	expect(getPreviousHash(browser.history)).toBeNull();
});

test("une nouvelle entrée retient l'adresse d'où l'on vient", () => {
	const browser = createFakeBrowser();

	browser.arrive({ from: "#recherche?q=peugeot" });

	expect(getPreviousHash(browser.history)).toBe("#recherche?q=peugeot");
});

/* En revenant sur une entrée, hashchange part aussi, avec l'adresse qu'on vient de quitter. */
test("revenir sur une entrée ne change pas son origine", () => {
	const browser = createFakeBrowser();
	browser.arrive({ from: "#recherche?q=peugeot" });

	browser.arrive({ from: "#enregistrement" });

	expect(getPreviousHash(browser.history)).toBe("#recherche?q=peugeot");
});

/* navigate(…, { replace }) émet un hashchange sans ancienne adresse. */
test("un remplacement d'adresse n'est pas une arrivée", () => {
	const browser = createFakeBrowser();

	browser.arrive({ from: "" });

	expect(getPreviousHash(browser.history)).toBeNull();
});

/** Une seule entrée d'historique, et de quoi lui envoyer des hashchange. */
function createFakeBrowser() {
	const events = new EventTarget();
	const history = {
		state: null as unknown,
		replaceState(state: unknown) {
			history.state = state;
		},
	};
	listenToEntryOrigins({
		history,
		addEventListener: events.addEventListener.bind(events),
		removeEventListener: events.removeEventListener.bind(events),
	});

	return {
		history,
		/** `from` est le # de l'adresse quittée, ou "" pour un événement sans ancienne adresse. */
		arrive({ from }: { from: string }) {
			const oldURL = from === "" ? "" : `http://localhost/${from}`;
			events.dispatchEvent(new HashChangeEvent("hashchange", { oldURL }));
		},
	};
}
