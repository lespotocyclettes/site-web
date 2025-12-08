import type { Structure } from "../types.ts";

export function pneuFormatter(
	value: string | number | undefined,
): Structure["pneu"] | undefined {
	if (!value) return undefined;

	const valueAsString = String(value)
		.toLocaleLowerCase()
		.replaceAll(",", ".")
		.replaceAll("’’", '"')
		.replaceAll("''", '"')
		.replaceAll("‘’", '"')
		.replaceAll(/\s+"/g, '"');

	switch (valueAsString) {
		case "sans":
		case "manque":
			return undefined;
	}

	// valeur exprimée sous la forme "diametre x largeur"
	let [diametre, largeur] = valueAsString.split("x");
	let indicateurDiametreInterne: "a" | "b" | "c" | undefined = undefined;

	if (diametre === "(53-559)") {
		diametre = '26"';
		largeur = "2.10";
	}

	diametre = diametre?.trim();
	// Remove "a", "b" or "c" at the end (ex: "28c"). C'est l'indicateur du diamètre intérieur du pneu
	if (diametre?.match(/a|b|c$/)) {
		indicateurDiametreInterne = diametre.at(-1) as "a" | "b" | "c";
		diametre = diametre.slice(0, -1).trim();
	}

	largeur = largeur?.trim();
	// Remove "a", "b" or "c" at the end (ex: "28c"). C'est l'indicateur du diamètre intérieur du pneu
	if (largeur?.match(/a|b|c$/)) {
		indicateurDiametreInterne = largeur.at(-1) as "a" | "b" | "c";
		largeur = largeur.slice(0, -1).trim();
	}

	return {
		diametre: diametreFormatter(diametre),
		indicateurDiametreInterne,
		largeur: largeurFormatter(largeur),
	};
}

function diametreFormatter(diametre: string | undefined) {
	if (!diametre) return undefined;

	// Diametre en pouces, ex: "26". On rajoute l'unité (")
	if (diametre.match(/^\d\d$/)) {
		return `${diametre}"`;
	}

	switch (diametre) {
		case "650b":
			return "650";
		default:
			return diametre;
	}
}

function largeurFormatter(largeur: string | undefined) {
	let width = largeur?.trim();
	// Remove "a", "b" or "c" at the end (ex: "28c"). C'est l'indicateur du diamètre intérieur du pneu
	if (width?.match(/a|b|c$/)) width = width.slice(0, -1).trim();
	if (!width) return undefined;

	const widthAsNumber = Number(width);
	if (Number.isNaN(widthAsNumber)) {
		console.log("impossible à parser : ", width);
	}

	// largeur en pouces, ex: "1.75". On rajoute l'unité (1.75")
	if (widthAsNumber < 10) {
		// par convention, il y a 2 à 3 chiffres après la virgule
		// on arrondi à 3 chiffres apres la virgule
		const widthAsNumberString = widthAsNumber.toFixed(3);

		// et si on peut n'en garder que 2, on le fait
		if (widthAsNumberString.match(/\.\d\d0$/)) {
			return `${widthAsNumberString.slice(0, -1)}"`;
		}

		return `${widthAsNumberString}"`;
	}

	// largeur en mm
	return width;
}
