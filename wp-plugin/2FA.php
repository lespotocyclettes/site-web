<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Active le 2FA pour tous les utilisateurs
 *
 * https://wordpress.org/support/plugin/two-factor/
 * https://wordpress.org/support/topic/can-i-by-default-turn-on-this-feature-for-all-my-existing-and-for-new-user/
*/
add_filter(
    'two_factor_enabled_providers_for_user',
    function($providers) {
        if (empty( $providers ) && class_exists('Two_Factor_Email')) {
            $providers[] = 'Two_Factor_Email';
        }

        return $providers;
    }
);