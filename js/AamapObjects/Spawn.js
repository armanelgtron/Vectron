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

function Spawn() {

    this.objectID = vectron_objectID;
    vectron_objectID++;

    this.obj = vectron_screen.path();
    this.obj.data("id", this.objectID);

    this.guideObj = vectron_screen.path();

    this.isSelected = false;
    this.glowObj = null;

    this.x = Math.round(100*aamap_mapX(cursor_realX))/100;
    this.y = Math.round(100*aamap_mapY(cursor_realY))/100;
    this.xDir = 1;
    this.yDir = 0;

    this.spawnPathArray = [];

    this.xml = 'Spawn';

    this.toDegrees = function() {
        var rad = Math.atan2(this.yDir, this.xDir);
        var rotation = rad / Math.PI * 180;

        //Rotates in raphael are clockwise, atan2 is counterclockwise.
        rotation *= -1;
        return rotation;
    }

    this.guideUpdate = function() {
        var axes = 8;

        // get mouse cursor's distance from spawn's center
        var diffX = aamap_mapX(cursor_realX) - this.x;
        var diffY = aamap_mapY(cursor_realY) - this.y;

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
        this.xDir = Math.round(Math.cos(snapRad));
        this.yDir = Math.round(Math.sin(snapRad));

        // sin and cos functions return weird numbers in some cases...
        // fix required
        if(snapRad == Math.PI / 2 || snapRad == -Math.PI / 2)
            this.xDir = 0;
        else if(snapRad == Math.PI || snapRad == -Math.PI)
            this.yDir = 0;
    }

    this.render = function() {
        if(this.obj != null) this.obj.remove();
        if(this.guideObj != null) this.guideObj.remove();
        if(this.glowObj != null) this.glowObj.remove();

        var x = aamap_realX(this.x);
        var y = aamap_realY(this.y);
        var scale = vectron_zoom;
        this.obj = vectron_screen.path(
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

        if(this.isSelected) {
            selectTool_addHoverSetSelected(this);
        } else if(vectron_currentTool == "select") {
            selectTool_addHoverSet(this);
        }
    }

    this.guide = function() {
        if(this.guideObj != null) this.guideObj.remove();
        this.guideUpdate();
        var x = aamap_realX(this.x);
        var y = aamap_realY(this.y);
        var scale = vectron_zoom;
        this.guideObj = vectron_screen.path(
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
    }

    this.guide();

    this.scale = function(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    this.move = function(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    this.getXML = function() {
        //<Spawn x="" y="" xdir="" ydir=""/>
        //<Zone effect=""><ShapeCircle radius="" growth=""><Point x="" y=""/></ShapeCircle></Zone>
        return '<Spawn x="'+ this.x +'" y="'+ this.y +'" xdir="'+ this.xDir +'" ydir="'+ this.yDir +'"/>';
    }

    this.outputFriendlyXML = function() {
        gui_writeLog(escapeHtml('<Spawn x="'+ this.x +'" y="'+ this.y +'" xdir="'+ this.xDir +'" ydir="'+ this.yDir +'"/>'));
    }


}  
