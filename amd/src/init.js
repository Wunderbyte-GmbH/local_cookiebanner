/**
 * @module local_cookiebanner/init
 * @copyright 2025
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';

export const init = (hascookie, templatedata, loggedin) => {
    const link = document.getElementById('cookie-settings-link');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            require(['local_cookiebanner/banner'], function(banner) {
                banner.showbanner(templatedata, loggedin);
            });
        });
    }
    if (localStorage.getItem('cookie_consent_remember') == 'settech' && hascookie) {
        Ajax.call([{
            methodname: 'local_cookiebanner_delete_username_cookie',
            args: {}
        }])[0].then(() => {
            // eslint-disable-next-line no-console
            console.log("Moodle username cookie deleted.");
            localStorage.setItem('cookie_consent_remember', 'settech');
            return null;
        }).catch(error => {
            // eslint-disable-next-line no-console
            console.error("Failed to set Moodle username cookie:", error);
        });
    }
    if (localStorage.getItem('cookie_consent_remember') == 'all') {
        Ajax.call([{
            methodname: 'local_cookiebanner_set_username_cookie',
            args: {}
        }])[0].then(() => {
            // eslint-disable-next-line no-console
            console.log("Moodle username cookie set.");
            localStorage.setItem('cookie_consent_remember', 'setall');
            return null;
        }).catch(error => {
            // eslint-disable-next-line no-console
            console.error("Failed to set Moodle username cookie:", error);
        });
    }
    if (localStorage.getItem('cookie_consent_remember') == 'tech') {
        Ajax.call([{
            methodname: 'local_cookiebanner_delete_username_cookie',
            args: {}
        }])[0].then(() => {
            // eslint-disable-next-line no-console
            console.log("Moodle username cookie deleted.");
            localStorage.setItem('cookie_consent_remember', 'settech');
            return null;
        }).catch(error => {
            // eslint-disable-next-line no-console
            console.error("Failed to set Moodle username cookie:", error);
        });
    }
};
