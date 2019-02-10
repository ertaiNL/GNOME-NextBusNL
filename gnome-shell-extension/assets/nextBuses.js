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

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}));
const Bus = Struct('time', 'text');

var NextBuses = new Lang.Class({
    Name: "NextBuses",

    get: function (json, timingPointCode) {
        if (!json || !json[timingPointCode]) {
            return 'No data found';
        } else {
            return this.getText(json, timingPointCode);
        }
    },

    getText: function (json, timingPointCode) {
        const buses = this.convertToBuses(json, timingPointCode);
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

    convertToBuses: function (json, timingPointCode) {
        const items = json[timingPointCode]['Passes'];
        const buses = [];

        for (let i = 0; i < Object.keys(items).length; i++) {
            const item = items[Object.keys(items)[i]];
            buses.push( Bus(item.ExpectedDepartureTime, this.formatBusText(item)) );
        }

        buses.sort(this.sortBusesOnTime);
        return buses;
    },

    formatBusText: function(item) {
        return this.formatDate(item.ExpectedDepartureTime) + ' -> ' + item.LinePublicNumber;
    },

    //function to pass to sort.
    sortBusesOnTime: function (busA, busB) {
        return busA.time.localeCompare(busB.time);
    },

    //format the date in a logical way
    formatDate: function (date) {
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
});