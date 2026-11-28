/** Le bundle tourne aussi sur Paheko : la démo, elle, ne concerne que le site de l'association. */
export function isAssociationSite(url: URL): boolean {
	return url.hostname.endsWith("lespotocyclettes.com");
}
