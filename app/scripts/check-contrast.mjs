/*
 * Vérifie que chaque paire texte / fond du design system atteint son seuil WCAG.
 * Les paires sont listées à la main : c'est le contrat, il doit se lire et se greper.
 */
import { readFile } from "node:fs/promises";

/** Texte normal, WCAG 1.4.3. */
const AA_TEXT = 4.5;
/** Contour porteur de sens, WCAG 1.4.11. */
const AA_NON_TEXT = 3;

const PAIRS = [
	{
		text: "color-text-heading",
		background: "color-surface-page",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-heading",
		background: "color-surface-raised",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-body",
		background: "color-surface-page",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-body",
		background: "color-surface-raised",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-muted",
		background: "color-surface-page",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-muted",
		background: "color-surface-raised",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-on-section",
		background: "color-surface-section",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-on-accent",
		background: "color-accent",
		threshold: AA_TEXT,
	},
	{
		text: "color-text-on-danger",
		background: "color-danger",
		threshold: AA_TEXT,
	},
	{ text: "color-link", background: "color-surface-page", threshold: AA_TEXT },
	{
		text: "color-link",
		background: "color-surface-raised",
		threshold: AA_TEXT,
	},
	{
		text: "color-border-strong",
		background: "color-surface-page",
		threshold: AA_NON_TEXT,
	},
	{
		text: "color-border-strong",
		background: "color-surface-raised",
		threshold: AA_NON_TEXT,
	},
	{
		text: "color-focus-ring",
		background: "color-surface-page",
		threshold: AA_NON_TEXT,
	},
	{
		text: "color-focus-ring",
		background: "color-surface-raised",
		threshold: AA_NON_TEXT,
	},
];

const HEX = "#[0-9a-fA-F]{6}";
const DECLARATION = new RegExp(
	`--([a-z0-9-]+):\\s*(light-dark\\(\\s*${HEX}\\s*,\\s*${HEX}\\s*\\)|${HEX}|var\\(--[a-z0-9-]+\\))\\s*;`,
);

function toLinear(channel) {
	const ratio = channel / 255;
	return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(hex) {
	const [red, green, blue] = [1, 3, 5].map((offset) =>
		Number.parseInt(hex.slice(offset, offset + 2), 16),
	);
	return (
		0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue)
	);
}

function getContrastRatio(foreground, background) {
	const [lighter, darker] = [
		getRelativeLuminance(foreground),
		getRelativeLuminance(background),
	].sort((a, b) => b - a);
	return (lighter + 0.05) / (darker + 0.05);
}

/** Une déclaration donne sa valeur claire et sa valeur sombre, identiques hors light-dark(). */
function splitByTheme(value) {
	const pair = value.match(
		new RegExp(`light-dark\\(\\s*(${HEX})\\s*,\\s*(${HEX})\\s*\\)`),
	);
	if (pair) return { light: pair[1], dark: pair[2] };
	return { light: value, dark: value };
}

function parseTokens(css) {
	const light = {};
	const dark = {};

	for (const line of css.split("\n")) {
		const declaration = line.match(DECLARATION);
		if (!declaration) continue;

		const [name, value] = [declaration[1], declaration[2]];
		const byTheme = splitByTheme(value);
		light[name] = byTheme.light;
		dark[name] = byTheme.dark;
	}

	return { light: resolveAliases(light), dark: resolveAliases(dark) };
}

/** Un token peut pointer vers un autre : on suit la chaîne jusqu'à la valeur littérale. */
function resolveAliases(tokens) {
	const resolved = {};

	for (const name of Object.keys(tokens)) {
		let value = tokens[name];
		let hops = 0;

		while (value?.startsWith("var(") && hops < 10) {
			value = tokens[value.slice(6, -1)];
			hops += 1;
		}

		if (value?.startsWith("#")) resolved[name] = value;
	}

	return resolved;
}

const css = await readFile(
	new URL("../src/styles/semantic.css", import.meta.url),
	"utf8",
);
const themes = parseTokens(css);
const failures = [];

for (const [themeName, tokens] of Object.entries(themes)) {
	for (const pair of PAIRS) {
		const text = tokens[pair.text];
		const background = tokens[pair.background];

		if (!text || !background) {
			failures.push(
				`${themeName} : token manquant pour ${pair.text} sur ${pair.background}`,
			);
			continue;
		}

		const ratio = getContrastRatio(text, background);
		const passes = ratio >= pair.threshold;
		if (!passes) {
			failures.push(
				`${themeName} : ${pair.text} sur ${pair.background} = ${ratio.toFixed(2)}:1 (seuil ${pair.threshold})`,
			);
		}

		console.log(
			`${(passes ? "ok" : "ÉCHEC").padEnd(6)} ${themeName.padEnd(5)} ${pair.text} / ${pair.background} : ${ratio.toFixed(2)}:1`,
		);
	}
}

if (failures.length > 0) {
	console.error(`\n${failures.length} paire(s) sous le seuil :`);
	for (const failure of failures) console.error(`  ${failure}`);
	process.exit(1);
}

console.log("\nToutes les paires atteignent leur seuil.");
