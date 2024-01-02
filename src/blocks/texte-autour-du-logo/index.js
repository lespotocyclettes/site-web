/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from "@wordpress/blocks";

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
registerBlockType(metadata.name, {
	attributes: {},
	category: metadata.category,
	title: metadata.title,
	edit: Edit,
	save,
});

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element to render.
 */
function Edit(props) {
	return (
		<div
			{...useBlockProps({ className: "potos_texte-autour-du-logo alignwide" })}
		>
			<InnerBlocks
				template={[
					[
						"core/columns",
						{},
						[
							[
								"core/column",
								{
									className: "potos_column1",
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
									className: "potos_image",
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
									className: "potos_column2",
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
				]}
			/>
		</div>
	);
}

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {JSX.Element} Element to render.
 */
function save() {
	return (
		<div
			{...useBlockProps.save({
				className: "potos_texte-autour-du-logo alignwide",
			})}
		>
			<InnerBlocks.Content />
		</div>
	);
}
