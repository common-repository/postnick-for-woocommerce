jQuery(document).ready(function ($) {
    let api_key = '';
    let locale = 'en_US';
	var postnick_account_popup_window = null;

    const api_key_input = $('#postnick-api-key');
    const locale_input = $('#postnick-locale');
    const message_container = $('#postnick-admin-message');
    const admin_submit_button = $('#postnick-admin-submit');

    const get_settings = (on_success) => {
        $.post(postnick.ajaxurl, {
            action: 'postnick_get',
        }, function (response) {
            api_key = response.api_key;

            if(response.locale != null ) {
                if(response.locale != '' ) {
           			locale = response.locale;                    
                }
            }

            if (on_success) on_success();
        })
        .error(function (e, responseText) {
        });
    };

    const save_settings = (on_success, on_error) => {
        $.post(postnick.ajaxurl, {
            action: 'postnick_save',
            api_key,
            locale
        }, on_success).error(function (e, responseText) {
            on_error(responseText);
        });
    }

    admin_submit_button.click(() => {
        message_container.html('').css('color', '');

        if (api_key_input.val() === '') {
            message_container.html('Please enter API Key.').css('color', 'red');
            return;
        }

        api_key = api_key_input.val();

        if (locale_input.val() === '') {
            locale = 'en_US'
        } else {
            locale = locale_input.val();
        }

        admin_submit_button.val('Saving...');

        save_settings(
            () => {
                admin_submit_button.val('Save Changes').prop('disabled', false);
                message_container.html('Successfully saved.');
            },
            (error) => {
                admin_submit_button.val('Save Changes').prop('disabled', false);
                message_container.html(error).css('color', 'red');
            }
        );
    });

    const billing_country = $('#billing_country');
    const billing_state = $('#billing_state');
    const billing_address_1 = $('#billing_address_1');
    const billing_address_2 = $('#billing_address_2');
    const billing_postcode = $('#billing_postcode');
    const billing_city = $('#billing_city');
    const billing_phone = $('#billing_phone');
    const shipping_country = $('#shipping_country');
    const shipping_state = $('#shipping_state');
    const shipping_address_1 = $('#shipping_address_1');
    const shipping_address_2 = $('#shipping_address_2');
    const shipping_postcode = $('#shipping_postcode');
    const shipping_city = $('#shipping_city');

    function on_address_received_from_postnick(address) {
        if (billing_country.length) {
            billing_country.select2().val(address.country_code).trigger('change');
        }
        if (billing_state.length) {
            const state_code = billing_state.find("option:contains('" + address.administrative_division_level_one + "')").val()
            if (state_code) billing_state.select2().val(state_code).trigger('change');
        }
        if (billing_address_1.length) billing_address_1.val(address.details);
        if (billing_address_2.length) billing_address_2.val(address.administrative_division_level_three);
        if (billing_postcode.length) billing_postcode.val(address.zip_code);
        if (billing_city.length) {
            billing_city.val(address.administrative_division_level_two);
        }
        if (billing_phone.length) billing_phone.val(address.phone);

        if (shipping_country.length) {
            shipping_country.select2().val(address.country_code).trigger('change');
        }
        if (shipping_state.length) {
            const state_code = shipping_state.find("option:contains('" + address.administrative_division_level_one + "')").val()
            if (state_code) shipping_state.select2().val(state_code).trigger('change');
        }
        if (shipping_address_1.length) shipping_address_1.val(address.details);
        if (shipping_address_2.length) shipping_address_2.val(address.administrative_division_level_three);
        if (shipping_postcode.length) shipping_postcode.val(address.zip_code);
        if (shipping_city.length) {
            shipping_city.val(address.administrative_division_level_two);
        }
    }

    function open_postnick_account_popup_window() {
        var left_position = (screen.width) ? (screen.width - 480) / 2 : 0;
        var top_position = (screen.height) ? (screen.height - 520) / 2 : 0;
        var settings = 'height=520,width=480,top=' + top_position + ',left=' + left_position + ',scrollbars=yes,menubar=no,resizable=yes'

        postnick_account_popup_window = window.open('https://client.postnick.com/#/account?key=' + api_key + '&locale=' + locale, "postnick-popup", settings)
    }

    function close_postnick_account_popup_window() {
        postnick_account_popup_window.close();
    }

    function receive_postnick_message(event) {
        if (event.origin !== "https://client.postnick.com")
            return;

        if (event.data != null) {
            if (event.data.message_type == 'open-account-popup-message') {
                open_postnick_account_popup_window();
            } if (event.data.message_type == 'close-account-popup-message') {
                close_postnick_account_popup_window();
            } else if (event.data.message_type == 'address-searched-message' || event.data.message_type == 'address-selected-message') {
                on_address_received_from_postnick(event.data.address);
            }

            if (event.data.message_type == 'address-selected-message') {
                close_postnick_account_popup_window();
            }
        }
    }
    
    get_settings(() => {
        if (document.getElementById("postnick-ui") != null) {
            var postnick_iframe = document.createElement('iframe');
            postnick_iframe.src = "https://client.postnick.com/#/?key=" + api_key + '&locale=' + locale;
            postnick_iframe.width = "260";
            postnick_iframe.height = "40";
            postnick_iframe.frameBorder = "0";
            postnick_iframe.scrolling = "no";
            postnick_iframe.allowtransparency = "true";
            document.getElementById("postnick-ui").appendChild(postnick_iframe);
        
            if (window.addEventListener) {
                window.addEventListener("message", receive_postnick_message, false);
            }
            else if (window.attachEvent) {
                window.attachEvent("onmessage", receive_postnick_message, false);
            }
        }
    });
});