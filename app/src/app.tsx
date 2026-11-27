import { useScreen } from "./navigation/use-screen";
import { ROUTES } from "./routes/index";
import { IN_STOCK_HREF } from "./routes/recherche";

/* Chaque écran dessine son propre cadre, avec sa barre : voir screen/screen-layout.tsx. */
export function App() {
	return useScreen(ROUTES, IN_STOCK_HREF);
}
