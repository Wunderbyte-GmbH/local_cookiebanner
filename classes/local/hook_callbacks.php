<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @package    local_cookiebanner
 * @copyright  2025 Thomas Winkler
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_cookiebanner\local;
use core\hook\output\before_http_headers;

/**
 * Hook_callbacks for local_cookiebanner
 */
class hook_callbacks {
    /**
     * Hook of before_http_headers
     * @param \core\hook\output\before_http_headers $hook
     * @return void
     */
    public static function before_http_headers(before_http_headers $hook): void {
        global $PAGE, $CFG;
        $cookiename = 'MOODLEID1_' . $CFG->sessioncookie;

        if (isset($_COOKIE[$cookiename])) {
            $hascookie = true;
        } else {
            $hascookie = true;
        }
        $cookietext = get_config('local_cookiebanner', 'cookietext');
        if (empty($cookietext)) {
            $cookietext = get_string('cookietext_default', 'local_cookiebanner');
        }
        $showadvanced = get_config('local_cookiebanner', 'showadvanced');
        $showadvanced = $showadvanced === null ? true : (bool)$showadvanced;
        $advancedtext = get_config('local_cookiebanner', 'advancedtext');
        $imprinturl = get_config('local_cookiebanner', 'imprinturl');
        $privacyurl = get_config('local_cookiebanner', 'privacyurl');

        $PAGE->requires->js_call_amd(
            'local_cookiebanner/banner',
            'init',
            [
                'text' => $cookietext,
                'showadvanced' => $showadvanced,
                'advancedtext' => $advancedtext,
                'imprinturl' => $imprinturl,
                'privacyurl' => $privacyurl,
            ]
        );

        if (isloggedin()) {
            $PAGE->requires->js_call_amd(
                'local_cookiebanner/init',
                'init',
                [
                    'hascookie' => $hascookie,
                ]
            );
        }
    }
}
