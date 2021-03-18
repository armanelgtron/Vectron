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

define([
    'AamapObjects/Wall',
    'tools/WallPoint',
    'AamapObjects/Zone'
], function(Wall, WallPoint, Zone) {

    function SelectTool(vectron) {

        this.vectron = vectron;
        this.active = false;

        this.guideObj = null;
        this.selectedObjs = [];

        this.x = null; // MAP X
        this.y = null; // MAP Y
        this.endX = null; // to this map X
        this.endY = null; // to this map Y

    }  

    SelectTool.prototype = {

        constructor: SelectTool,

        connect:function() {
            if(this.vectron.map.currentTool != null && this.vectron.map.currentTool.active) {
                this.vectron.gui.writeLog("Tool active cannot select another right now.");
                return false;
            } else {
                if(this.vectron.map.currentTool != null)
                    this.vectron.map.currentTool.disconnect();
            	this.vectron.map.currentTool = this;
                $("#toolbar-toolSelect").css("background-color", "rgba(0,0,0,0.3)");
            	return true;
            }
        },


        //Note
        /*
        In case you need to use the selection for another tool, you canpass the
        selected objs on to a tool that requires thems connection, this will allow
        you to use the select funtion below on the selected objects.
        */
        disconnect:function() {
            if(this.currentObj != null) {
                this.currentObj.obj.remove();
                this.currentObj.guideObj.remove();
            }
            this.deselectAll();
            this.vectron.map.currentTool = null;
            $("#toolbar-toolSelect").css("background-color", "transparent");
            this.active = false;
        },


        //mouse down start drag
        start:function() {
            //this.selectedObjects = select( xStart, yStart, xEnd, yEnd );
            if(this.guideObj != null)
                this.guideObj.remove();
            this.x = this.vectron.map.mapX(this.vectron.cursor.realX);
            this.y = this.vectron.map.mapY(this.vectron.cursor.realY);

            //clear selected objects.
            this.deselectAll();

            this.guideObj = this.vectron.screen.rect(this.vectron.cursor.realX, this.vectron.cursor.realY, 0, 0)
            .attr({"stroke": "#51a0ff", "stroke-opacity": "0.5", "fill": "#51a0ff", "fill-opacity": "0.3"});
        	this.active = true;
        },

        progress:function() {
            this.endX = this.vectron.map.mapX(this.vectron.cursor.realX);
            this.endY = this.vectron.map.mapY(this.vectron.cursor.realY);
            this.guideObj.remove();
            var realX = this.vectron.map.realX(this.x);
            var realY = this.vectron.map.realY(this.y);
            var endRealX = this.vectron.map.realX(this.endX);
            var endRealY = this.vectron.map.realY(this.endY);

            var width = endRealX - realX;
            var height = endRealY - realY;

            if(width < 0) {
                realX = endRealX;
                width *= -1;
            }

            if(height < 0) {
                realY = endRealY;
                height *= -1;
            }

            this.guideObj = this.vectron.screen.rect(realX, realY, width, height)
            .attr({"stroke": "#51a0ff", "stroke-opacity": "0.5", "fill": "#51a0ff", "fill-opacity": "0.3"});
        },

        //mouse up they have selected a direction store the point as an object.
        complete:function() {
            this.guideObj.remove();
            this.endX = this.vectron.map.mapX(this.vectron.cursor.realX);
            this.endY = this.vectron.map.mapY(this.vectron.cursor.realY);
            this.selectArea(this.x, this.y, this.endX, this.endY);
        	this.active = false;
        },

        selectArea:function( xStart, yStart, xEnd, yEnd ) {
            selectedObjs = [];
            var params = this.orderCorners( xStart, yStart, xEnd, yEnd ); 
            //params = [left, top, right, bottom]
            for( var i = 0; i < this.vectron.map.aamapObjects.length; i++ ) {
                var curObj = this.vectron.map.aamapObjects[i];
                if( curObj instanceof Wall ) {
                    for(var j = 0; j < curObj.points.length - 1; j++) {
                        var p1 = curObj.points[j];
                        var p2 = curObj.points[j+1];
                        if(this.lineIntersectsRect(p1, p2, params[0], params[1], params[2], params[3])) {
                            this.select(curObj);
                            this.selectedObjs.push( curObj );
                            break;
                        } else {
                            this.deselect(curObj);
                        }
                    }
                    //Don't care
                } 
                /*
                OPTION SLOWER THO
                else if(curObj instanceof Zone) {

                    if(this.circIntersectsRect(new WallPoint(curObj.x, curObj.y), curObj.radius, 
                        params[0], params[1], params[2], params[3])) {
                        this.select(curObj);
                        this.selectedObjs.push( curObj );

                    } else {
                        this.deselect(curObj);
                    }

                } 
                */
                else {
                    if( params[0] - 0.05 <= curObj.x && curObj.x <= params[2] + 0.05 &&
                        params[1] + 0.05 >= curObj.y && curObj.y >= params[3] - 0.05 ) {
                        
                        this.select(curObj);
                        this.selectedObjs.push( curObj );
                    } else {
                        //noglo
                        this.deselect(curObj);
                    }
                }
            }
        },

        select:function(curObj) {
            if(curObj.obj.glowObj == null)
               curObj.obj.glowObj = curObj.obj.glow({color: "#375ffc"});
        },

        deselect:function(curObj) {
            if(curObj.obj.glowObj != null)
                curObj.obj.glowObj.remove();
            curObj.obj.glowObj = null;
        },

        deselectAll:function() {
            for(var i = 0; i < this.vectron.map.aamapObjects.length; i++ ) {
                this.deselect(this.vectron.map.aamapObjects[i]);
            }
            this.selectedObjs = [];
        },
        
        /* Much gross. Very ew. */
        orderCorners:function( xStart, yStart, xEnd, yEnd ) {
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
        },

        lineIntersectsLine:function(l1p1, l1p2, l2p1, l2p2)
        {
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
        },

        lineIntersectsRect:function(p1, r, x0, y0, x1, y1) {
            return this.circIntersectsLine(p1, r, new WallPoint(x0, y0), new WallPoint(x1, y0)) ||
                   this.circIntersectsLine(p1, r, new WallPoint(x1, y0), new WallPoint(x1, y1)) ||
                   this.circIntersectsLine(p1, r, new WallPoint(x1, y1), new WallPoint(x0, y1)) ||
                   this.circIntersectsLine(p1, r, new WallPoint(x0, y1), new WallPoint(x0, y0));
        },

        lineIntersectsRect:function(p1, p2, x0, y0, x1, y1)
        {
            return this.lineIntersectsLine(p1, p2, new WallPoint(x0, y0), new WallPoint(x1, y0)) ||
                   this.lineIntersectsLine(p1, p2, new WallPoint(x1, y0), new WallPoint(x1, y1)) ||
                   this.lineIntersectsLine(p1, p2, new WallPoint(x1, y1), new WallPoint(x0, y1)) ||
                   this.lineIntersectsLine(p1, p2, new WallPoint(x0, y1), new WallPoint(x0, y0)) ||
                   ( x0 <= p1.x && p1.x <= x1 &&
                        y0 >= p1.y && p1.y >= y1 );
        },

        circIntersectsRect:function(p1, r, x0, y0, x1, y1) {
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

    };

    return SelectTool;

});

