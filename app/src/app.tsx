import { Cluster, Stack } from "./components/layout/layout";
import { useScreen } from "./navigation/use-screen";
import { registrationRoute } from "./routes/enregistrement";
import { IN_STOCK_HREF, ROUTES } from "./routes/index";

export function App() {
	return (
		<Stack gap="var(--size-5)">
			<nav>
				<Cluster gap="var(--size-3)">
					<a href={IN_STOCK_HREF}>Recherche</a>
					<a href={registrationRoute.href()}>Enregistrer un vélo</a>
				</Cluster>
			</nav>
			<main>
				<CurrentScreen />
			</main>
		</Stack>
	);
}

function CurrentScreen() {
	return useScreen(ROUTES, IN_STOCK_HREF);
}
