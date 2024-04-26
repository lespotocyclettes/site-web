<?php
/**
 * Plugin Name:	   Les Potocyclettes
 * Description:	   Plugin maison pour personnaliser l'apparence et étendre les fonctionnalités du site.
 * Requires at least: 6.1
 * Requires PHP:	  7.0
 * Version:		   0.1.0
 * Author:			Géraud Henrion
 * License:		   GPL-2.0-or-later
 * License URI:	   https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:	   lespotocyclettes
 *
 * @package		   les-potocyclettes
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

$add_script = function(string $name, $deps = []) {
        $relative_path = "build/{$name}";
        $url = plugins_url($relative_path, __FILE__);

        $absolute_path = __DIR__ . '/' . $relative_path;

        wp_enqueue_script(
            "potos-{$name}",
            $url,
            $deps,
            filemtime($absolute_path)
        );
    };

$add_stylesheet = function(string $name, $deps = []) {
        $relative_path = "build/{$name}";
        $url = plugins_url($relative_path, __FILE__);

        $absolute_path = __DIR__ . '/' . $relative_path;

        wp_enqueue_style(
            "potos-{$name}",
            $url,
            $deps,
            filemtime($absolute_path)
        );
    };

$add_styles = function() use ($add_stylesheet) {
        $add_stylesheet('blocks/global/style-editor.css');
        $add_stylesheet('blocks/section-de-couleur/style-editor.css');
        $add_stylesheet('blocks/texte-autour-du-logo/style-editor.css');
    };

$add_scripts = function() use ($add_script) {
        $add_script('blocks/global/index.js', ['wp-dom-ready']);
    };

// frontend code
add_action(
    'wp_enqueue_scripts',
    function() use ($add_scripts, $add_styles) {
        $add_styles();
        $add_scripts();
    }
);

// editor code
add_action(
    'enqueue_block_editor_assets',
    function() use ($add_script, $add_scripts, $add_styles) {
        $add_script('blocks/global/editor.js', ['wp-blocks', 'wp-dom-ready']);
        $add_script('blocks/section-de-couleur/editor.js', ['wp-blocks', 'wp-dom-ready']);
        $add_script('blocks/texte-autour-du-logo/editor.js', ['wp-blocks', 'wp-dom-ready']);
        $add_styles();
        $add_scripts();
    }
);

// https://github.com/WordPress/gutenberg/issues/14604#issuecomment-702496282
//filter Media & Text block output to add image caption
$add_media_block_caption = function($block_content, $block) {
        if ($block['blockName'] === 'core/media-text') {
            $media_id = $block['attrs']['mediaId'];
            if ($media_id) {
                $image = get_post($media_id);
                $image_caption = $image->post_excerpt;
                if ($image_caption) {
                    $block_content = str_replace(
                        'wp-block-media-text__media',
                        'wp-block-media-text__media wp-block-image size-full',
                        $block_content
                    );
                    $block_content = str_replace(
                        '</figure>',

                        "<figcaption class=\"wp-element-caption\">
                        {$image_caption}
                        </figcaption>
                        </figure>",
                        $block_content
                    );
                    return $block_content;
                }
            }
        }
        return $block_content;
    };

add_filter('render_block', $add_media_block_caption, 10, 2);