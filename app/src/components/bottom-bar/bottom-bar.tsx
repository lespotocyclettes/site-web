import { isPlainClick } from "../../navigation/plain-click";
import { registrationRoute } from "../../routes/enregistrement";
import { IN_STOCK_HREF } from "../../routes/recherche";

/*
 * La barre du bas des écrans racines. Il n'y a qu'une racine, la recherche : son onglet est
 * donc toujours l'onglet actif. Le retoucher n'ouvre aucune adresse, ce qui effacerait les
 * filtres en cours : il appelle onReselect. Son href ne sert qu'à l'ouvrir dans un nouvel
 * onglet.
 *
 * « Enregistrer » se dessine comme un onglet, mais n'est jamais actif : il ouvre
 * l'enregistrement, un écran enfant en plein écran, où la barre du bas n'est plus.
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
			<a className="tab" href={registrationRoute.href()}>
				<span className="icon" aria-hidden="true">
					➕
				</span>
				Enregistrer
			</a>
		</nav>
	);
}
