import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { type ReactNode, Suspense } from "react";
import { ActionButton } from "../components/action-button/action-button";
import { LoadingSkeleton } from "../components/loading-skeleton/loading-skeleton";
import { ErrorBoundary } from "./error-boundary";

/*
 * Ce que montre un morceau d'écran pendant qu'il charge (un skeleton) et quand il échoue (un
 * message et « Réessayer »). Les composants en dessous n'ont donc ni état de chargement ni
 * état d'erreur à gérer : avec useSuspenseQuery, leurs données sont toujours là.
 *
 * QueryErrorResetBoundary fait que « Réessayer » relance aussi les requêtes en échec, au
 * lieu de réafficher la même erreur depuis le cache.
 */
export function Boundary({ children }: { children: ReactNode }) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => {
				return (
					<ErrorBoundary
						onReset={reset}
						renderFallback={(error, retry) => {
							return <ErrorNotice error={error} onRetry={retry} />;
						}}
					>
						<Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
					</ErrorBoundary>
				);
			}}
		</QueryErrorResetBoundary>
	);
}

function ErrorNotice({
	error,
	onRetry,
}: {
	error: Error;
	onRetry: () => void;
}) {
	return (
		<div className="notice-block" data-variant="danger" role="alert">
			<p className="title">Ça n'a pas marché</p>
			<p>{error.message}</p>
			<ActionButton onClick={onRetry}>Réessayer</ActionButton>
		</div>
	);
}
