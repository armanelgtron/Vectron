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

    function Zone(vectron, x, y, radius, type, id) {

        this.vectron = vectron;

        this.id = id;

        this.obj = this.vectron.screen.circle(0, 0, 0);

        this.x = x;
        this.y = y;
        this.radius = radius;

        this.type = type;

        this.xml = 'Zone';
        this.render();

        vectron.gui.writeLog("Zone at ("+x+", "+y+")");

    }  

    Zone.prototype = {

        constructor: Zone,

        render:function() {
            this.obj = this.vectron.screen.circle(this.vectron.map.realX(this.x),
                this.vectron.map.realY(this.y),
                this.radius*this.vectron.map.zoom).attr(
                    {"stroke": this.vectron.map.zoneTool.typeArray[this.type][1], "fill": this.vectron.map.zoneTool.typeArray[this.type][1], "fill-opacity": ".05"}
                );
        },

        /*
         *  Should this be based on the SCALE_FACTOR setting in the game or on map
         *  Coordinates?
         */ 
        scale:function(factor) {
            this.x *= factor;
            this.y *= factor;
            this.radius *= factor;
        }

    };

    return Zone;

});
