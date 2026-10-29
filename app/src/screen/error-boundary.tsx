import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
	children: ReactNode;
	/** Appelé au « Réessayer », avant de réafficher le contenu. */
	onReset: () => void;
	renderFallback: (error: Error, retry: () => void) => ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

/*
 * React n'attrape une erreur d'affichage que dans un composant écrit en classe :
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 * C'est le seul de la mini-app. La bibliothèque react-error-boundary fait la même chose, en
 * plus complet ; on n'en a pas besoin (voir la fiche 0002).
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
		const isError = error instanceof Error;
		return { error: isError ? error : new Error(String(error)) };
	}

	#retry = () => {
		this.props.onReset();
		this.setState({ error: null });
	};

	render() {
		const { error } = this.state;
		if (error) return this.props.renderFallback(error, this.#retry);
		return this.props.children;
	}
}
