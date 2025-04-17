/**
 * @module local_cookiebanner/banner
 * @copyright 2024
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import ModalFactory from 'core/modal_factory';
import { getString } from 'core/str';
import * as Setcookie from 'local_cookiebanner/init';
import { getDBItem, setDBItem } from 'local_cookiebanner/db';

let bannerisopen = false;

export const showbanner = async (templatedata, loggedin) => {
    if (bannerisopen) {
        return;
    }
    bannerisopen = true;

    return Templates.renderForPromise('local_cookiebanner/bannercard', {
        'templatedata': templatedata
    }).then(async ({ html, js }) => {
        const container = document.createElement('div');
        container.innerHTML = html;
        const banner = container.firstElementChild;

        if (!banner) {
            throw new Error("Template did not return valid HTML.");
        }

        document.body.appendChild(banner);
        Templates.runTemplateJS(js);

        const moodleIdCheckbox = banner.querySelector("#cookie-moodle-id");

        // Check current consent state from IndexedDB
        const consent = await getDBItem("cookie_consent_remember");
        if (moodleIdCheckbox && consent === "setall") {
            moodleIdCheckbox.checked = true;
        }

        const closeBanner = () => {
            banner.remove();
            bannerisopen = false;
        };

        banner.querySelector("#cookie-accept-all")?.addEventListener("click", async () => {
            await setDBItem("cookie_consent_remember", "all");
            closeBanner();
            if (loggedin) {
                Setcookie.init();
            }
        });

        banner.querySelector("#cookie-save")?.addEventListener("click", async () => {
            const moodleIdCheckbox = banner.querySelector("#cookie-moodle-id");
            if (moodleIdCheckbox?.checked) {
                await setDBItem("cookie_consent_remember", "all");
                console.log('cookie_consent_remember all');

            } else {
                await setDBItem("cookie_consent_remember", "tech");
                console.log('cookie_consent_remember tech');
            }
            closeBanner();
            Setcookie.init();
        });

        // Optional advanced settings modal logic (commented out)
        // const settingsButton = banner.querySelector("#cookie-settings");
        // if (templatedata.showadvanced && settingsButton) {
        //     settingsButton.addEventListener("click", () => {
        //         ModalFactory.create({
        //             title: getString('modalheader', 'local_cookiebanner'),
        //             body: templatedata.advancedtext,
        //         }).then(modal => modal.show())
        //           .catch(error =>
        //             console.error('Modal creation failed:', error));
        //     });
        // } else if (settingsButton) {
        //     settingsButton.style.display = "none";
        // }

        return null;
    }).catch(error => {
        console.error('Failed to render cookie banner:', error);
        bannerisopen = false; // Reset lock on failure
    });
};

export const init = async (data, loggedin) => {
    const consent = await getDBItem("cookie_consent_remember");
    if (consent) {
        return Promise.resolve();
    }
    return showbanner(data, loggedin);
};
