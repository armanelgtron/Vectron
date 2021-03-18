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

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

var selectTool_mapX = null;
var selectTool_mapY = null;

var selectTool_realX = null;
var selectTool_realY = null;

var selectTool_endX = null;
var selectTool_endY = null;

var selectTool_moveStartX = null;
var selectTool_moveStartY = null;

var selectTool_moveStartRealX = null;
var selectTool_moveStartRealY = null;

var selectTool_moveLastRealX = null;
var selectTool_moveLastRealY = null;

var shouldAddToSelected = false;


var selectTool_guideObj = null;
var selectTool_selectedObjs = [];

var selectTool_sets = [];

var selectTool_hoveredSet = null;
var selectTool_hoveredAamapObj = null;

function selectTool_connect() {
    $(".toolbar-toolSelect").css("background-color", "rgba(0,0,0,0.3)");
    cursor_active = false;
    // add drag to all objects
    for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
        selectTool_addHoverSet(aamap_objects[i]);
    }
}

function selectTool_disconnect() {
    if(selectTool_guideObj != null) {
        selectTool_guideObj.remove();
    }
    selectTool_deselectAll();

    cursor_active = true;

    for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
        selectTool_sets[i].unhover();
        selectTool_removeInvisibleGlow(aamap_objects[i]);
    }
    $(".toolbar-toolSelect").attr("style", "");
    vectron_toolActive = false;
}

function selectTool_start() {
    if(selectTool_guideObj != null) selectTool_guideObj.remove();

    if(selectTool_hoveredSet != null) {
        // we have a move!
        // find the hovered aaobject and add it to the selected list
        for(var i = 0, ii = aamap_objects.length; i < ii; i++) {
            if(aamap_objects[i].obj == selectTool_hoveredSet[0]) {
                gui_writeLog("match");
                selectTool_hoveredAamapObj = aamap_objects[i];
                if(shouldAddToSelected) {
                    selectTool_hoveredAamapObj.isSelected = true;
                    selectTool_selectedObjs.push(selectTool_hoveredAamapObj);
                }
            }
        }

        if(selectTool_hoveredAamapObj == null) {
            gui_writeLog("Could not find hovered object to move??");
            return;
        }

        vectron_toolActive = true;

        selectTool_moveStartX = aamap_mapX(cursor_realX);
        selectTool_moveStartY = aamap_mapY(cursor_realY); 

        selectTool_moveStartRealX = cursor_neverSnappedX;
        selectTool_moveStartRealY = cursor_neverSnappedY;
        selectTool_moveLastRealX = selectTool_moveStartRealX;
        selectTool_moveLastRealY = selectTool_moveStartRealY;
        return;
    }

    selectTool_realX = cursor_neverSnappedX;
    selectTool_realY = cursor_neverSnappedY;
    
    selectTool_mapX = aamap_mapX(cursor_neverSnappedX);
    selectTool_mapY = aamap_mapY(cursor_neverSnappedY);

    if(!eventHandler_shift)
        selectTool_deselectAll();

    selectTool_guideObj = vectron_screen.rect(cursor_realX, cursor_realY, 0, 0)
    .attr({"stroke": "#51a0ff", "stroke-opacity": "0.5", "fill": "#51a0ff", "fill-opacity": "0.3"});
    vectron_toolActive = true;
}

function selectTool_progress() {
    if(selectTool_hoveredSet != null) {
        gui_writeLog("in progress of moving, dont select!");
        var dx = selectTool_moveLastRealX - cursor_neverSnappedX;
        var dy = selectTool_moveLastRealY - cursor_neverSnappedY;

        selectTool_moveLastRealX = cursor_neverSnappedX;
        selectTool_moveLastRealY = cursor_neverSnappedY;

        selectTool_selectedObjs.forEach(function(e) {
            e.obj.translate(-dx, -dy);
            e.glowObj.translate(-dx, -dy);
        });

        return;
    }


    if(selectTool_guideObj != null) selectTool_guideObj.remove();
    else {
        gui_writeLog("unknown error occured.");
        selectTool_complete();
    }

    var realX = selectTool_realX;
    var realY = selectTool_realY;
    var endRealX = cursor_neverSnappedX;
    var endRealY = cursor_neverSnappedY;

    var width = cursor_neverSnappedX - selectTool_realX;
    var height = cursor_neverSnappedY - selectTool_realY;

    if(width < 0) {
        realX = endRealX;
        width *= -1;
    }

    if(height < 0) {
        realY = endRealY;
        height *= -1;
    }

    selectTool_guideObj = vectron_screen.rect(realX, realY, width, height)
    .attr({"stroke": "#51a0ff", "stroke-opacity": "0.5", "fill": "#51a0ff", "fill-opacity": "0.3"});
}

