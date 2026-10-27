import { createContext, type ReactNode, use } from "react";
import type { Api } from "./api";

/*
 * L'api passe par un contexte React plutôt que par un import : main.tsx y branche le faux
 * relais ou le vrai, et un test y branche le sien, sans rien remplacer en douce.
 */
const ApiContext = createContext<Api | null>(null);

export function ApiProvider({
	api,
	children,
}: {
	api: Api;
	children: ReactNode;
}) {
	return <ApiContext value={api}>{children}</ApiContext>;
}

export function useApi(): Api {
	const api = use(ApiContext);
	if (!api) throw new Error("useApi needs an <ApiProvider> above it");
	return api;
}
