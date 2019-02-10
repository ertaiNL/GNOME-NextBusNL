/*
 * Copyright (C) 2019  Rob Snelders
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
const Lang = imports.lang;
const Gettext = imports.gettext.domain('nextbusnl');
const _ = Gettext.gettext;

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}));
const Bus = Struct('time', 'text');

var NextBuses = new Lang.Class({
    Name: "NextBuses",

    get: function (json, timingPointCode) {
        if (!json || !json[timingPointCode]) {
            return _('No data found');
        } else {
            return this._getText(json, timingPointCode);
        }
    },

    _getText: function (json, timingPointCode) {
        const buses = this._convertToBuses(json, timingPointCode);
        const size = Math.min(buses.length, 3);
        let returnText = '';

        for (let i = 0; i < size; i++) {
            if (returnText !== '') {
                returnText += '\n';
            }
            returnText += buses[i].text;
        }
        return returnText;
    },

    _convertToBuses: function (json, timingPointCode) {
        const items = json[timingPointCode]['Passes'];
        const buses = [];

        for (let i = 0; i < Object.keys(items).length; i++) {
            const item = items[Object.keys(items)[i]];
            buses.push( Bus(item.ExpectedDepartureTime, this._formatBusText(item)) );
        }

        buses.sort(this._sortBusesOnTime);
        return buses;
    },

    _formatBusText: function(item) {
        return this._formatDate(item.ExpectedDepartureTime) + ' -> ' + item.LinePublicNumber;
    },

    _sortBusesOnTime: function (busA, busB) {
        return busA.time.localeCompare(busB.time);
    },

    _formatDate: function (date) {
        let d = new Date(date);
        return d.toLocaleTimeString(Gettext.locale, {hour: '2-digit', minute:'2-digit'});
    }
});