/**
 * @module local_cookiebanner/banner
 * @copyright 2024
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import ModalFactory from 'core/modal_factory';
import {getString} from 'core/str';
import * as Setcookie from 'local_cookiebanner/init'; // ← import your init module
let bannerisopen = false;

export const showbanner = (text, showadvanced, advancedtext, loggedin) => {
    if (bannerisopen) {
        return;
    }
    bannerisopen = true; // ✅ Lock
    return Templates.renderForPromise('local_cookiebanner/bannercard', {
        text,
        showadvanced
    }).then(({ html, js }) => {
        const container = document.createElement('div');
        container.innerHTML = html;
        const banner = container.firstElementChild;

        if (!banner) {
            throw new Error("Template did not return valid HTML.");
        }

        document.body.appendChild(banner);
        Templates.runTemplateJS(js);

        const moodleIdCheckbox = banner.querySelector("#cookie-moodle-id");

        if (moodleIdCheckbox && localStorage.getItem("cookie_consent_remember") === "setall") {
            moodleIdCheckbox.checked = true;
        }
        const closeBanner = () => {
            banner.remove();
            bannerisopen = false;
        };

        banner.querySelector("#cookie-accept-all")?.addEventListener("click", () => {
            localStorage.setItem("cookie_consent_remember", "all");
            closeBanner();
            if (loggedin) {
                Setcookie.init();
            }
        });

        banner.querySelector("#cookie-save")?.addEventListener("click", () => {
            const moodleIdCheckbox = banner.querySelector("#cookie-moodle-id");
            if (moodleIdCheckbox?.checked) {
                localStorage.setItem("cookie_consent_remember", "all");
                Setcookie.init();
            } else {
                Setcookie.init();
                localStorage.setItem("cookie_consent_remember", "tech");
            }
            closeBanner();
        });

        const settingsButton = banner.querySelector("#cookie-settings");
        if (showadvanced && settingsButton) {
            settingsButton.addEventListener("click", () => {
                ModalFactory.create({
                    title: getString('modalheader', 'local_cookiebanner'),
                    body: advancedtext,
                }).then(modal => modal.show())
                  .catch(error =>
                    // eslint-disable-next-line no-console
                    console.error('Modal creation failed:', error));
            });
        } else if (settingsButton) {
            settingsButton.style.display = "none";
        }

        return null;
    }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to render cookie banner:', error);
        bannerisopen = false; // 🔓 Reset lock on failure
    });
};


export const init = (text, showadvanced, advancedtext, loggedin) => {
    if (localStorage.getItem("cookie_consent_remember")) {
        return Promise.resolve();
    }

    return showbanner(text, showadvanced, advancedtext, loggedin);
};
