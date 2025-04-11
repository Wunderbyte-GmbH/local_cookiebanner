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
 * Module Wizard external functions and service definitions.
 *
 * @package local_cookiebanner
 * @category external
 * @copyright 2025 Wunderbyte GmbH (info@wunderbyte.at)
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
$functions = [
    'local_cookiebanner_set_username_cookie' => [
        'classname'   => 'local_cookiebanner\external\set_username_cookie',
        'methodname'  => 'execute',
        'classpath'   => '',
        'description' => 'Sets the Moodle remember username cookie',
        'type'        => 'write',
        'ajax'        => true,
        'loginrequired' => true,
    ],
    'local_cookiebanner_delete_username_cookie' => [
        'classname'   => 'local_cookiebanner\external\delete_username_cookie',
        'methodname'  => 'execute',
        'classpath'   => '',
        'description' => 'Deletes the Moodle remember username cookie',
        'type'        => 'write',
        'ajax'        => true,
        'loginrequired' => true,
    ],
];
