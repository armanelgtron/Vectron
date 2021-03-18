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


var xml_name;
var xml_author;
var xml_dtd;
var xml_version;
var xml_category;
var xml_wallheight = 4;

function xml_init() {

    $('#files').change(function(e) {
        aamap_objects = [];
        xml_handle(e);
        gui_writeLog("Loading.");
    });
}  

function xml_process(xml) {

    var x;
    var y;
    var ptsx = [];
    var ptsy = [];

    var resource = $(xml).filter(":first");
    gui_writeLog(resource.attr("name"));
    xml_name = resource.attr("name");
    xml_author = resource.attr("author");
    xml_version = resource.attr("version");
    xml_category = resource.attr("category");
    gui_fillInput();

    $(xml).find("Spawn").each(function() {
        var spawn = $(this);
        var x = spawn.attr("x");
        var y = spawn.attr("y");
        var xdir = spawn.attr("xdir");
        var ydir = spawn.attr("ydir");

        var spawnOb = new Spawn();
        spawnOb.x = parseFloat(x);
        spawnOb.y = parseFloat(y);
        spawnOb.xDir = parseFloat(xdir);
        spawnOb.yDir = parseFloat(ydir);

        aamap_add(
            spawnOb
        );
    });

    $(xml).find("Zone").each(function() {
        var zone = $(this);
        var effect = zone.attr("effect");
        var radius = zone.find("ShapeCircle").attr("radius");
        x = zone.find("Point").attr("x");
        y = zone.find("Point").attr("y");
        ptsx.push(parseFloat(x));
        ptsy.push(parseFloat(y));
        aamap_add(
            new Zone(parseFloat(x), parseFloat(y), parseFloat(radius), zoneTool_whatType[effect])
        );
    });

    $(xml).find("Wall").each(function() {
        var wall = $(this);
        var points = [];
        wall.find("Point").each(function() {
            var x = $(this).attr("x");
            var y = $(this).attr("y");
            ptsx.push(parseFloat(x));
            ptsy.push(parseFloat(y));
            points.push(new WallPoint(parseFloat(x), parseFloat(y)));
        });
        var wallObj = new Wall();
        wallObj.points = points;
        wallObj.render();
        aamap_add(wallObj);
    });

    var max_x = Math.max.apply(Math, ptsx);
    var min_x = Math.min.apply(Math, ptsx);
    var max_y = Math.max.apply(Math, ptsy);
    var min_y = Math.min.apply(Math, ptsy);

    vectron_panX = -1*(max_x + min_x)/2;
    vectron_panY = -1*(max_y + min_y)/2;
    vectron_render();
}

function xml_write() {

}

function xml_load() {

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        gui_writeLog("File reading supported by your browser. Good. Clearing old map");
        vectron_render();
    } else {
        gui_writeLog("And you can't read files D:. Get chrome.");
    }
}

function xml_handle(evt) {
    var reader = new FileReader();
    reader.readAsText(evt.target.files[0]);
    var result;
    var self = this;
    reader.onload = function(evt) {
       xml_process(this.result);
    };
}
