import caritasHiberne from "./demo/caritas-hiberne.ts";
import modeCambouis from "./demo/mode-cambouis.ts";
import tarifsEnChambresAAir from "./demo/tarifs-en-chambres-a-air.ts";
import { startBundle } from "./lib/startBundle.ts";
import bandeauPreprod from "./paheko/bandeau-preprod.ts";

/*
 * La démo ne tourne qu'avec `npm run dev`. Vite remplace `import.meta.env.MODE` par le mode
 * de compilation : à la compilation finale, la condition est fausse d'avance, et Vite retire
 * ces scripts du fichier publié. Les bénévoles ne les reçoivent jamais.
 *
 * Pas `import.meta.env.DEV` : `npm run dev` est une compilation (`vite build`), pour
 * laquelle DEV reste faux même en mode développement.
 */
const demo =
	import.meta.env.MODE === "development"
		? [modeCambouis, tarifsEnChambresAAir, caritasHiberne]
		: [];

void startBundle([bandeauPreprod, ...demo]);
