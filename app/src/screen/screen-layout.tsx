import type { ReactNode } from "react";
import { BottomBar } from "../components/bottom-bar/bottom-bar";
import { Center, Stack } from "../components/layout/layout";
import { TopBar } from "../components/top-bar/top-bar";
import type { BackLinkProps } from "../navigation/back-link";
import { Boundary } from "./boundary";

/** Le même que dans index.html, qui s'affiche avant que l'app démarre. */
const APP_TITLE = "Vélos — Les Poto'Cyclettes";

/*
 * Deux cadres d'écran, une barre chacun : en bas pour un écran racine, qu'on ouvre depuis
 * la barre du bas ; en haut, avec le retour, pour un écran enfant. Jamais les deux.
 *
 * Le titre reste hors de la boundary : il s'affiche pendant le chargement comme en cas
 * d'erreur.
 */
export function RootScreen({
	title,
	onReselect,
	children,
}: {
	title: string;
	/** Ce que fait un tap sur l'onglet de cet écran, quand on y est déjà. */
	onReselect: () => void;
	children: ReactNode;
}) {
	return (
		<div className="screen-layout">
			<PageTitle title={title} />
			<main className="content">
				<Center>
					<Stack gap="var(--size-4)">
						<h1>{title}</h1>
						<Boundary>{children}</Boundary>
					</Stack>
				</Center>
			</main>
			<div className="footer">
				<Center>
					<BottomBar onReselect={onReselect} />
				</Center>
			</div>
		</div>
	);
}

/*
 * Avec `title: null`, l'écran place son h1 ailleurs : il compose PageTitle et Boundary
 * lui-même, comme la fiche vélo.
 */
export function ChildScreen({
	title,
	back,
	children,
}: {
	title: string | null;
	back: BackLinkProps;
	children: ReactNode;
}) {
	return (
		<div className="screen-layout">
			{title !== null && <PageTitle title={title} />}
			<header className="header">
				<Center>
					<TopBar back={back} title={title} />
				</Center>
			</header>
			<main className="content">
				<Center>
					{title === null ? children : <Boundary>{children}</Boundary>}
				</Center>
			</main>
		</div>
	);
}

/**
 * Le nom de l'onglet du navigateur, suivi du nom de l'app. React range la balise <title>
 * dans le <head>, où qu'on l'écrive.
 */
export function PageTitle({ title }: { title: string }) {
	return <title>{`${title} · ${APP_TITLE}`}</title>;
}
