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

var gui_active = false;

function gui_init() {
    gui_writeLog("Welcome to Vectron.")
}

function gui_writeLog(message) {
    $('#debug_stream').append('<span>' + message + '</span');
    var element = document.getElementById("debug_stream");
    element.scrollTop = element.scrollHeight;
}

function gui_clearLog() {
    //$('#debug_stream').clear();
}

function gui_show() {
    map_active = false;
    gui_active = true;
    $('#control_box').show();
}

function gui_hide() {
    $('#control_box').hide();
    gui_active = false;
    map_active = true;
}

function gui_fillInput() {
    $("#map_name").val(xml_name);
    $("#map_author").val(xml_author)
    $("#map_category").val(xml_category);
    $("#map_version").val(xml_version)
    $("#map_dtd").val("sty.dtd");
}
