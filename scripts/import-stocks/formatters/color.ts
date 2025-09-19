import type { Couleur } from "../types.ts";

export function colorFormatter(color: string | number | undefined): Couleur[] {
	const replacements: Record<string, Couleur | Couleur[]> = {
		"bleu turquoise": ["bleu", "turquoise"],
		turquoise: ["bleu", "turquoise"],
		"gris métal": ["gris", "gris métal"],
		"rose fluo": ["rose", "rose fluo"],
		"gris bleu": ["gris", "gris bleu"],
		"rouge framboise": ["rouge", "rouge framboise"],
		"rouge (repeint)": ["rouge", "repeint"],
		"vieux rose": ["rose", "vieux rose"],
		"pain brulé": ["brun", "pain brulé"],
		"gris  foncé": ["gris", "gris foncé"],
		"bleu clair": ["bleu", "bleu clair"],
		camouflage: ["vert", "camouflage"],
		"vert fluo": ["vert", "vert fluo"],
		"vert bleu": ["vert", "vert bleu"],
		"gris argent": ["gris", "gris argent"],
		alu: ["gris", "alu"],
		"bleu nuit": ["bleu", "bleu nuit"],
	};

	return String(color ?? "")
		.split(/ et |\+/)
		.map((c) => c.trim().toLocaleLowerCase())
		.flatMap((c) => replacements[c] ?? c)
		.filter((c) => c);
}
