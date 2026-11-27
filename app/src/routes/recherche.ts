import { IN_STOCK_SEARCH } from "../bike/search";
import { defineRoute } from "../navigation/define-route";
import { searchCodec } from "../search/search-params";
import { SearchScreen } from "../search/search-screen";

export const searchRoute = defineRoute({
	name: "recherche",
	params: searchCodec,
	Screen: SearchScreen,
});

/**
 * Là où arrive le bénévole : l'onglet Recherche, une adresse vide ou mal tapée. Rangée ici
 * plutôt que dans index.ts : les écrans s'en servent, et index.ts importe les écrans.
 */
export const IN_STOCK_HREF = searchRoute.href(IN_STOCK_SEARCH);
