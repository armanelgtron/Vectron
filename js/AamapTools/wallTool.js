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

/**
 * Represents a wall point OBJECT
 *
 */
function WallPoint(x, y) {
    this.x = x;
    this.y = y;
}

var wallTool_currentObj = null;

function wallTool_connect() {
    $(".toolbar-toolWall").css("background-color", "rgba(0,0,0,0.3)");
}

function wallTool_disconnect() {
    if(wallTool_currentObj != null) {
        wallTool_currentObj.obj.remove();
        wallTool_currentObj.guideObj.remove();
        wallTool_currentObj = null;
    }
    vectron_toolActive = false;
    $(".toolbar-toolWall").attr("style", "");
}

function wallTool_start() {
    wallTool_currentObj = new Wall();
    wallTool_currentObj.points.push(
        new WallPoint(
            aamap_mapX(cursor_realX),
            aamap_mapY(cursor_realY))
    );

    wallTool_currentObj.render();
    vectron_toolActive = true;
}

function wallTool_progress() {
    var newX = Math.round(100*aamap_mapX(cursor_realX))/100;
    var newY = Math.round(100*aamap_mapY(cursor_realY))/100;

    var prevPoint = wallTool_currentObj.points[wallTool_currentObj.points.length-1];

    if(newX == prevPoint.x && newY == prevPoint.y) {
        gui_writeLog("Prevented Duplicate points.");
        return;
    }
    wallTool_currentObj.points.push( new WallPoint(newX, newY) );
    wallTool_currentObj.render();
}

function wallTool_complete() {
    wallTool_progress();
    if(wallTool_currentObj.points.length < 2) {
        wallTool_currentObj.obj.remove();
        wallTool_currentObj.guideObj.remove();
        wallTool_currentObj = null;
        vectron_toolActive = false;
        gui_writeLog("Wall canceled, < 2 points");
        return;
    } else {
        var last = wallTool_currentObj.points[wallTool_currentObj.points.length-1];
        var secLast = wallTool_currentObj.points[wallTool_currentObj.points.length-2];
        if(last.x == secLast.x && last.y == secLast.y) {
            wallTool_currentObj.points.pop();
            gui_writeLog("Removed duplicate point at end of wall.");
        }
    }
    wallTool_currentObj.guideObj.remove();
    aamap_add(wallTool_currentObj);
    wallTool_currentObj = null;
    vectron_toolActive = false;
}
