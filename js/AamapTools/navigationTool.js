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

var navigationTool_currentObj = null;

var navigationTool_clickX, navigationTool_clickY;
var navigationTool_startPanX = null, navigationTool_startPanY = null;

function navigationTool_connect()
{
    $(".toolbar-toolNavigation").css("background-color", "rgba(0,0,0,0.3)");
    cursor_active = false;
}

function navigationTool_disconnect()
{
    $(".toolbar-toolNavigation").attr("style", "");
    vectron_toolActive = false;
}

function navigationTool_start()
{
    vectron_toolActive = true;

    navigationTool_clickX = cursor_realX;
    navigationTool_clickY = cursor_realY;

    if(navigationTool_startPanX == null) {
        navigationTool_startPanX = vectron_panX;
    }
    if(navigationTool_startPanY == null) {
        navigationTool_startPanY = vectron_panY;
    }
}

function navigationTool_progress()
{
    var xdir = navigationTool_clickX - cursor_pageX;
    var ydir = navigationTool_clickY - cursor_pageY;
    vectron_screen.setViewBox(xdir, ydir, vectron_width, vectron_height);
    var bbox = aamap_grid.getBBox();
    aamap_grid.translate(
        (Math.round(xdir/vectron_zoom)*vectron_zoom)-(bbox.x-(aamap_grid.bbox.x)),
        (Math.round(ydir/vectron_zoom)*vectron_zoom)-(bbox.y-(aamap_grid.bbox.y))
    );
}

function navigationTool_complete()
{
    vectron_panX = navigationTool_startPanX + ((cursor_pageX - navigationTool_clickX) / vectron_zoom);
    vectron_panY = navigationTool_startPanY + ((navigationTool_clickY - cursor_pageY) / vectron_zoom);

    vectron_toolActive = false;
    navigationTool_startPanX = null;
    navigationTool_startPanY = null;

    vectron_render();
    cursor_render(cursor_pageX, cursor_pageY, vectron_zoom);
}