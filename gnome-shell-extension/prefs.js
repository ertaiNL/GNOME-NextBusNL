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
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.assets.convenience;

const Gettext = imports.gettext.domain('nextbusnl');
const _ = Gettext.gettext;

const BASE_URL_KEY = 'base-url';
const TIMING_POINT_CODE_KEY = 'timing-point-code';

const PrefsWidget = new GObject.Class({
    Name: 'NextBusNL.prefs.prefsWidget',
    GTypeName: 'prefsWidget',
    Extends: Gtk.Grid,

    _init : function(params) {
        this.parent(params);
        this.set_size_request(-1,1);
        this.set_orientation(Gtk.Orientation.VERTICAL);

        this._settings = Convenience.getSettings();
        this._addBaseUrlItem();
        this._addTimingPointCodeItem();
    },

    _addBaseUrlItem: function() {
        let baseUrlHBox = this._addSettingItemBase(_("Base URL"));

        this.baseUrlBuffer = new Gtk.EntryBuffer( { text: this._settings.get_string( BASE_URL_KEY ) } );
        let baseUrlInput = new Gtk.Entry( { buffer: this.baseUrlBuffer, max_length: 120 } );
        baseUrlInput.connect('changed',Lang.bind(this,this._changeBaseUrl));
        baseUrlHBox.add( baseUrlInput );
    },

    _addTimingPointCodeItem: function() {
        let timingPointCodeHBox = this._addSettingItemBase(_("Timing Point Code"));

        this.timingPointCodeBuffer = new Gtk.EntryBuffer( { text: this._settings.get_string( TIMING_POINT_CODE_KEY ) } );
        let timingPointCodeInput = new Gtk.Entry( { buffer: this.timingPointCodeBuffer, max_length: 120 } );
        timingPointCodeInput.connect('changed',Lang.bind(this,this._timingPointCodeUrl));
        timingPointCodeHBox.add( timingPointCodeInput );
    },

    _addSettingItemBase: function(text) {
        let settingHBox = new Gtk.HBox( {margin:10, spacing: 20, hexpand: true} );
        let settingText = new Gtk.Label({label: text, halign: Gtk.Align.START});

        settingHBox.add( settingText );
        this.add(settingHBox);

        return settingHBox;
    },

    _changeBaseUrl: function() {
        let currentValue = this.baseUrlBuffer.get_text();
        this._settings.set_string(BASE_URL_KEY,currentValue);
    },

    _timingPointCodeUrl: function() {
        let currentValue = this.timingPointCodeBuffer.get_text();
        this._settings.set_string(TIMING_POINT_CODE_KEY,currentValue);
    }

});

function init() {
    Convenience.initTranslations();
}

function buildPrefsWidget() {
    let widget = new PrefsWidget({ margin: 12 });
    widget.show_all();
    return widget;
}