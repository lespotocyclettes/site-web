<?php
if (!defined('ABSPATH')) {
	exit; // Le fichier a été appelé directement, hors de WordPress : on s'arrête.
}

/** Envisager de déplacer dans un thème potocyclettes ? */

const POTOS_BLOCKS = ['global', 'section-de-couleur', 'texte-autour-du-logo'];

/**
 * Lit le fichier .asset.php que `npm run build` écrit à côté de chaque script.
 *
 * Il donne les dépendances du script et sa version, qui change à chaque build et force le
 * navigateur à recharger le fichier.
 *
 * @param string $entry Chemin du script dans build/, sans extension. Exemple : 'blocks/global/index'.
 * @return array|null Les clés 'dependencies' et 'version', ou null si le build n'a pas été
 *                    lancé (un avertissement part alors dans le journal PHP).
 */
function potos_read_asset($entry) {
	$path = __DIR__ . "/build/{$entry}.asset.php";
	if (!file_exists($path)) {
		trigger_error("Plugin Les Poto'Cyclettes : build/{$entry}.asset.php manque, lancer `npm run build`.", E_USER_WARNING);
		return null;
	}
	return require $path;
}

/**
 * Charge un script compilé, avec les dépendances et la version de son .asset.php.
 *
 * @param string $entry Chemin du script dans build/, sans extension.
 */
function potos_enqueue_script($entry) {
	$asset = potos_read_asset($entry);
	if (!$asset) {
		return;
	}
	wp_enqueue_script(
		"potos-{$entry}.js",
		plugins_url("build/{$entry}.js", __FILE__),
		$asset['dependencies'],
		$asset['version']
	);
}

/**
 * Charge le CSS compilé d'un bloc.
 *
 * Le CSS n'a pas de fichier .asset.php à lui, et la version de celui de editor.js ne change
 * pas quand seul le CSS change : la date du fichier sert de version.
 *
 * @param string $block Nom du dossier du bloc dans src/blocks/. Exemple : 'global'.
 */
function potos_enqueue_block_style($block) {
	$relative_path = "build/blocks/{$block}/style-editor.css";
	$path = __DIR__ . "/{$relative_path}";
	if (!file_exists($path)) {
		trigger_error("Plugin Les Poto'Cyclettes : {$relative_path} manque, lancer `npm run build`.", E_USER_WARNING);
		return;
	}
	wp_enqueue_style(
		"potos-blocks/{$block}/style-editor.css",
		plugins_url($relative_path, __FILE__),
		[],
		filemtime($path)
	);
}

/**
 * Charge ce dont le site a besoin : le CSS des blocs et le script de l'en-tête.
 */
function potos_enqueue_site_assets() {
	foreach (POTOS_BLOCKS as $block) {
		potos_enqueue_block_style($block);
	}
	potos_enqueue_script('blocks/global/index');
}

/**
 * Charge ce dont l'éditeur a besoin : les scripts qui déclarent nos styles de blocs, plus
 * tout ce que charge le site, pour que l'éditeur montre le même rendu.
 */
function potos_enqueue_editor_assets() {
	foreach (POTOS_BLOCKS as $block) {
		potos_enqueue_script("blocks/{$block}/editor");
	}
	potos_enqueue_site_assets();
}

add_action('wp_enqueue_scripts', 'potos_enqueue_site_assets');
add_action('enqueue_block_editor_assets', 'potos_enqueue_editor_assets');

/**
 * Ajoute la légende de l'image au bloc Média & Texte, qui ne l'affiche pas.
 *
 * @link https://github.com/WordPress/gutenberg/issues/14604#issuecomment-702496282
 *
 * @param string $block_content Le HTML du bloc, tel que WordPress va l'afficher.
 * @param array  $block         Le bloc : son nom, ses réglages, son HTML enregistré.
 * @return string Le HTML, avec la légende si l'image en a une.
 */
function potos_add_media_text_caption($block_content, $block) {
	if ($block['blockName'] !== 'core/media-text') {
		return $block_content;
	}
	if (($block['attrs']['mediaType'] ?? '') !== 'image') {
		return $block_content;
	}
	// Renvoie false pour une image venue d'une adresse externe, ou supprimée de la médiathèque.
	$caption = wp_get_attachment_caption($block['attrs']['mediaId'] ?? 0);
	if (!$caption) {
		return $block_content;
	}

	/*
	 * innerHTML ne contient que le HTML du bloc lui-même, sans celui des blocs posés dans sa
	 * colonne de texte : la figure qu'on y trouve est forcément celle de son image.
	 * Chercher directement dans $block_content toucherait aussi ces autres images.
	 */
	if (!preg_match('#<figure class="wp-block-media-text__media.*?</figure>#s', $block['innerHTML'], $match)) {
		return $block_content;
	}
	$media = $match[0];
	$position = strpos($block_content, $media);
	if ($position === false) {
		return $block_content;
	}

	$captioned_media = str_replace(
		'wp-block-media-text__media',
		'wp-block-media-text__media wp-block-image size-full',
		substr($media, 0, -strlen('</figure>'))
	);
	$captioned_media .= '<figcaption class="wp-element-caption">' . wp_kses_post($caption) . '</figcaption></figure>';

	return substr_replace($block_content, $captioned_media, $position, strlen($media));
}

add_filter('render_block', 'potos_add_media_text_caption', 10, 2);
