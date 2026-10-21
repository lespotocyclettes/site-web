import type { ComponentPropsWithoutRef } from "react";

declare module "react" {
	/** React ne connaît pas les propriétés personnalisées : on lui apprend leur forme. */
	interface CSSProperties {
		[knob: `--${string}`]: string | undefined;
	}
}

/** Un échelon de l'échelle Open Props, pas une taille en toutes lettres : « lg » n'ordonne rien. */
export type Space = `var(--size-${number})`;

/** Largeur minimale d'une colonne avant que la grille en retire une. */
export type TrackMinimum = `${number}rem`;

export type Alignment = "start" | "center" | "end" | "baseline" | "stretch";

type LayoutProps = ComponentPropsWithoutRef<"div">;

type Knobs = Record<`--${string}`, string | undefined>;

function toLayoutProps(
	layoutClass: string,
	knobs: Knobs,
	{ className, style, ...rest }: LayoutProps,
) {
	return {
		className: className ? `${layoutClass} ${className}` : layoutClass,
		style: { ...style, ...knobs },
		...rest,
	};
}

export function Stack({ gap, ...props }: LayoutProps & { gap?: Space }) {
	return <div {...toLayoutProps("layout-stack", { "--gap": gap }, props)} />;
}

export function Cluster({
	gap,
	align,
	...props
}: LayoutProps & { gap?: Space; align?: Alignment }) {
	return (
		<div
			{...toLayoutProps(
				"layout-cluster",
				{ "--gap": gap, "--align": align },
				props,
			)}
		/>
	);
}

export function Grid({
	gap,
	min,
	...props
}: LayoutProps & { gap?: Space; min?: TrackMinimum }) {
	return (
		<div
			{...toLayoutProps("layout-grid", { "--gap": gap, "--min": min }, props)}
		/>
	);
}
