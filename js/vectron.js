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

var vectron_width;
var vectron_height;

var vectron_screen;

var vectron_tools = ["select", "wall", "zone", "spawn"];
var vectron_currentTool = "";
var vectron_toolActive = false;

var vectron_zoom = 15;
var vectron_panX = 0;
var vectron_panY = 0;

var vectron_objectID = 0;


/**
 * Initializes everything here.
 */
function vectron_init() {

    vectron_width = $("#canvas_container").width();
    vectron_height = $("#canvas_container").height();

    vectron_screen = new Raphael(document.getElementById('canvas_container'), vectron_width, vectron_height);

    gui_init();

    cursor_init();

    aamap_init();

    eventHandler_init();

    vectron_render();

    xml_init();

    xml_process(vectron_startupXML);

    vectron_connectTool("select");
}

/**
 * Renders Vectron
 */
function vectron_render() {

    vectron_screen.clear();
    vectron_width = $("#canvas_container").width();
    vectron_height = $("#canvas_container").height();
    vectron_screen.setSize(vectron_width, vectron_height);
    vectron_screen.setViewBox(0, 0, vectron_width, vectron_height);
    aamap_render();

}

function vectron_disconnectTool() {
    if(vectron_toolActive) {
        gui_writeLog("Cannot disconnect active tool. Try canceling current Action.");
        return false;
    }

    if(vectron_tools.indexOf(vectron_currentTool) >= 0) {
        window[vectron_currentTool + "Tool_disconnect"]();
        vectron_currentTool = "";
    }

    return true;
}

function vectron_connectTool(toolName) {
    if(vectron_tools.indexOf(toolName) >= 0 && (vectron_currentTool != toolName) && vectron_disconnectTool()) {
        window[toolName + "Tool_connect"]();
        //connect tool and set currenttool
        vectron_currentTool = toolName;
        gui_writeLog(toolName + " connected.");
        return true;
    }
    return false;
}

window.onload = function() {
    vectron_init();
    console.log(vectron_width);
}

function vectron_saveTextAsFile(xml, filename)
{
    var textToWrite = xml;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = filename;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = vectron_destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function vectron_destroyClickedElement(event) {
    document.body.removeChild(event.target);
}


var vectron_startupXML ='<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><!DOCTYPE Resource SYSTEM "sty.dtd"><Resource type="aamap" name="Vectron" version="0.2" author="Tristan" category="art"><Map version="0.2.8"><World><Field><Axes number="8"/><Wall height="4"><Point x="-1" y="4"/><Point x="-3" y="4"/></Wall><Wall height="4"><Point x="-1" y="4"/><Point x="1" y="4"/></Wall><Wall height="4"><Point x="-1" y="4"/><Point x="-1" y="0"/></Wall><Wall height="4"><Point x="-4" y="3"/><Point x="-5" y="4"/><Point x="-7" y="4"/><Point x="-8" y="3"/><Point x="-8" y="1"/><Point x="-7" y="0"/><Point x="-5" y="0"/><Point x="-4" y="1"/></Wall><Wall height="4"><Point x="-9" y="4"/><Point x="-12" y="4"/><Point x="-13" y="3"/><Point x="-13" y="1"/><Point x="-12" y="0"/><Point x="-9" y="0"/></Wall><Wall height="4"><Point x="-13" y="2"/><Point x="-10" y="2"/></Wall><Wall height="4"><Point x="-14" y="4"/><Point x="-16" y="0"/><Point x="-18" y="4"/></Wall><Wall height="4"><Point x="2" y="0"/><Point x="2" y="4"/></Wall><Wall height="4"><Point x="2" y="2"/><Point x="6" y="2"/></Wall><Wall height="4"><Point x="6" y="2"/><Point x="6" y="3"/><Point x="5" y="4"/><Point x="2" y="4"/></Wall><Wall height="4"><Point x="4" y="2"/><Point x="6" y="0"/></Wall><Zone effect="death"><ShapeCircle radius=" 2 " growth=""><Point x="9" y="2"/></ShapeCircle></Zone><Wall height="4"><Point x="12" y="0"/><Point x="12" y="4"/><Point x="16" y="0"/><Point x="16" y="4"/></Wall><Spawn x="-6" y="2" xdir="1" ydir="0"/></Field></World></Map></Resource>';



