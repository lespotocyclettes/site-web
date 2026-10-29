import type { ReactNode } from "react";
import { Stack } from "../components/layout/layout";
import { Boundary } from "./boundary";

/** Le même que dans index.html, qui s'affiche avant que l'app démarre. */
const APP_TITLE = "Vélos — Les Poto'Cyclettes";

/**
 * Le titre reste hors de la boundary : il s'affiche pendant le chargement comme en cas
 * d'erreur. Il nomme aussi l'onglet du navigateur : React range la balise <title> dans le
 * <head>, où qu'on l'écrive.
 */
export function ScreenLayout({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	const pageTitle = `${title} · ${APP_TITLE}`;

	return (
		<Stack gap="var(--size-4)">
			<title>{pageTitle}</title>
			<h1>{title}</h1>
			<Boundary>{children}</Boundary>
		</Stack>
	);
}
