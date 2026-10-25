<?php
if (!defined('ABSPATH')) {
	exit; // Le fichier a été appelé directement, hors de WordPress : on s'arrête.
}

/**
 * Active la double authentification (2FA) pour tous les comptes.
 *
 * Après le mot de passe, WordPress demande un code reçu par courriel. Repose sur
 * l'extension Two Factor.
 *
 * @link https://wordpress.org/support/plugin/two-factor/
 * @link https://wordpress.org/support/topic/can-i-by-default-turn-on-this-feature-for-all-my-existing-and-for-new-user/
 *
 * @param string[] $providers Les méthodes de connexion déjà activées pour le compte.
 * @return string[] Les mêmes, plus le code par courriel si aucune n'était activée.
 */
function potos_enable_email_two_factor($providers) {
	if (empty($providers) && class_exists('Two_Factor_Email')) {
		$providers[] = 'Two_Factor_Email';
	}

	return $providers;
}

add_filter('two_factor_enabled_providers_for_user', 'potos_enable_email_two_factor');
