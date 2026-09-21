import type { ComponentPropsWithoutRef, CSSProperties } from "react";

/** Un échelon de l'échelle Open Props, pas une taille en toutes lettres : « lg » n'ordonne rien. */
export type Space = `var(--size-${number})`;

/** Largeur minimale d'une colonne avant que la grille en retire une. */
export type TrackMinimum = `${number}rem`;

export type Alignment = "start" | "center" | "end" | "baseline" | "stretch";

type PrimitiveProps = ComponentPropsWithoutRef<"div">;

type Knobs = Record<`--${string}`, string | undefined>;

function getLayoutProps(
	layoutClass: string,
	knobs: Knobs,
	{ className, style, ...rest }: PrimitiveProps,
) {
	return {
		className: className ? `${layoutClass} ${className}` : layoutClass,
		style: { ...style, ...knobs } as CSSProperties,
		...rest,
	};
}

export function Stack({ gap, ...props }: PrimitiveProps & { gap?: Space }) {
	return <div {...getLayoutProps("layout-stack", { "--gap": gap }, props)} />;
}

export function Cluster({
	gap,
	align,
	...props
}: PrimitiveProps & { gap?: Space; align?: Alignment }) {
	return (
		<div
			{...getLayoutProps(
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
}: PrimitiveProps & { gap?: Space; min?: TrackMinimum }) {
	return (
		<div
			{...getLayoutProps("layout-grid", { "--gap": gap, "--min": min }, props)}
		/>
	);
}
