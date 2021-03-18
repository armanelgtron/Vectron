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

var zoneTool_typeArray = {
    0: ["death", "#ff0000"],
    1: ["win", "#00a800"],
    2: ["target", "#00ff00"],
    3: ["rubber", "#ffc12b"],
    4: ["fortress", "#62bef6"]
}

var zoneTool_whatType = {
    "death":0,
    "win":1,
    "target":2,
    "rubber":3,
    "fortress":4
}

var zoneTool_radius = 1;
var zoneTool_guideObj = null;
var zoneTool_type = 0;


function zoneTool_connect() {
    $(".toolbar-toolZone").css("background-color", "rgba(0,0,0,0.3)");
}

function zoneTool_disconnect() {
    if(zoneTool_guideObj != null) zoneTool_guideObj.remove();
    $(".toolbar-toolZone").attr("style", "");
}

function zoneTool_guide() {
    if(zoneTool_guideObj != null) zoneTool_guideObj.remove();

    var realX = cursor_realX;
    var realY = cursor_realY;
    var radius = zoneTool_radius;
    zoneTool_guideObj = vectron_screen.circle(realX, realY,
        radius*vectron_zoom).attr(
        {"stroke": zoneTool_typeArray[zoneTool_type][1],"stroke-dasharray": "--..", "fill": zoneTool_typeArray[zoneTool_type][1], "fill-opacity": "0.2"}
    );  
}


function zoneTool_complete() {

    var newX = aamap_mapX(cursor_realX);
    var newY = aamap_mapY(cursor_realY);
    var radius = zoneTool_radius;


    var prevObjs = aamap_objects;
    for(var i = 0; i < prevObjs.length; i++) {
        if(prevObjs[i] instanceof Zone) {
            if(prevObjs[i].x == newX && prevObjs[i].y == newY &&
                prevObjs[i].radius == radius) {

                gui_writeLog("Prevented Duplicate Zone anytype.<br>" +
                    "Check settings to disable this feature.");
                return;
            }
        }
    }
    aamap_add(new Zone(newX, newY, radius, zoneTool_type));
    zoneTool_guideObj.remove();
    vectron_render();
}
