import { defineRoute } from "../navigation/define-route";
import { searchCodec } from "../search/search-params";
import { SearchScreen } from "../search/search-screen";

export const searchRoute = defineRoute({
	name: "recherche",
	params: searchCodec,
	Screen: SearchScreen,
});
