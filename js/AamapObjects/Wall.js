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

function Wall() {

    this.objectID = vectron_objectID;
    vectron_objectID++;

    this.obj = vectron_screen.path();
    this.obj.data("id", this.objectID);

    this.guideObj = vectron_screen.path();

    this.isSelected = false;
    this.glowObj = null;

    this.points = [];
    this.pathArray = [];

    this.xml = 'Wall';

    this.render = function() {
        if(this.obj != null) this.obj.remove();
        if(this.glowObj != null) this.glowObj.remove();
        
        this.pathArray = [];
        for(var i = 0; i < this.points.length; i++) {
            if(i == 0) {
                this.pathArray = this.pathArray.concat(
                    [
                     'M',
                     aamap_realX(this.points[0].x),
                     aamap_realY(this.points[0].y)
                    ]
                );
            } else {
                this.pathArray = this.pathArray.concat(
                    [
                     'L',
                     aamap_realX(this.points[i].x),
                     aamap_realY(this.points[i].y)
                    ]
                );
            }
        } 
        this.obj = vectron_screen.path(this.pathArray).attr({stroke: "#333"});
        if(config_isDark) this.obj.attr({stroke: "#fff"});

        if(this.isSelected) {
            selectTool_addHoverSetSelected(this);
        } else if(vectron_currentTool == "select") {
            selectTool_addHoverSet(this);
        }
    }

    this.guide = function() {
        this.guideObj.remove();
        var guideArray = []
        guideArray = guideArray.concat(
            [
             'M',
             aamap_realX(this.points[this.points.length-1].x),
             aamap_realY(this.points[this.points.length-1].y)
            ]
        );
        guideArray = guideArray.concat(
            [
             'L',
             cursor_realX,
             cursor_realY
            ]
        );
        this.guideObj = vectron_screen.path(guideArray).attr({stroke: "#aaa"});
    }

    this.scale = function(factor) {
        for(var i = 0, ii = this.points.length; i < ii; i++) {
            this.points[i].x *= factor;
            this.points[i].y *= factor;
        }
    }

    this.getPosition = function()
    {
        var x=0,y=0;
        for(var i=this.points.length-1;i>=0;--i) {
            x += this.points[i].x;
            y += this.points[i].y;
        }
        return [(x/this.points.length),(y/this.points.length)];
    }

    this.move = function(dx, dy) {
        for(var i = 0, ii = this.points.length; i < ii; i++) {
            this.points[i].x += dx;
            this.points[i].y += dy;
            gui_writeLog(this.points[i].x);
            gui_writeLog(this.points[i].y);
        }
    }

    this.getXML = function() {
        var xml = '<Wall height="4">';
        for(var i = 0, ii = this.points.length; i < ii; i++) {
            xml += '<Point x="' + this.points[i].x + '" y="'+ this.points[i].y + '"/>';
        }
        xml += '</Wall>';
        return xml;
    }

    this.outputFriendlyXML = function() {
        gui_writeLog(escapeHtml('<Wall height="4">'));
        for(var i = 0, ii = this.points.length; i < ii; i++) {
            gui_writeLog('&nbsp;&nbsp;' + escapeHtml('<Point x="' + this.points[i].x + '" y="'+ this.points[i].y + '"/>'));
        }
        gui_writeLog(escapeHtml('</Wall>'));
    }

}  

