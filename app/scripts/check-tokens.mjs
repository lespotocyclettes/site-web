/*
 * Un var(--x) sans déclaration ne casse rien : il rend une valeur invalide, en silence.
 * Ce script refuse ce silence, et vérifie au passage que le manifeste pointe sur des
 * fichiers qui existent, et que le styleguide affiche toutes les couleurs.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_ROOT = resolve(APP_ROOT, "src");
const STYLES = resolve(SOURCE_ROOT, "styles");
const MANIFEST = resolve(STYLES, "index.css");
const SEMANTIC = resolve(STYLES, "semantic.css");
const STYLEGUIDE = resolve(APP_ROOT, "styleguide/index.html");

/**
 * Les molettes publiques passées depuis le JSX (le HTML écrit dans le code React) ne sont
 * jamais déclarées en CSS : elles ont un défaut.
 */
const REFERENCE_WITHOUT_FALLBACK = /var\(\s*(--[a-z0-9_-]+)\s*\)/gi;
const DECLARATION = /^\s*(--[a-z0-9_-]+)\s*:/gim;
const IMPORT = /@import\s+url\(\s*"([^"]+)"\s*\)/g;
const COLOR_DECLARATION = /^\s*--(color-[a-z0-9-]+)\s*:/gim;
const STYLEGUIDE_COLOR = /"(color-[a-z0-9-]+)"/g;

const failures = [];

const manifest = await readFile(MANIFEST, "utf8");
const imported = collectFirstGroups(manifest, IMPORT);

for (const relativePath of imported) {
	const exists = await isFile(resolve(STYLES, relativePath));
	if (!exists) {
		failures.push(`le manifeste importe ${relativePath}, qui n'existe pas`);
	}
}

const files = [...(await collectCssFiles(SOURCE_ROOT)), STYLEGUIDE];
const declared = new Set();
const referenced = new Map();

for (const file of files) {
	const source = await readFile(file, "utf8");
	for (const name of collectFirstGroups(source, DECLARATION))
		declared.add(name);
	for (const name of collectFirstGroups(source, REFERENCE_WITHOUT_FALLBACK)) {
		const isFirstSighting = !referenced.has(name);
		if (isFirstSighting) referenced.set(name, relative(APP_ROOT, file));
	}
}

for (const [name, file] of referenced) {
	if (!declared.has(name)) {
		failures.push(`${file} : ${name} est utilisé sans être déclaré nulle part`);
	}
}

const semantic = await readFile(SEMANTIC, "utf8");
const styleguide = await readFile(STYLEGUIDE, "utf8");
const colors = new Set(collectFirstGroups(semantic, COLOR_DECLARATION));
const shown = new Set(collectFirstGroups(styleguide, STYLEGUIDE_COLOR));

for (const color of colors) {
	if (!shown.has(color)) {
		failures.push(
			`styleguide/index.html : --${color} manque dans COLOR_TOKENS`,
		);
	}
}

for (const color of shown) {
	if (!colors.has(color)) {
		failures.push(
			`styleguide/index.html : COLOR_TOKENS liste --${color}, absent de semantic.css`,
		);
	}
}

console.log(
	`${imported.length} imports, ${declared.size} tokens déclarés, ${referenced.size} référencés sans repli, ${colors.size} couleurs déclarées.`,
);

if (failures.length > 0) {
	console.error(`\n${failures.length} problème(s) :`);
	for (const failure of failures) console.error(`  ${failure}`);
	process.exit(1);
}

console.log("Tout var() sans repli pointe sur une déclaration.");

async function collectCssFiles(directory) {
	const entries = await readdir(directory, {
		withFileTypes: true,
		recursive: true,
	});
	return entries
		.filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
		.map((entry) => resolve(entry.parentPath, entry.name));
}

function collectFirstGroups(text, pattern) {
	return [...text.matchAll(pattern)].map((match) => match[1]);
}

async function isFile(path) {
	try {
		return (await stat(path)).isFile();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
