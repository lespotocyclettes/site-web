import type { ReactNode } from "react";
import { Stack } from "../components/layout/layout";
import { Boundary } from "./boundary";

/** Le même que dans index.html, qui s'affiche avant que l'app démarre. */
const APP_TITLE = "Vélos — Les Poto'Cyclettes";

/**
 * Le titre reste hors de la boundary : il s'affiche pendant le chargement comme en cas
 * d'erreur. Un écran qui place son h1 ailleurs, comme la fiche vélo, compose PageTitle et
 * Boundary lui-même.
 */
export function ScreenLayout({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<Stack gap="var(--size-4)">
			<PageTitle title={title} />
			<h1>{title}</h1>
			<Boundary>{children}</Boundary>
		</Stack>
	);
}

/**
 * Le nom de l'onglet du navigateur, suivi du nom de l'app. React range la balise <title>
 * dans le <head>, où qu'on l'écrive.
 */
export function PageTitle({ title }: { title: string }) {
	return <title>{`${title} · ${APP_TITLE}`}</title>;
}
