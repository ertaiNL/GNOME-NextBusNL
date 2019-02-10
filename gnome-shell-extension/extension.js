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
const St = imports.gi.St;
const Tweener = imports.ui.tweener;

const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.assets.convenience;
const jsonApi = Me.imports.assets.jsonApi;
const nextBuses = Me.imports.assets.nextBuses;

//// Global variables ////

let _text, _button;
let _settings, _jsonApi, _nextBuses;

//// Public Methods ////

function init() {
    Gtk.IconTheme.get_default().append_search_path(Me.dir.get_path());
    _button = new St.Bin({ style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true });
    const icon = new St.Icon({ icon_name: 'NextBusNL_icon',
        style_class: 'system-status-icon' });

    _button.set_child(icon);
    _button.connect('button-press-event', showNextBus);

    // Create user-agent string from uuid and version

    _jsonApi = new jsonApi.JsonApi();
    _nextBuses = new nextBuses.NextBuses();
    _settings = Convenience.getSettings();
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
    const baseUrl = _settings.get_string('base-url');
    const timingPointCode = _settings.get_string('timing-point-code');

    _jsonApi.get(baseUrl + timingPointCode, function(json) {
        _text = new St.Label({ style_class: 'NextBusNL-label', text: _nextBuses.get(json, timingPointCode) });

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

