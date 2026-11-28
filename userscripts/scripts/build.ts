/*
 * Compile chaque bundle vers wp-plugin/userscripts/, que le déploiement envoie sur le site
 * avec le reste du plugin. Usage : `npm run build`.
 */
import { rm } from "node:fs/promises";
import { build } from "vite";
import { bundles } from "../bundles.ts";
import { createBundleConfig } from "./bundleConfig.ts";

const outDir = new URL("../../wp-plugin/userscripts", import.meta.url);
await rm(outDir, { recursive: true, force: true });

for (const bundle of bundles) {
	await build(createBundleConfig(bundle, "production"));
}