function selectTool_complete() {
    if(selectTool_hoveredSet != null) {

        var endX = aamap_mapX(cursor_realX);
        var endY = aamap_mapY(cursor_realY);

        var dx = selectTool_moveStartX - endX;
        var dy = selectTool_moveStartY - endY;

        selectTool_hoveredSet[0].remove();
        selectTool_hoveredSet[1].remove();

        selectTool_sets = [];

        selectTool_selectedObjs.forEach(function(e) {
            e.move(-dx, -dy);
            e.render();
        });

        // render adds to sets
        for(var i = 0, ii = selectTool_sets.length; i < ii; i++) {
        	if(selectTool_hoveredAamapObj.obj == selectTool_sets[i][0]) {
        		gui_writeLog("FOUND");
        		selectTool_hoveredSet = selectTool_sets[i];
        	}
        }

        shouldAddToSelected = false;

        vectron_toolActive = false;
        return;
    }

    if(selectTool_guideObj != null) selectTool_guideObj.remove();
    else {
        gui_writeLog("unknown error occured.");
    }
    selectTool_endX = aamap_mapX(cursor_neverSnappedX);
    selectTool_endY = aamap_mapY(cursor_neverSnappedY);

    selectTool_selectArea(selectTool_mapX, selectTool_mapY, selectTool_endX, selectTool_endY);
    vectron_toolActive = false;
}

function selectTool_delete() {
    aamap_objects = aamap_objects.diff(selectTool_selectedObjs);
    selectTool_deselectAll();
    selectTool_selectedObjs = [];
    vectron_render();
}

function selectTool_selectArea(xStart, yStart, xEnd, yEnd) {
    selectedObjs = [];
    var params = selectTool_orderCorners( xStart, yStart, xEnd, yEnd ); 

    //params = [left, top, right, bottom]
    for( var i = 0; i < aamap_objects.length; i++ ) {
        var curObj = aamap_objects[i];
        if( curObj instanceof Wall ) {
            for(var j = 0; j < curObj.points.length - 1; j++) {
                var p1 = curObj.points[j];
                var p2 = curObj.points[j+1];
                if(selectTool_lineIntersectsRect(p1, p2, params[0], params[1], params[2], params[3])) {
                    selectTool_select(curObj);
                    selectTool_selectedObjs.push( curObj );
                    break;
                }
            }
        } 
        
        else if(curObj instanceof Zone) {

            if(selectTool_circIntersectsRect(new WallPoint(curObj.x, curObj.y), curObj.radius, 
                params[0], params[1], params[2], params[3])) {
                selectTool_select(curObj);
                selectTool_selectedObjs.push( curObj );

            }
        } 
        
        else {
            if( params[0] - 0.05 <= curObj.x && curObj.x <= params[2] + 0.05 &&
                params[1] + 0.05 >= curObj.y && curObj.y >= params[3] - 0.05 ) {
                
                selectTool_select(curObj);
                selectTool_selectedObjs.push( curObj );
            }
        }
    }
    gui_writeLog(selectTool_selectedObjs.length);
}

function selectTool_select(aamapObject) {
    aamapObject.isSelected = true;
    aamapObject.render();
}

function selectTool_deselect(aamapObject) {
    aamapObject.isSelected = false;
    aamapObject.render();
}

function selectTool_deselectAll() {
    for(var i = 0, ii = selectTool_selectedObjs.length; i < ii; i++) {
        selectTool_deselect(selectTool_selectedObjs[i]);
    }
    selectTool_selectedObjs = [];
}

function selectTool_orderCorners( xStart, yStart, xEnd, yEnd ) {
    var ordered = [];
    if( xStart < xEnd ) {
        if( yStart < yEnd ) {
            ordered = [xStart, yEnd, xEnd, yStart];
        } else {
            ordered = [xStart, yStart, xEnd, yEnd];
        } 
    } else {
        if( yStart < yEnd ) {
            ordered = [xEnd, yEnd, xStart, yStart];
        } else {
            ordered = [xEnd, yStart, xStart, yEnd];
        }
    }
    return ordered;
}

function selectTool_lineIntersectsLine(l1p1, l1p2, l2p1, l2p2) {
    var q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
    var d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);

    if( d == 0 )
    {
        return false;
    }

    var r = q / d;

    q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);
    var s = q / d;

    if( r < 0 || r > 1 || s < 0 || s > 1 )
    {
        return false;
    }

    return true;
}

