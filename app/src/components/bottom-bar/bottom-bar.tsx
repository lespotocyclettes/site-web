import { isPlainClick } from "../../navigation/plain-click";
import { registrationRoute } from "../../routes/enregistrement";
import { IN_STOCK_HREF } from "../../routes/index";
import { ActionButton } from "../action-button/action-button";

/*
 * La barre du bas des écrans racines. Il n'y a qu'une racine, la recherche : son onglet est
 * donc toujours l'onglet actif. Le retoucher n'ouvre aucune adresse, ce qui effacerait les
 * filtres en cours : il appelle onReselect. Son href ne sert qu'à l'ouvrir dans un nouvel
 * onglet.
 *
 * « Enregistrer » n'est pas un onglet mais une action, dessinée en bouton : elle ouvre
 * l'enregistrement en plein écran, qu'on quitte par son retour.
 */
export function BottomBar({ onReselect }: { onReselect: () => void }) {
	return (
		<nav className="bottom-bar" aria-label="Navigation principale">
			<a
				className="tab"
				href={IN_STOCK_HREF}
				aria-current="page"
				onClick={(event) => {
					if (!isPlainClick(event)) return;

					event.preventDefault();
					onReselect();
				}}
			>
				<span className="icon" aria-hidden="true">
					🔍
				</span>
				Recherche
			</a>
			<ActionButton variant="primary" icon="➕" href={registrationRoute.href()}>
				Enregistrer
			</ActionButton>
		</nav>
	);
}
