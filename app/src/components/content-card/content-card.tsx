import type { ReactNode } from "react";

/*
 * Une carte, habillée par content-card.css. Elle s'écrit en morceaux, chacun posant sa
 * classe, pour qu'on ne puisse pas s'y tromper :
 *
 *   <ContentCard.Root href={…}>
 *     <ContentCard.Media ratio="4 / 3"><img … /></ContentCard.Media>
 *     <ContentCard.Title>…</ContentCard.Title>
 *     <ContentCard.Meta>…</ContentCard.Meta>
 *   </ContentCard.Root>
 *
 * Un texte simple s'écrit directement dans la carte.
 */
export const ContentCard = { Root, Media, Title, Meta, Footer };

/** Largeur sur hauteur, comme l'écrit le CSS : "4 / 3", "1 / 1". */
type Ratio = `${number} / ${number}`;

function Root({
	variant,
	href,
	children,
}: {
	variant?: "elevated" | "plain";
	/** Avec une adresse, la carte devient un lien tout entier. */
	href?: string;
	children: ReactNode;
}) {
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
function Media({ ratio, children }: { ratio?: Ratio; children: ReactNode }) {
	return (
		<div className="media" style={{ "--_ratio": ratio }}>
			{children}
		</div>
	);
}

function Title({ children }: { children: ReactNode }) {
	return <span className="title">{children}</span>;
}

/** Un détail en petit, comme le statut d'un vélo. */
function Meta({ children }: { children: ReactNode }) {
	return <span className="meta">{children}</span>;
}

function Footer({ children }: { children: ReactNode }) {
	return <div className="footer">{children}</div>;
}
