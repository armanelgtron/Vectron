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
    cursor_active = true;
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



var __navigationTool_panX = 0, __navigationTool_panY = 0;
var __navigationTool_pan_timeout;
var __navigationTool_render_pan_custom = null;
var __navigationTool_check_pan = function()
{
    if(__navigationTool_panX == __navigationTool_panY && __navigationTool_panX == 0)
    {
        __navigationTool_panX = aamap_realX(vectron_panX);
        __navigationTool_panY = aamap_realY(vectron_panY);
    }
}
var __navigationTool_render_pan = function()
{
    var xdir = (__navigationTool_panX - aamap_realX(vectron_panX))/2;
    var ydir = (__navigationTool_panY - aamap_realY(vectron_panY))/2;
    vectron_screen.setViewBox(xdir, ydir, vectron_width, vectron_height);

    var bbox = aamap_grid.getBBox();
    aamap_grid.translate(
        (Math.round(xdir/vectron_zoom)*vectron_zoom)-(bbox.x-(aamap_grid.bbox.x)),
        (Math.round(ydir/vectron_zoom)*vectron_zoom)-(bbox.y-(aamap_grid.bbox.y))
    );

    clearTimeout(__navigationTool_pan_timeout);
    __navigationTool_pan_timeout = setTimeout(function()
    {
        __navigationTool_panX=__navigationTool_panY=0;
        vectron_render();
        if(__navigationTool_render_pan_custom)
            __navigationTool_render_pan_custom();
    },100);
}
function navigationTool_manualPan(x,y)
{
    __navigationTool_check_pan();
    vectron_panX += x;
    vectron_panY += y;
    __navigationTool_render_pan();
}

function navigationTool_autopan(customFunc)
{
    if(customFunc)
    {
        __navigationTool_render_pan_custom = customFunc;
    }

    if(cursor_pageY+20 > vectron_height)
    {
        navigationTool_manualPan(0,0.5);
    }
    if(cursor_pageY < 20)
    {
        navigationTool_manualPan(0,-0.5);
    }
    if(cursor_pageX+20 > vectron_width)
    {
        navigationTool_manualPan(-0.5,0);
    }
    if(cursor_pageX < 20)
    {
        navigationTool_manualPan(0.5,0);
    }
}
