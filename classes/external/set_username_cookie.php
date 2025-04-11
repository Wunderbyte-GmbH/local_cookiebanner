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
 * External function to set the Moodle "remember username" cookie.
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
 * Web service class to set the Moodle "remember username" cookie for the current user.
 */
class set_username_cookie extends external_api {
    /**
     * Defines the parameters for the web service (none).
     *
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([]);
    }

    /**
     * Executes the logic to set the Moodle "remember username" cookie.
     *
     * @return array status of the operation
     */
    public static function execute() {
        global $USER;

        require_login();
        self::validate_context(context_system::instance());

        if (isguestuser()) {
            return ['status' => 'skipped'];
        }

        // Call Moodle core function to set the remember username cookie.
        set_moodle_cookie($USER->username);

        return ['status' => 'success'];
    }

    /**
     * Returns structure of the web service response.
     *
     * @return \external_single_structure
     */
    public static function execute_returns() {
        return new \external_single_structure([
            'status' => new external_value(PARAM_TEXT, 'Result status'),
        ]);
    }
}
