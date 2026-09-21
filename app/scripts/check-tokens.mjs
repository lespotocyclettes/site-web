/*
 * Un var(--x) sans déclaration ne casse rien : il rend une valeur invalide, en silence.
 * Ce script refuse ce silence, et vérifie au passage que le manifeste pointe sur des
 * fichiers qui existent.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const STYLES = new URL("../src/styles/", import.meta.url);
const MANIFEST = new URL("index.css", STYLES);

/** Les molettes passées depuis le JSX ne sont jamais déclarées en CSS : elles ont un défaut. */
const REFERENCE_WITHOUT_FALLBACK = /var\(\s*(--[a-z0-9_-]+)\s*\)/gi;
const DECLARATION = /^\s*(--[a-z0-9_-]+)\s*:/gim;
const IMPORT = /@import\s+url\(\s*"([^"]+)"\s*\)/g;

async function collectCssFiles(directory) {
	const entries = await readdir(directory, {
		withFileTypes: true,
		recursive: true,
	});
	return entries
		.filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
		.map((entry) => resolve(entry.parentPath, entry.name));
}

function matchAll(text, pattern) {
	return [...text.matchAll(pattern)].map((match) => match[1]);
}

const manifest = await readFile(MANIFEST, "utf8");
const failures = [];
const imported = matchAll(manifest, IMPORT);

for (const relativePath of imported) {
	const target = resolve(dirname(MANIFEST.pathname), relativePath);
	const exists = await stat(target).then(
		() => true,
		() => false,
	);
	if (!exists)
		failures.push(`le manifeste importe ${relativePath}, qui n'existe pas`);
}

const sourceRoot = resolve(dirname(MANIFEST.pathname), "..");
const appRoot = resolve(sourceRoot, "..");
const styleguide = resolve(appRoot, "styleguide/index.html");
const files = [...(await collectCssFiles(sourceRoot)), styleguide];
const declared = new Set();
const referenced = new Map();

for (const file of files) {
	const source = await readFile(file, "utf8");
	for (const name of matchAll(source, DECLARATION)) declared.add(name);
	for (const name of matchAll(source, REFERENCE_WITHOUT_FALLBACK)) {
		if (!referenced.has(name))
			referenced.set(name, file.replace(`${appRoot}/`, ""));
	}
}

for (const [name, file] of referenced) {
	if (!declared.has(name))
		failures.push(`${file} : ${name} est utilisé sans être déclaré nulle part`);
}

console.log(
	`${imported.length} imports, ${declared.size} tokens déclarés, ${referenced.size} référencés sans repli.`,
);

if (failures.length > 0) {
	console.error(`\n${failures.length} problème(s) :`);
	for (const failure of failures) console.error(`  ${failure}`);
	process.exit(1);
}

console.log("Tout var() sans repli pointe sur une déclaration.");
