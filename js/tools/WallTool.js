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

define(['tools/WallPoint', 'AamapObjects/Wall'], function(WallPoint, Wall) {

    function WallTool(vectron) {

        this.vectron = vectron;
        this.active = false;

        this.currentObj = null;

    }  

    WallTool.prototype = {

        constructor: WallTool,

        connect:function() {
            if(this.vectron.map.currentTool != null && this.vectron.map.currentTool.active) {
                this.vectron.gui.writeLog("Tool active cannot select another right now.");
                return false;
            } else {
                if(this.vectron.map.currentTool != null)
                    this.vectron.map.currentTool.disconnect();
                this.vectron.map.currentTool = this;
                this.vectron.gui.writeLog("Wall Tool Selected.");
                $("#toolbar-toolWall").css("background-color", "rgba(0,0,0,0.3)");
                return true;
            }
        },

        disconnect:function() {
            if(this.currentObj != null) {
                this.currentObj.obj.remove();
                this.currentObj.guideObj.remove();
                this.currentObj = null;
            }
            this.vectron.map.currentTool = null;
            $("#toolbar-toolWall").css("background-color", "transparent");
            this.active = false;
        },


        //mouse down first time, put point and add to wall path rerender wall
        start:function() {
            this.currentObj = new Wall(this.vectron, this.vectron.map.nextId);
            this.vectron.map.nextId++;
            
            this.currentObj.points.push(
                new WallPoint(
                    this.vectron.map.mapX(this.vectron.cursor.realX),
                    this.vectron.map.mapY(this.vectron.cursor.realY))
            );
            this.currentObj.render();
            this.active = true;
        },

        //mouse down, put point and add to wall path rerender
        progress:function() {
            var newX = this.vectron.map.mapX(this.vectron.cursor.realX);
            var newY = this.vectron.map.mapY(this.vectron.cursor.realY);

            var prevPoint = this.currentObj.points[this.currentObj.points.length-1];

            if(newX == prevPoint.x && newY == prevPoint.y) {
                this.vectron.gui.writeLog("Prevented Duplicate points.");
                return;
            }
            this.currentObj.points.push( new WallPoint(newX, newY) );
            this.currentObj.render();
        },


        //mouse up they have selected a direction store the point as an object.
        complete:function() {
            this.progress();
            if(this.currentObj.points.length < 2) {
                this.currentObj.obj.remove();
                this.currentObj.guideObj.remove();
                this.currentObj = null;
                this.active = false;
                this.vectron.gui.writeLog("Wall canceled, < 2 points");
                return;
            } else {
                var last = this.currentObj.points[this.currentObj.points.length-1];
                var secLast = this.currentObj.points[this.currentObj.points.length-2];
                if(last.x == secLast.x && last.y == secLast.y) {
                    this.currentObj.points.pop();
                    this.vectron.gui.writeLog("Removed duplicate point at end of wall.");
                }
            }
            this.currentObj.guideObj.remove();
            this.vectron.map.add(this.currentObj);
            this.currentObj = null;
            this.active = false;
        }

    };

    return WallTool;

});
