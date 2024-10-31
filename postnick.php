<?php
    /**
     * Plugin Name: Postnick for WooCommerce
     * Plugin URI: https://www.postnick.com/#/developers
     * Description: This plugin allows to easily get address details from Postnick on checkout.
     * Version: 1.0
     * Author: postnick
     * Author URI: https://www.postnick.com
     * Text Domain: postnick
     */
    
    define( 'POSTNICK_DIR', __DIR__ );
    define( 'POSTNICK_URL', plugin_dir_url( __FILE__ ) );
    
    include_once POSTNICK_DIR . '/includes/class-postnick-admin.php';
    include_once POSTNICK_DIR . '/includes/class-postnick-checkout.php';
