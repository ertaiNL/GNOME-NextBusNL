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
const Soup = imports.gi.Soup;
const Me = imports.misc.extensionUtils.getCurrentExtension();

var JsonApi = new Lang.Class({
    Name: "JsonApi",
    _httpSession: null,

    _init: function() {
        this._httpSession = new Soup.Session();
        this._httpSession.user_agent = Me.metadata.uuid + '/' + Me.metadata.version.toString().trim();
    },

    //get the json from the given url
    get: function(url, func) {
        var result;
        log('get url = ' + url);
        this._httpSession.abort();
        const message = Soup.form_request_new_from_hash('GET', url, {});

        this._httpSession.queue_message(message, Lang.bind(this, function(httpSession, message) {
            try {
                if (!message.response_body.data) {
                    log('load_json_async got no JSON');
                    func.call(this, null);
                    return;
                }
                func.call(this, JSON.parse(message.response_body.data));
            } catch (e) {
                log('load_json_async got a invalid JSON');
                func.call(this, null);
            }
        }));
    }

});