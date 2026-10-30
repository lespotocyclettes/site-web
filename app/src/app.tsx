import { BikeSheet } from "./bike-sheet/bike-sheet";
import { Cluster, Stack } from "./components/layout/layout";
import { formatRoute, IN_STOCK_ROUTE } from "./navigation/route";
import { useRoute } from "./navigation/use-route";
import { RegistrationFlow } from "./registration/registration-flow";
import { SearchScreen } from "./search/search-screen";

export function App() {
	return (
		<Stack gap="var(--size-5)">
			<nav>
				<Cluster gap="var(--size-3)">
					<a href={formatRoute(IN_STOCK_ROUTE)}>Recherche</a>
					<a href={formatRoute({ screen: "enregistrement" })}>
						Enregistrer un vélo
					</a>
				</Cluster>
			</nav>
			<main>
				<CurrentScreen />
			</main>
		</Stack>
	);
}

function CurrentScreen() {
	const route = useRoute();
	switch (route.screen) {
		case "recherche":
			return <SearchScreen />;
		case "velo":
			return <BikeSheet reference={route.reference} />;
		case "enregistrement":
			return <RegistrationFlow />;
	}
}
