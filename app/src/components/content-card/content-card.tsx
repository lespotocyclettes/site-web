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

/**
 * Le titre garde le même style quelle que soit sa balise. Une carte qui fait toute la page,
 * comme la fiche vélo, en fait le titre de l'écran : `as="h1"`.
 *
 * Avec `actions`, les boutons s'alignent à droite du titre. Jamais dans une carte-lien (avec
 * href) : un bouton ne se place pas dans un lien.
 */
function Title({
	as: Tag = "span",
	actions,
	children,
}: {
	as?: "span" | "h1";
	actions?: ReactNode;
	children: ReactNode;
}) {
	const title = <Tag className="title">{children}</Tag>;
	if (actions === undefined) return title;

	return (
		<div className="heading">
			{title}
			{actions}
		</div>
	);
}

/** Un détail en petit, comme le statut d'un vélo. */
function Meta({ children }: { children: ReactNode }) {
	return <span className="meta">{children}</span>;
}

function Footer({ children }: { children: ReactNode }) {
	return <div className="footer">{children}</div>;
}
