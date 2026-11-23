import { expect, test } from "vitest";
import { getBackLink } from "./back-link";

const TARGET = "#recherche?statut=à+traiter";

test("arrivé de l'écran cible, le retour remonte l'historique jusqu'à lui", () => {
	const previousHash = "#recherche?q=peugeot&statut=sorti";

	expect(getBackLink(TARGET, { previousHash })).toEqual({
		kind: "history-back",
		href: previousHash,
	});
});

test.each([
	["un lien ouvert directement", null],
	["une entrée sans origine notée", undefined],
	["un autre écran", "#enregistrement"],
	["un écran au nom proche", "#recherches"],
])("arrivé par %s, le retour ouvre la cible", (_, previousHash) => {
	expect(getBackLink(TARGET, { previousHash })).toEqual({
		kind: "navigate",
		href: TARGET,
	});
});
