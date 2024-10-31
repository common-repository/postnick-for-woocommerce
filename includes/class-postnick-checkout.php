<?php
class Postnick_Checkout {
	function __construct()
	{
		add_action('woocommerce_before_checkout_billing_form',[$this,'postnick_button']);
		add_action('wp_enqueue_scripts',[$this,'enqueue_scripts']);
	}

    /**
     * @description Checkout search content
     */
	function postnick_button()
	{
        ?>
        <p class="form-row" data-priority="">
            <div class="postnick-wrapper">
                <div class="woocommerce-input-wrapper postnick-input-wrapper">
                    <div id="postnick-ui" style="width:260px;height:40px;margin-top:10px;margin-bottom:15px;"></div>
                </div>
            </div>
        </p>
        <?php
	}

    /**
     * @description Enqueue scripts
     */
	function enqueue_scripts()
    {
        if(is_checkout()) {
            wp_enqueue_script( 'postnick-main', POSTNICK_URL . 'assets/js/main.js', [ 'jquery' ], '1.0', true );
            wp_localize_script( 'postnick-main', 'postnick', [ 'ajaxurl' => admin_url( 'admin-ajax.php' ) ] );
	        wp_enqueue_style('postnick.main', POSTNICK_URL . 'assets/css/main.css');
        }
    }
}

new Postnick_Checkout();