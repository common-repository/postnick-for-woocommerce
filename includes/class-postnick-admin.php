<?php
class Postnick_Admin {
	function __construct() {
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
		add_action( 'wp_ajax_postnick_get', [$this, 'get'] );
        add_action( 'wp_ajax_nopriv_postnick_get', [$this, 'get'] );
        add_action( 'wp_ajax_postnick_save', [ $this, 'save' ] );
		add_action( 'wp_ajax_nopriv_postnick_save', [ $this, 'save' ] );
	}

	/**
	 * @description Add menu page.
	 */
	function admin_menu() {
		add_menu_page( __( 'Postnick', 'postnick' ), __( 'Postnick', 'postnick' ), 'manage_options', 'postnick', [
			$this,
			'menu_content'
		], 'dashicons-controls-forward' );
	}

	/**
	 * @description Menu page content.
	 */
	function menu_content() {
        ?>
        <h1><?php esc_html_e( 'Postnick', 'postnick' ); ?></h1>
        <p>With Postnick plug-in, your website visitors will be able to get address details from Postnick. You need to configure the Postnick plug-in by providing API Key, which you can obtain from your Postnick account, and Preferred Locale. For more details on how to create your Postnick account and get these credentials, please visit <a href="https://www.postnick.com/#/developers" target="_blank"><b>Postnick Developers page</b></a>.</p>
        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row">
                        <label for="postnick-api-key"><?php echo __( 'API Key', 'postnick' ); ?></label>
                    </th>
                    <td>
                        <input id="postnick-api-key" class="regular-text" name="postnick-api-key" type="password" value="<?php echo get_option( 'postnick-api-key', '' ); ?>">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="postnick-locale"><?php echo __( 'Preferred Locale', 'postnick' ); ?></label>
                    </th>
                    <td>
                        <input id="postnick-locale" class="regular-text" name="postnick-locale" type="text" value="<?php echo get_option( 'postnick-locale', '' ); ?>">
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="submit"><input type="submit" name="postnick-admin-submit" id="postnick-admin-submit" class="button button-primary" value="Save Changes"></p>
        <p id="postnick-admin-message"></p>
		<?php
	}

	/**
	 * @description Enqueue scripts.
	 */
	function admin_enqueue_scripts() {
		wp_enqueue_script( 'postnick-main', POSTNICK_URL . 'assets/js/main.js', [ 'jquery' ], '1.0', true );
		wp_localize_script( 'postnick-main', 'postnick', [ 'ajaxurl' => admin_url( 'admin-ajax.php' ) ] );
	}

	/**
	 * @description Get settings.
	 */
	function get() {
        wp_send_json([
            'api_key' => get_option('postnick-api-key',''),
            'locale' => get_option('postnick-locale','')
        ]);
    }

	/**
	 * @description Save settings
	 */
	function save() {
        $sanitized_api_key = sanitize_text_field( $_POST['api_key'] );
        $sanitized_locale = sanitize_text_field( $_POST['locale'] );

		update_option( 'postnick-api-key', $sanitized_api_key );
		update_option( 'postnick-locale', $sanitized_locale );
	}
}

new Postnick_Admin();