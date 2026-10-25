import { registerBlockStyle } from "@wordpress/blocks";

/**
 * Importer le style ici le fait passer par webpack, l'outil de `npm run build` qui
 * assemble les fichiers : il compile le SCSS en CSS, dans build/. Ce CSS s'applique au site
 * et à l'éditeur.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

registerBlockStyle("core/group", {
	name: "potos-section-velo",
	label: "Fond vélo",
});

registerBlockStyle("core/group", {
	name: "potos-section-rouille",
	label: "Fond rouille",
});
