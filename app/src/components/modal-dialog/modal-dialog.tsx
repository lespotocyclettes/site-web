import { type ReactNode, useId } from "react";

/*
 * La fenêtre modale du navigateur (<dialog>), habillée par modal-dialog.css. Elle s'ouvre
 * dès qu'on l'affiche : pour la fermer, l'écran cesse de l'afficher. Échap la ferme aussi,
 * et prévient l'écran par onClose.
 *
 * Les boutons vont dans `actions`, alignés en bas à droite. Un bouton qui envoie un
 * formulaire du corps s'y relie par l'attribut form : <button type="submit" form={id}>.
 */
export function ModalDialog({
	title,
	actions,
	onClose,
	children,
}: {
	title: string;
	actions: ReactNode;
	onClose: () => void;
	children: ReactNode;
}) {
	const titleId = useId();

	return (
		<dialog
			ref={openAsModal}
			className="modal-dialog"
			aria-labelledby={titleId}
			onClose={onClose}
		>
			<h2 id={titleId} className="title">
				{title}
			</h2>
			{children}
			<div className="actions">{actions}</div>
		</dialog>
	);
}

/*
 * showModal(), et non l'attribut open : seule la première affiche la fenêtre par-dessus la
 * page et garde le clavier dedans. En mode strict, React monte tout deux fois pour débusquer
 * les effets mal rangés : une fenêtre déjà ouverte n'est pas rouverte.
 */
function openAsModal(dialog: HTMLDialogElement | null) {
	const isClosed = dialog !== null && !dialog.open;
	if (isClosed) dialog.showModal();
}