function selectTool_lineIntersectsRect(p1, p2, x0, y0, x1, y1) {
    return selectTool_lineIntersectsLine(p1, p2, new WallPoint(x0, y0), new WallPoint(x1, y0)) ||
           selectTool_lineIntersectsLine(p1, p2, new WallPoint(x1, y0), new WallPoint(x1, y1)) ||
           selectTool_lineIntersectsLine(p1, p2, new WallPoint(x1, y1), new WallPoint(x0, y1)) ||
           selectTool_lineIntersectsLine(p1, p2, new WallPoint(x0, y1), new WallPoint(x0, y0)) ||
           ( x0 <= p1.x && p1.x <= x1 &&
                y0 >= p1.y && p1.y >= y1 );
}

function selectTool_circIntersectsRect(p1, r, x0, y0, x1, y1) {
    if( x0 <= p1.x && p1.x <= x1 &&
        y0 >= p1.y && p1.y >= y1) {

        return true;
    }

    if(y0 >= p1.y && p1.y >= y1) {
        if(Math.abs(x1 - p1.x) <= r)
            return true;
    }

    if(y0 >= p1.y && p1.y >= y1) {
        if(Math.abs(x0 - p1.x) <= r)
            return true;
    }

    if(x0 <= p1.x && x1 >= p1.x) {
        if(Math.abs(y0 - p1.y) <= r)
            return true;
    }

    if(x0 <= p1.x && x1 >= p1.x) {
        if(Math.abs(y1 - p1.y) <= r)
            return true;
    }

    var point1 = new WallPoint(x0, y0);
    var point2 = new WallPoint(x1, y0);
    var point3 = new WallPoint(x1, y1);
    var point4 = new WallPoint(x0, y1);

    var dist1x = Math.abs(p1.x - point1.x);
    var dist1y = Math.abs(p1.y - point1.y);
    if(dist1x <= r && dist1y <= r)
        return true;

    var dist2x = Math.abs(p1.x - point2.x);
    var dist2y = Math.abs(p1.y - point2.y);
    if(dist2x <= r && dist2y <= r)
        return true;

    var dist3x = Math.abs(p1.x - point3.x);
    var dist3y = Math.abs(p1.y - point3.y);
    if(dist3x <= r && dist3y <= r)
        return true;

    var dist4x = Math.abs(p1.x - point4.x);
    var dist4y = Math.abs(p1.y - point4.y);
    if(dist4x <= r && dist4y <= r)
        return true;

    return false;
}

function selectTool_addInvisibleGlow(aamapObject) {
    aamapObject.glowObj = aamapObject.obj.glow({color: "#FFFFFF", width:2});
}

function selectTool_removeInvisibleGlow(aamapObject) {
    aamapObject.glowObj.remove();
    aamapObject.glowObj = null;
}

function selectTool_addHoverSet(aamapObject) {
    selectTool_addInvisibleGlow(aamapObject);
    var set = vectron_screen.set().push(aamapObject.obj, aamapObject.glowObj);
    selectTool_sets.push(set);
    set.hoverset(vectron_screen, selectTool_hoverIn, selectTool_hoverOut);
}

function selectTool_addHoverSetSelected(aamapObject) {
    aamapObject.glowObj = aamapObject.obj.glow({color: "#375ffc", width:2});
    var set = vectron_screen.set().push(aamapObject.obj, aamapObject.glowObj);
    selectTool_sets.push(set);
    set.hoverset(vectron_screen, selectTool_hoverInSelected, selectTool_hoverOutSelected);
}

var selectTool_hoverIn = function(evt) {
    if(vectron_toolActive) return;

    shouldAddToSelected = true;
    this[1].attr("stroke", "#375ffc").attr("cursor", "pointer");
    this[0].attr("cursor", "pointer");
    selectTool_hoveredSet = this;
}

var selectTool_hoverOut = function(evt) {
    if(vectron_toolActive) return;

    shouldAddToSelected = false;
    this[1].attr("stroke", "#FFFFFF").attr("cursor", "default");
    this[0].attr("cursor", "default");
    gui_writeLog("Null Now");
    selectTool_hoveredSet = null;
    selectTool_hoveredAamapObj = null;
}

var selectTool_hoverInSelected = function(evt) {
    if(vectron_toolActive) return;
    shouldAddToSelected = false;

    this[0].attr("cursor", "pointer");
    this[1].attr("cursor", "pointer");
    selectTool_hoveredSet = this;
}

var selectTool_hoverOutSelected = function(evt) {
    if(vectron_toolActive) return;
    shouldAddToSelected = false;

    this[0].attr("cursor", "default");
    this[1].attr("cursor", "deafult");
    gui_writeLog("NUll now");
    selectTool_hoveredSet = null;
    selectTool_hoveredAamapObj = null;
}



