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

const Gettext = imports.gettext.domain('nextbusnl');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.assets.convenience;
const api = Me.imports.assets.api;

//// Global variables ////

let _button, _nextBusesBox;
let _settings, _api;

//// Public Methods ////

function init() {
    Gtk.IconTheme.get_default().append_search_path(Me.dir.get_path());
    const icon = new St.Icon({ icon_name: 'NextBusNL_icon', style_class: 'system-status-icon' });

    _button = new St.Bin({ style_class: 'panel-button', reactive: true, can_focus: true, track_hover: true });
    _button.set_child(icon);
    _button.connect('button-press-event', _showNextBus);

    _api = new api.Api();
    _settings = Convenience.getSettings();
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(_button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(_button);
}

//// Private methods ////
function _hideNextBuses() {
    Main.uiGroup.remove_actor(_nextBusesLayout);
    _nextBusesLayout = null;
}

function _showNextBus() {
    const baseUrl = _settings.get_string('base-url');
    const timingPointCode = _settings.get_string('timing-point-code');

    _api.getNextBuses(baseUrl, timingPointCode, function(buses) {
        _nextBusesBox = new St.BoxLayout({ vertical: true, style_class: 'NextBusNL-outer-layoutbox' });

        _addBusesToActor(_nextBusesBox, buses);

        Main.uiGroup.add_actor(_nextBusesBox);

        _nextBusesBox.set_position(_getXPosition(_nextBusesBox), _getYPosition(_nextBusesBox));

        Tweener.addTween(_nextBusesBox, {opacity: 0, time: 4, transition: 'easeInQuad', onComplete: _hideNextBuses});
    });
}

function _getMonitor() {
    return Main.layoutManager.primaryMonitor;
}

function _getXPosition(box) {
    const monitor = _getMonitor();
    return monitor.x + Math.floor(monitor.width / 2 - box.width / 2);
}

function _getYPosition(box) {
    const monitor = _getMonitor();
    return monitor.y + Math.floor(monitor.height / 2 - box.height / 2);
}

function _addBusesToActor(box, buses) {
    const size = Math.min(buses.length, 5);
    if (size === 0) {
        _addTextToBox(box, _("No buses found"));
    } else {
        for (let i = 0; i < size; i++) {
            _addBusToBox(box, buses[i]);
        }
    }
}

function _addBusToBox(box, bus) {
    const layout = new St.BoxLayout({ vertical: false, style_class: 'NextBusNL-inner-layoutbox' });
    layout.add_actor(new St.Label({ style_class: 'NextBusNL-font', text: _formatBusTime(bus)}));
    layout.add_actor(new St.Label({ style_class: 'NextBusNL-font NextBusNL-right', text: _formatBusLine(bus)}));
    layout.add_actor(new St.Label({ style_class: 'NextBusNL-font', text: _formatBusDestination(bus)}));
    box.add(layout);
}

function _addTextToBox(box, text) {
    const layout = new St.BoxLayout({ vertical: false, style_class: 'NextBusNL-inner-layoutbox' });
    layout.add_actor(new St.Label({ style_class: 'NextBusNL-font', text: text}));
    box.add(layout);
}

function _formatBusTime(bus) {
    let d = new Date(bus.time);
    return d.toLocaleTimeString(Gettext.locale, {hour: '2-digit', minute:'2-digit'}) + " -> ";
}

function _formatBusLine(bus) {
    return bus.line;
}

function _formatBusDestination(bus) {
    return " " + bus.destination;
}
