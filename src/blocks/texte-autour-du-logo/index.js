/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockVariation } from "@wordpress/blocks";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

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
							remove: false,
							move: false,
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
