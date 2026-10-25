import { registerBlockVariation } from "@wordpress/blocks";

/**
 * Importer le style ici le fait passer par webpack, l'outil de `npm run build` qui
 * assemble les fichiers : il compile le SCSS en CSS, dans build/. Ce CSS s'applique au site
 * et à l'éditeur.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

registerBlockVariation("core/columns", {
	name: "potos-texte-autour-du-logo",
	title: "Texte autour du logo",
	attributes: {
		isStackedOnMobile: true,
		align: "wide",
	},
	innerBlocks: [
		[
			"core/columns",
			{
				className: "potos-texte-autour-du-logo",
			},
			[
				[
					"core/column",
					{
						className: "potos-column1",
					},
					[
						[
							"core/paragraph",
							{
								placeholder: "Lorem ipsum...",
							},
						],
					],
				],
				[
					"core/column",
					{
						className: "potos-image",
						lock: {
							remove: true,
							move: true,
						},
					},
					[["core/image"]],
				],
				[
					"core/column",
					{
						className: "potos-column2",
					},
					[
						[
							"core/paragraph",
							{
								placeholder: "Lorem ipsum...",
							},
						],
					],
				],
			],
		],
	],
});
