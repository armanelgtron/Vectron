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

var cursor_snap = true;
var cursor_active = true;

var cursor_realX;
var cursor_realY;

var cursor_neverSnappedX;
var cursor_neverSnappedY;

var cursor_obj;

var cursor_pageX;
var cursor_pageY;



function cursor_init() {
   cursob_obj = vectron_screen.path();
}

function cursor_render(newX, newY, spacing) {
    if(cursor_obj != null)
        cursor_obj.remove();

    if(cursor_snap) {

        var midWidth = vectron_width/2 + (vectron_zoom * vectron_panX);
        var midHeight = vectron_height/2 - (vectron_zoom * vectron_panY);

        cursor_realX = (midWidth) - Math.round(((midWidth) - newX) /
            spacing) * spacing;

        cursor_realY = (midHeight) - Math.round(((midHeight) - newY) /
            spacing) * spacing;

    } else {
        cursor_realX = newX;
        cursor_realY = newY;
    }
        

    cursor_neverSnappedX = newX;
    cursor_neverSnappedY = newY;

    if(!cursor_active) return;

    cursor_obj = vectron_screen.path(
        ['M', cursor_realX - 7, cursor_realY,
         'L', cursor_realX - 2, cursor_realY,
         'M', cursor_realX + 2, cursor_realY,
         'L', cursor_realX + 7, cursor_realY,
         'M', cursor_realX, cursor_realY - 7,
         'L', cursor_realX, cursor_realY - 2,
         'M', cursor_realX, cursor_realY + 2,
         'L', cursor_realX, cursor_realY + 7
         ]
    );

}

function cursor_show() {
    cursor_active = true;
}

function cursor_hide() {
    cursor_active = false;
    cursor_obj.remove();
}

