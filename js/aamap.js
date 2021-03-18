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

var aamap_active = true;
var aamap_xml = '';
var aamap_objects = [];

var aamap_grid = null;

function aamap_init() {
    //nthing here
    aamap_render();
}

function aamap_save(name, author, category, version, dtd) {
    var fileName = name + "-" + version + ".aamap.xml";
    var xml = "";

    xml += '<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>'+"\n";
    xml += '<!DOCTYPE Resource SYSTEM "' + dtd + '">'+"\n";
    xml += '<Resource type="aamap" name="'+ name +'" version="'+ version +'" author="'+ author +'" category="'+ category +'">'+"\n";
    xml += '<Map version="0.2.8">'+"\n";
            xml += '<World>'+"\n";
                xml += '<Field>'+"\n";
                    xml += '<Axes number="8"/>'+"\n";
                            for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
                                xml += aamap_objects[i].getXML();
                                xml += "\n";
                            }
                xml += '</Field>'+"\n";
            xml += '</World>'+"\n";
        xml += '</Map>'+"\n";
    xml += '</Resource>';

    vectron_saveTextAsFile(xml, fileName);
}

function aamap_render() {
    aamap_drawGrid();

    for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
        aamap_objects[i].render();
    }

    if(vectron_currentTool == "wall" && vectron_toolActive)
        wallTool_currentObj.render();
}

function aamap_panCenter() {
    var ptsx = [];
    var ptsy = [];

    for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
        var obj = aamap_objects[i];
        if(obj instanceof Zone || obj instanceof Spawn) {
            ptsx.push(obj.x);
            ptsy.push(obj.y);
        } else if(obj instanceof Wall) {
            for(var j = 0, jj = obj.points.length; j < jj; j++) {
            	if(obj.points[i] != null) {
	                ptsx.push(obj.points[i].x);
	                ptsy.push(obj.points[i].y);
	            }
            }
        }
    }

    if(ptsx.length == 0) ptsx.push(0);
    if(ptsy.length == 0) ptsy.push(0);

    var max_x = Math.max.apply(Math, ptsx);
    var min_x = Math.min.apply(Math, ptsx);
    var max_y = Math.max.apply(Math, ptsy);
    var min_y = Math.min.apply(Math, ptsy);

    vectron_panX = -1*(max_x + min_x)/2;
    vectron_panY = -1*(max_y + min_y)/2;
    vectron_render();
}

function aamap_scale(factor) {
    for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
        aamap_objects[i].scale(factor);
    }
    vectron_render();
}

function aamap_add(aamapObject) {
    aamap_objects.push(aamapObject);
    aamap_xml += aamapObject.xml;
}

function aamap_remove(aamapObject) {
    var index = aamap_objects.indexOf(aamapObject);
    if(index > -1) {
        gui_writeLog("Match!");
        if(aamap_objects[index].obj != null)
            aamap_objects[index].obj.remove();
        aamap_objects.splice(index, 1);
    }
}

function aamap_undo() {
    gui_writeLog("Undone latest addition.");
    var obj = aamap_objects.pop();
    if(obj.obj != null) obj.obj.remove();
}

function aamap_redo() {
    // ehh later
}

function aamap_activate() {
    aamap_active = true;
}

function aamap_deactivate() {
    aamap_active = false;
}

function aamap_mapX(realX) {
    return (realX - vectron_width/2) / vectron_zoom - vectron_panX;
}

function aamap_mapY(realY) {
    return -1*(realY - vectron_height/2) / vectron_zoom - vectron_panY;
}

function aamap_realX(mapX) {
    return vectron_width/2 + ((mapX + vectron_panX)*vectron_zoom);
}

function aamap_realY(mapY) {
    return vectron_height/2 + (-1*(mapY + vectron_panY)*vectron_zoom);
}

function aamap_drawGrid() {
    if(aamap_grid != null) {
        aamap_grid.remove();
    }
    var gridArray = [];
    var midWidth = vectron_width/2 + (vectron_zoom * vectron_panX);
    var midHeight = vectron_height/2 - (vectron_zoom * vectron_panY);

    /**
     * drawing from mid to width from top to bottom
     */
    for(var i=midWidth; i < vectron_width; i+= vectron_zoom) {
        gridArray = gridArray.concat(["M", i, vectron_height, "L", i, 0]);
    }

    /**
     * drawing from mid to width from top to bottom
     */
    for(var i=midWidth; i > 0; i -= vectron_zoom) {
        gridArray = gridArray.concat(["M", i, vectron_height, "L", i, 0]);
    }

    for(var i=midHeight; i < vectron_height; i+= vectron_zoom) {
        gridArray = gridArray.concat(["M", vectron_width, i, "L", 0, i]);
    }

    for(var i=midHeight; i > 0; i -= vectron_zoom) {
        gridArray = gridArray.concat(["M", vectron_width, i, "L", 0, i]);
    }
    
    aamap_grid = vectron_screen.path(gridArray).attr("stroke", "#d6d6ec");
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

