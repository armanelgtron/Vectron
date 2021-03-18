/*
********************************************************************************
Vectron - map editor for Armagetron Advanced.
Copyright (C) 2014  Tristan Whitcher    (tristan.whitcher@gmail.com)
David Dubois        (ddubois@jotunstudios.com)
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

define([], function() {

    function Spawn(vectron, id) {

        this.vectron = vectron;

        this.id = id;

        this.obj = this.vectron.screen.path();
        this.guideObj = this.vectron.screen.path();

        this.x = vectron.map.mapX(vectron.cursor.realX);
        this.y = vectron.map.mapY(vectron.cursor.realY);
        this.xDir = 1;
        this.yDir = 0;

        this.spawnPathArray = [];

        this.xml = 'Spawn';

    }  

    Spawn.prototype = {

        constructor: Spawn,

        toDegrees:function() {
            var rad = Math.atan2(this.yDir, this.xDir);
            var rotation = rad / Math.PI * 180;

            //Rotates in raphael are clockwise, atan2 is counterclockwise.
            rotation *= -1;
            return rotation;
        },

        guideUpdate:function() {
            var axes = 8;

            // get mouse cursor's distance from spawn's center
            var diffX = this.vectron.map.mapX(this.vectron.cursor.realX) - this.x;
            var diffY = this.vectron.map.mapY(this.vectron.cursor.realY) - this.y;

            // get the real angle in radians
            var rad = Math.atan2(diffY,diffX);

            // add half axes portion for better interaction
            // i.e. let the arrow follow the mouse cursor
            rad += Math.PI / axes;

            // divide the circumference by current map axes
            // (snap spawn rotation to axes)
            var fraction = Math.floor(rad / Math.PI * axes / 2);

            // recalculate the snapped angle in radians
            var snapRad = (Math.PI * fraction) / axes * 2;

            // get sine and cosine
            this.xDir = Math.cos(snapRad);
            this.yDir = Math.sin(snapRad);

            // sin and cos functions return weird numbers in some cases...
            // fix required
            if(snapRad == Math.PI / 2 || snapRad == -Math.PI / 2)
                this.xDir = 0;
            else if(snapRad == Math.PI || snapRad == -Math.PI)
                this.yDir = 0;

        },

        render:function() {
            if(this.ob != null)
                this.obj.remove();
            if(this.guideObj != null)
                this.guideObj.remove();
            var x = this.vectron.map.realX(this.x);
            var y = this.vectron.map.realY(this.y);
            var scale = this.vectron.map.zoom;
            this.obj = this.vectron.screen.path(
                    [
                        "M", x, y,
                        "L", x - scale/2, y,
                             x + scale/2, y,
                        "M", x + scale/2, y,
                        "L", x, y - scale/3,
                        "M", x + scale/2, y,
                        "L", x, y + scale/3
                    ]
                )
                .attr({stroke: "#FF8ABE", "fill": "#FF8ABE"})
                .transform("R" + this.toDegrees());
        },

        guide:function() {
            if(this.guideObj != null)
                this.guideObj.remove();
            this.guideUpdate();
            var x = this.vectron.map.realX(this.x);
            var y = this.vectron.map.realY(this.y);
            var scale = this.vectron.map.zoom;
            this.guideObj = this.vectron.screen.path(
                [
                    "M", x, y,
                    "L", x - scale/2, y,
                         x + scale/2, y,
                    "M", x + scale/2, y,
                    "L", x, y - scale/3,
                    "M", x + scale/2, y,
                    "L", x, y + scale/3
                ]
            )
                .attr({stroke: "#FF3333", "fill": "#FF8ABE"})
                .transform("R" + this.toDegrees());
        },

        /*
         *  Should this be based on the SCALE_FACTOR setting in the game or on map
         *  Coordinates?
         */ 
        scale:function(factor) {
            this.x *= factor;
            this.y *= factor;
        }

    };

    return Spawn;

});
