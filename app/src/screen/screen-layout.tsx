import type { ReactNode } from "react";
import { Stack } from "../components/layout/layout";
import { Boundary } from "./boundary";

/** Le titre reste hors de la boundary : il s'affiche pendant le chargement comme en cas d'erreur. */
export function ScreenLayout({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<Stack gap="var(--size-4)">
			<h1>{title}</h1>
			<Boundary>{children}</Boundary>
		</Stack>
	);
}
