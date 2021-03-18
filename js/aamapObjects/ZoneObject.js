/*
********************************************************************************
Vectron - map editor for Armagetron Advanced.
Copyright (C) 2014  Tristan Whitcher    (tristan.whitcher@gmail.com)
David Dubois        (ddubois@jotunstudios.com)
Carlo Veneziano     (carlorfeo@gmail.com)
********************************************************************************

This file is part of Vectron.

Vectron is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Vectron is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Vectron.  If not, see <http://www.gnu.org/licenses/>.

*/

define(['aamapObjects/AamapObject'], function(AamapObject) {
    'use strict';

    var zoneColors = {
           death: '#ff0000', // red
             win: '#00ff00', // green
        fortress: '#62bef6', // lt blue
          target: '#ff00ff', // purple
          rubber: '#ff8800'  // orange
    };

    var ZoneObject = AamapObject.extend({
        initialize: function (options) {
            ZoneObject.__super__.initialize.apply(this, arguments);

            this.type = 'zone';
        },

        getColor: function () {
            if (zoneColors[this.get('effect')]) {
                return zoneColors[this.get('effect')];
            }
            return '#fff';
        }
    });

    return ZoneObject;
});
