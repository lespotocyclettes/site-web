import type { ReactNode } from "react";

type ContentCardProps = {
	variant?: "elevated" | "plain";
	/** Avec une adresse, la carte devient un lien tout entier. */
	href?: string;
	children: ReactNode;
};

/*
 * Une carte, habillée par content-card.css. Ses parties s'écrivent avec leur classe :
 * `.media` (une photo de bord à bord), `.title`, `.meta` (un détail en petit), `.footer`.
 */
export function ContentCard({ variant, href, children }: ContentCardProps) {
	if (href) {
		return (
			<a className="content-card" data-variant={variant} href={href}>
				{children}
			</a>
		);
	}

	return (
		<article className="content-card" data-variant={variant}>
			{children}
		</article>
	);
}
