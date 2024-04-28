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

require_once __DIR__ . '/2FA.php';
require_once __DIR__ . '/theme.php';