/*
 * Un fichier de déclaration (.d.ts) ne contient que des types, aucun code exécuté.
 * React ne connaît pas les propriétés personnalisées (--gap, --min…) : on lui apprend
 * leur forme, pour tout le projet, sans avoir à forcer le type à chaque style.
 */
import "react";

declare module "react" {
	interface CSSProperties {
		[knob: `--${string}`]: string | undefined;
	}
}
