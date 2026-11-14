import { Center, Cluster, Stack } from "./components/layout/layout";
import { useScreen } from "./navigation/use-screen";
import { registrationRoute } from "./routes/enregistrement";
import { IN_STOCK_HREF, ROUTES } from "./routes/index";

/*
 * La marge du bas est large : le dernier bouton d'un écran ne colle pas au bas d'un
 * téléphone, où la barre du navigateur le recouvre et où le pouce l'atteint mal.
 */
export function App() {
	return (
		<Center>
			<Stack gap="var(--size-5)" style={{ paddingBlockEnd: "var(--size-8)" }}>
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
		</Center>
	);
}

function CurrentScreen() {
	return useScreen(ROUTES, IN_STOCK_HREF);
}
