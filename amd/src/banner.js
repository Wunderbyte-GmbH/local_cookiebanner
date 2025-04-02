/**
 * @module local_cookiebanner/banner
 * @copyright 2024
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import ModalFactory from 'core/modal_factory';
import {getString} from 'core/str';

export const init = (text, showadvanced, advancedtext) => {
    if (localStorage.getItem("cookieAccepted") || localStorage.getItem("cookieRejected")) {
        return Promise.resolve();
    }

    return Templates.render('local_cookiebanner/banner', text, showadvanced)
        .then(([html, js]) => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const banner = temp.firstElementChild;

            document.body.appendChild(banner);
            Templates.runTemplateJS(js);

            banner.querySelector("#cookie-accept")?.addEventListener("click", () => {
                localStorage.setItem("cookieAccepted", "true");
                banner.remove();
            });

            banner.querySelector("#cookie-reject")?.addEventListener("click", () => {
                localStorage.setItem("cookieRejected", "true");
                banner.remove();
            });

            const settingsButton = banner.querySelector("#cookie-settings");
            if (showadvanced && settingsButton) {
                settingsButton.addEventListener("click", () => {
                    ModalFactory.create({
                        title: getString('modalheader', 'local_cookiebanner'),
                        body: advancedtext
                    }).then(modal => {
                        modal.show();
                        return;
                    }).catch(error => {
                        // eslint-disable-next-line
                        console.error('Modal creation failed:', error);
                        return;
                    });
                });
            } else if (settingsButton) {
                settingsButton.style.display = "none";
            }

            return null;
        })
        .catch(error => {
            // eslint-disable-next-line
            console.error('Failed to render cookie banner:', error);
        });
};
