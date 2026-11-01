/**
 * Écrit un objet en chaîne de requête : `{ q: "peugeot", statut: ["sorti", "démonté"] }`
 * devient `q=peugeot&statut=sorti&statut=d%C3%A9mont%C3%A9`. Une liste donne un paramètre
 * par valeur ; un texte vide ou une liste vide n'écrit rien.
 */
export function toQueryString(
	fields: Record<string, string | readonly string[]>,
): string {
	const params = new URLSearchParams();
	for (const [name, value] of Object.entries(fields)) {
		const values = typeof value === "string" ? [value] : value;
		for (const single of values) {
			if (single !== "") {
				params.append(name, single);
			}
		}
	}
	return params.toString();
}
