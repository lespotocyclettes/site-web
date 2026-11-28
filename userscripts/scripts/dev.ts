/*
 * Recompile un bundle à chaque modification, et le sert sur http://localhost:4173 pour le
 * chargeur de développement. Usage : `npm run dev -- demo`.
 */
import { build } from "vite";
import { bundles } from "../bundles.ts";
import { DEV_SERVER_ORIGIN } from "../src/lib/devServer.ts";
import { createBundleConfig } from "./bundleConfig.ts";

const name = process.argv[2];
const bundle = bundles.find((each) => each.name === name);
if (!bundle) {
	const names = bundles.map((each) => each.name).join(", ");
	throw new Error(`Bundle inconnu : « ${name} ». Au choix : ${names}.`);
}

console.info(`
Installez une fois le chargeur de développement, en ouvrant cette adresse :
  ${DEV_SERVER_ORIGIN}/${bundle.name}.dev.user.js
puis désactivez, sur ce navigateur, la copie installée depuis le site.
`);

await build(createBundleConfig(bundle, "development"));
