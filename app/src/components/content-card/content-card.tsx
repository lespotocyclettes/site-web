import type { ReactNode } from "react";

type ContentCardProps = {
	variant?: "elevated" | "plain";
	/** Avec une adresse, la carte devient un lien tout entier. */
	href?: string;
	children: ReactNode;
};

/** Largeur sur hauteur, comme l'écrit le CSS : "4 / 3", "1 / 1". */
type Ratio = `${number} / ${number}`;

/*
 * Une carte, habillée par content-card.css. Ses parties sont des sous-composants
 * (ContentCard.Media, .Title, .Meta, .Footer) : chacun pose sa classe, on ne peut pas s'y
 * tromper. Un texte simple s'écrit directement dans la carte.
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

/**
 * Une photo de bord à bord, à placer en tête de carte pour toucher aussi le bord du haut.
 * Avec `ratio`, le cadre garde toujours ces proportions et la photo y est recadrée : une
 * grille de cartes reste alignée, quelles que soient les photos.
 */
ContentCard.Media = function Media({
	ratio,
	children,
}: {
	ratio?: Ratio;
	children: ReactNode;
}) {
	return (
		<div className="media" style={{ "--_ratio": ratio }}>
			{children}
		</div>
	);
};

ContentCard.Title = function Title({ children }: { children: ReactNode }) {
	return <span className="title">{children}</span>;
};

/** Un détail en petit, comme le statut d'un vélo. */
ContentCard.Meta = function Meta({ children }: { children: ReactNode }) {
	return <span className="meta">{children}</span>;
};

ContentCard.Footer = function Footer({ children }: { children: ReactNode }) {
	return <div className="footer">{children}</div>;
};
