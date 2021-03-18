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

function Zone(x, y, radius, type) {

    this.objectID = vectron_objectID;
    vectron_objectID++;

    this.obj = vectron_screen.circle(0, 0, 0);
    this.obj.data("id", this.objectID);

    this.isSelected = false;
    this.glowObj = null;

    this.x = x;
    this.y = y;
    this.radius = radius;

    this.type = type;

    this.xml = 'Zone';

    this.render = function() {
        if(this.obj != null) this.obj.remove();
        if(this.glowObj != null) this.glowObj.remove();
        
        this.obj = vectron_screen.circle(aamap_realX(this.x),
            aamap_realY(this.y),
            this.radius*vectron_zoom).attr(
                {"stroke": zoneTool_typeArray[this.type][1], "fill": zoneTool_typeArray[this.type][1], "fill-opacity": ".05"}
        );


        if(this.isSelected) {
            selectTool_addHoverSetSelected(this);
        } else if(vectron_currentTool == "select") {
            selectTool_addHoverSet(this);
        }
    }

    this.scale = function(factor) {
        this.x *= factor;
        this.y *= factor;
        this.radius *= factor;
    }

    this.move = function(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    this.getXML = function() {
        //<Zone effect=""><ShapeCircle radius="" growth=""><Point x="" y=""/></ShapeCircle></Zone>
        return '<Zone effect="' + zoneTool_typeArray[this.type][0] +'"><ShapeCircle radius=" '+ this.radius +' " growth=""><Point x="' + this.x + '" y="' + this.y + '"/></ShapeCircle></Zone>';
    }

    this.outputFriendlyXML = function() {
        gui_writeLog(escapeHtml('<Zone effect="' + zoneTool_typeArray[this.type][0] +'"><ShapeCircle radius=" '+ this.radius +' " growth=""><Point x="' + this.x + '" y="' + this.y + '"/></ShapeCircle></Zone>'));
    }

} 

