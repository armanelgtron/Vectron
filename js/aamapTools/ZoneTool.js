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

define([
    'aamapTools/BaseTool',
    'Mediator',
    'aamapObjects'
], function(BaseTool, Mediator, aamapObjects) {
    'use strict';

    var ZoneTool = BaseTool.extend({
        initialize: function (options) {
            ZoneTool.__super__.initialize.apply(this, arguments);

            this.set('name', 'zone');
        },

        connect: function () {
            Mediator.subscribe('canvas:mousedown', this.startMakeZone, this);
            Mediator.subscribe('canvas:mouseup', this.makeZone, this);
        },

        disconnect: function () {
            Mediator.unsubscribe('canvas:mousedown', this.startMakeZone, this);
            Mediator.unsubscribe('canvas:mouseup', this.makeZone, this);
        },

        startMakeZone: function (canvasInterface) {
            var cursorPos = canvasInterface.getCursorPos(this.get('allowSnap'));
            this.center = cursorPos;
        },

        makeZone: function (canvasInterface) {
            if (!this.center) {
                return;
            }

            var cursorPos = canvasInterface.getCursorPos(this.get('allowSnap'));
            var radius = cursorPos.getDistanceFromPoint(this.center);

            var zone = aamapObjects.createZone(
                this.center.x,
                this.center.y,
                radius,
                'death'
            );

            Mediator.publish('tool:createdObject', zone);
        }
    });

    return ZoneTool;
});
