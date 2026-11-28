type ButtonProps = Readonly<{
	label: string;
	/** L'infobulle. Par défaut, le libellé. */
	title?: string;
	className?: string;
	onClick: (event: MouseEvent) => void | Promise<void>;
}>;

const LOADING_LABEL = "Chargement…";
const ERROR_LABEL = "Erreur";

/**
 * Fabrique un bouton qui affiche « Chargement… » pendant son action. Si l'action échoue, le
 * bouton le dit et une alerte prévient la personne, qui a cliqué et attend un résultat.
 */
export function createButton({
	label,
	title = label,
	className,
	onClick,
}: ButtonProps): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.textContent = label;
	button.title = title;
	if (className) button.className = className;

	button.addEventListener("click", async function runAction(event) {
		button.disabled = true;
		button.textContent = LOADING_LABEL;
		try {
			await onClick(event);
			button.textContent = label;
			button.disabled = false;
		} catch (error) {
			console.error(error);
			button.textContent = ERROR_LABEL;
			alert(`Une erreur est survenue (${error}).`);
		}
	});

	return button;
}
