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
 * External function to delete the Moodle "remember username" cookie.
 *
 * @package    local_cookiebanner
 * @category   external
 * @copyright  2025 Thomas Winkler
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_cookiebanner\external;

use external_function_parameters;
use external_value;
use external_api;
use context_system;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

/**
 * Web service class to delete the Moodle "remember username" cookie.
 */
class delete_username_cookie extends external_api {
    /**
     * Describes the parameters for this web service (none).
     *
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([]);
    }

    /**
     * Deletes the MOODLEID1_ cookie by setting its expiration time in the past.
     *
     * @return array Result status
     */
    public static function execute() {
        global $CFG;
        require_login();

        // Ensure we're in a valid system context (e.g., not during installation).
        self::validate_context(context_system::instance());

        // Generate the correct cookie name based on Moodle config.
        $cookiename = 'MOODLEID1_' . $CFG->sessioncookie;
        $cookiesecure = is_moodle_cookie_secure();

        // Overwrite the cookie with an expired timestamp.
        setcookie(
            $cookiename,
            '',
            time() - 3600,
            $CFG->sessioncookiepath,
            $CFG->sessioncookiedomain,
            $cookiesecure,
            $CFG->cookiehttponly
        );

        return ['status' => 'deleted'];
    }

    /**
     * Describes the return value of this web service.
     *
     * @return \external_single_structure
     */
    public static function execute_returns() {
        return new \external_single_structure([
            'status' => new external_value(PARAM_TEXT, 'Result status'),
        ]);
    }
}
