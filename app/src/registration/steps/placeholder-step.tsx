import { Stack } from "../../components/layout/layout";

/*
 * Une étape d'attente, le temps que les vraies arrivent (photo, inférence, formulaire...).
 * Comme toutes les étapes, c'est un composant React ordinaire : il ignore unreel et reçoit
 * de quoi avancer par ses props. C'est ce qui permet de remplacer unreel sans les réécrire.
 */
export function PlaceholderStep({
	text,
	actionLabel,
	onAction,
}: {
	text: string;
	actionLabel: string;
	onAction: () => void;
}) {
	return (
		<Stack gap="var(--size-3)">
			<p>{text}</p>
			<button
				type="button"
				className="action-button"
				data-variant="primary"
				onClick={onAction}
			>
				{actionLabel}
			</button>
		</Stack>
	);
}
