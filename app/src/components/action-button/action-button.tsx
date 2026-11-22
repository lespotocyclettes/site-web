import {
	type ComponentPropsWithoutRef,
	type MouseEvent,
	type ReactNode,
	useState,
} from "react";

type Variant = "primary" | "secondary" | "danger";

type Size = "small";

type AppearanceProps = {
	variant?: Variant;
	size?: Size;
	/**
	 * Un émoji devant le libellé. Il montre qu'on peut taper, là où un libellé seul ressemble
	 * à une étiquette. Les lecteurs d'écran ne le lisent pas : le libellé suffit.
	 */
	icon?: string;
};

type ButtonProps = AppearanceProps &
	Omit<ComponentPropsWithoutRef<"button">, "className" | "onClick"> & {
		href?: undefined;
		/**
		 * Si le clic renvoie une promesse, le bouton reste désactivé et affiche une roue jusqu'à
		 * ce qu'elle se termine : un second clic est impossible, l'action ne part pas deux fois.
		 */
		// biome-ignore lint/suspicious/noConfusingVoidType: `void` laisse passer un clic qui ne renvoie rien d'utile, comme `() => mutation.mutate(x)` ; `undefined` le refuserait.
		onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
	};

/** Un lien ne fait rien attendre : pas de roue, pas d'état désactivé. */
type LinkProps = AppearanceProps &
	Omit<ComponentPropsWithoutRef<"a">, "className"> & {
		href: string;
	};

/*
 * Le bouton de la mini-app, habillé par action-button.css. Avec un `href`, il mène quelque
 * part : c'est un lien <a>, qu'on peut ouvrir dans un nouvel onglet. Sans, il agit : c'est
 * un <button>.
 *
 * Son libellé est un verbe à l'infinitif (« Démonter », « Enregistrer ») : un bouton agit.
 * Un nom ou un adjectif (« Démonté ») le ferait passer pour une chip, qui porte une valeur.
 */
export function ActionButton(props: ButtonProps | LinkProps) {
	if (props.href === undefined) return <ButtonElement {...props} />;
	return <LinkElement {...props} />;
}

function LinkElement({ variant, size, icon, children, ...props }: LinkProps) {
	return (
		<a
			{...props}
			className="action-button"
			data-variant={variant}
			data-size={size}
		>
			<Label icon={icon}>{children}</Label>
		</a>
	);
}

/*
 * Il est de type "button" par défaut : un <button> sans type, placé dans un formulaire,
 * l'envoie au moindre clic. Pour envoyer un formulaire, on l'écrit exprès : type="submit".
 */
function ButtonElement({
	variant,
	size,
	icon,
	type = "button",
	disabled,
	onClick,
	children,
	href: _href,
	...props
}: ButtonProps) {
	const [isPending, setIsPending] = useState(false);
	const isDisabled = Boolean(disabled) || isPending;

	async function runAction(event: MouseEvent<HTMLButtonElement>) {
		/* aria-disabled ne bloque rien tout seul : sans ça, un type="submit" enverrait le formulaire. */
		if (isDisabled) {
			event.preventDefault();
			return;
		}

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
			/*
			 * aria-disabled plutôt que disabled : le bouton reste atteignable au clavier et lu par
			 * les lecteurs d'écran, et il garde le focus quand son action démarre.
			 */
			aria-disabled={isDisabled}
			aria-busy={isPending}
			/*
			 * L'échec de l'action n'est pas rattrapé ici : c'est à l'écran de l'afficher (par
			 * exemple avec l'erreur de sa mutation). Il remonte au navigateur, qui le signale.
			 */
			onClick={(event) => void runAction(event)}
		>
			<Label icon={icon}>{children}</Label>
		</button>
	);
}

function Label({ icon, children }: { icon?: string; children: ReactNode }) {
	return (
		<>
			{icon !== undefined && <span aria-hidden="true">{icon}</span>}
			{children}
		</>
	);
}
