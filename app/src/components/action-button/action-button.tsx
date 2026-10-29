import {
	type ComponentPropsWithoutRef,
	type MouseEvent,
	useState,
} from "react";

type Variant = "primary" | "secondary" | "danger";

type Size = "small";

type ActionButtonProps = Omit<
	ComponentPropsWithoutRef<"button">,
	"className" | "onClick"
> & {
	variant?: Variant;
	size?: Size;
	/**
	 * Si le clic renvoie une promesse, le bouton reste désactivé et affiche une roue jusqu'à
	 * ce qu'elle se termine : un second clic est impossible, l'action ne part pas deux fois.
	 */
	// biome-ignore lint/suspicious/noConfusingVoidType: `void` laisse passer un clic qui ne renvoie rien d'utile, comme `() => mutation.mutate(x)` ; `undefined` le refuserait.
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
};

/*
 * Le bouton de la mini-app, habillé par action-button.css. Il est de type "button" par
 * défaut : un <button> sans type, placé dans un formulaire, l'envoie au moindre clic. Pour
 * envoyer un formulaire, on l'écrit exprès : type="submit".
 */
export function ActionButton({
	variant,
	size,
	type = "button",
	disabled,
	onClick,
	...props
}: ActionButtonProps) {
	const [isPending, setIsPending] = useState(false);

	async function runAction(event: MouseEvent<HTMLButtonElement>) {
		const result = onClick?.(event);
		const isAsync = result instanceof Promise;
		if (!isAsync) return;

		setIsPending(true);
		try {
			await result;
		} finally {
			setIsPending(false);
		}
	}

	return (
		<button
			{...props}
			type={type}
			className="action-button"
			data-variant={variant}
			data-size={size}
			disabled={disabled || isPending}
			aria-busy={isPending}
			/*
			 * L'échec de l'action n'est pas rattrapé ici : c'est à l'écran de l'afficher (par
			 * exemple avec l'erreur de sa mutation). Il remonte au navigateur, qui le signale.
			 */
			onClick={(event) => void runAction(event)}
		/>
	);
}
