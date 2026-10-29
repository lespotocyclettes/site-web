import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "danger";

type Size = "small";

/*
 * Le bouton de la mini-app, habillé par action-button.css. Il est de type "button" par
 * défaut : un <button> sans type, placé dans un formulaire, l'envoie au moindre clic. Pour
 * envoyer un formulaire, on l'écrit exprès : type="submit".
 */
export function ActionButton({
	variant,
	size,
	type = "button",
	...props
}: Omit<ComponentPropsWithoutRef<"button">, "className"> & {
	variant?: Variant;
	size?: Size;
}) {
	return (
		<button
			{...props}
			type={type}
			className="action-button"
			data-variant={variant}
			data-size={size}
		/>
	);
}
