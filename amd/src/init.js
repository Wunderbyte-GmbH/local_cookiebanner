/**
 * @module local_cookiebanner/init
 * @copyright 2025
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';
import { getDBItem, setDBItem } from 'local_cookiebanner/db';

/**
 * Initialize cookie banner logic using IndexedDB
 */
export const init = async (hascookie, templatedata, loggedin) => {
    const link = document.getElementById('cookie-settings-link');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            require(['local_cookiebanner/banner'], function(banner) {
                banner.showbanner(templatedata, loggedin);
            });
        });
    }

    const consent = await getDBItem('cookie_consent_remember');

    if (consent === 'settech' && hascookie) {
        Ajax.call([{
            methodname: 'local_cookiebanner_delete_username_cookie',
            args: {}
        }])[0].then(() => {
            console.log("Moodle username cookie deleted.");
            return setDBItem('cookie_consent_remember', 'settech');
        }).catch(error => {
            console.error("Failed to delete Moodle username cookie:", error);
        });
    }

    if (consent === 'all') {
        Ajax.call([{
            methodname: 'local_cookiebanner_set_username_cookie',
            args: {}
        }])[0].then(() => {
            console.log("Moodle username cookie set.");
            return setDBItem('cookie_consent_remember', 'setall');
        }).catch(error => {
            console.error("Failed to set Moodle username cookie:", error);
        });
    }

    if (consent === 'tech') {
        Ajax.call([{
            methodname: 'local_cookiebanner_delete_username_cookie',
            args: {}
        }])[0].then(() => {
            console.log("Moodle username cookie deleted.");
            return setDBItem('cookie_consent_remember', 'settech');
        }).catch(error => {
            console.error("Failed to delete Moodle username cookie:", error);
        });
    }
};
