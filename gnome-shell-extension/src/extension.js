/*
 * Copyright (C) 2018  Rob Snelders
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
 * USA.
 */
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Tweener = imports.ui.tweener;
const Gio = imports.gi.Gio;

const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();

//// Global variables ////

let _httpSession, _userAgent;
let _text, _button;
let _settings, _baseUrl, _timingPointCode;

const JSON_ERROR_CODE = {
    NOTHING: 0,
    INVALID: -1
};

//// Public Methods ////

function init() {
    Gtk.IconTheme.get_default().append_search_path(Me.dir.get_path());
    _button = new St.Bin({ style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true });
    const icon = new St.Icon({ icon_name: 'NextBusNL',
        style_class: 'system-status-icon' });

    _button.set_child(icon);
    _button.connect('button-press-event', showNextBus);

    // Create user-agent string from uuid and version
    _userAgent = Me.metadata.uuid + '/' + Me.metadata.version.toString().trim();
    _httpSession = new Soup.Session();
    _httpSession.user_agent = _userAgent;

    _settings = getSettings();

    _baseUrl = _settings.get_string('base-url');
    _timingPointCode = _settings.get_string('timing-point-code');
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(_button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(_button);
}

//// Private methods ////

function hideText() {
    Main.uiGroup.remove_actor(_text);
    _text = null;
}

function showNextBus() {
    getJSON(_baseUrl + _timingPointCode, function(json) {
        _text = new St.Label({ style_class: 'NextBusNL-label', text: getTextToDisplay(json) });

        Main.uiGroup.add_actor(_text);
        _text.opacity = 255;

        const monitor = Main.layoutManager.primaryMonitor;

        _text.set_position(monitor.x + Math.floor(monitor.width / 2 - _text.width / 2),
                monitor.y + Math.floor(monitor.height / 2 - _text.height / 2));

        Tweener.addTween(_text,
                { opacity: 0,
                    time: 4,
                    transition: 'easeInQuad',
                    onComplete: hideText });
    });
}

function getTextToDisplay(json) {
    if (!json) {
        return '(0) No data found';
    } else if (json === JSON_ERROR_CODE.NOTHING) {
        return '(1) No data found';
    } else if (json === JSON_ERROR_CODE.INVALID) {
        return '(2) Data invalid';
    } else if (!json[_timingPointCode]) {
        return '(3) Data invalid';
    } else {
        return getNextBusesText(json);
    }
}

function getNextBusesText(json) {
    const buses = getNextBuses(json);
    const size = Math.min(buses.length, 3);
    let returnText = '';

    for (let i = 0;i<size;i++) {
        if (returnText !== '') {
            returnText+= '\n';
        }
        returnText+=buses[i].text;
    }
    return returnText;
}

function getNextBuses(json) {
    const items = json[_timingPointCode]['Passes'];
    const buses = [];

    for (let i=0; i < Object.keys(items).length; i++) {
        const item = items[Object.keys(items)[i]];
        buses.push( { time: item.ExpectedDepartureTime, text: formatDate(item.ExpectedDepartureTime) + ' -> ' + item.LinePublicNumber } );
    }

    buses.sort(sortBusesOnTime);
    return buses;
}

//function to pass to sort.
function sortBusesOnTime(busA, busB) {
    return busA.time.localeCompare(busB.time);
}

//format the date in a logical way
function formatDate(date) {
    const datePart = date.split('T');
    if (datePart.length !== 2) {
        return date;
    }
    const timePart = datePart[1].split(':');
    if (timePart.length !== 3) {
        return datePart[1];
    }
    return timePart[0] + ':' + timePart[1];
}

//get the json from the given url
function getJSON(url, func) {
    log('getJSON url = ' + url);
    _httpSession.abort();
    const message = Soup.form_request_new_from_hash('GET', url, {});

    _httpSession.queue_message(message, Lang.bind(this, function(_httpSession, message) {
        try {
            if (!message.response_body.data) {
                log('load_json_async got no JSON');
                func.call(this, JSON_ERROR_CODE.NOTHING);
                return;
            }
            func.call(this, JSON.parse(message.response_body.data));
        } catch (e) {
            log('load_json_async got a invalid JSON');
            func.call(this, JSON_ERROR_CODE.NOTHING);
        }
    }));
}

function getSettings() {
    let schema = 'org.gnome.shell.extensions.nextbusnl';

    const GioSSS = Gio.SettingsSchemaSource;

    // check if this extension was built with "make zip-file", and thus
    // has the schema files in a subfolder
    // otherwise assume that extension has been installed in the
    // same prefix as gnome-shell (and therefore schemas are available
    // in the standard folders)
    let schemaDir = Me.dir.get_child('schemas');
    let schemaSource;
    if (schemaDir.query_exists(null)) {
        schemaSource = GioSSS.new_from_directory(schemaDir.get_path(),
            GioSSS.get_default(),
            false);
    } else {
        schemaSource = GioSSS.get_default();
    }

    let schemaObj = schemaSource.lookup(schema, true);
    if (!schemaObj) {
        throw new Error('Schema ' + schema + ' could not be found for extension ' +
            Me.metadata.uuid + '. Please check your installation.');
    }

    return new Gio.Settings({settings_schema: schemaObj});
}
