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

define([], function() {

    function Wall(vectron, id) {

        this.vectron = vectron;

        this.id = id;

        this.obj = vectron.screen.path();
        this.guideObj = vectron.screen.path();

        this.points = [];
        this.pathArray = [];
        //this.guideArray = [];

        this.xml = 'Wall';

    }  

    Wall.prototype = {

        constructor: Wall,

        render:function() {
            this.obj.remove();
            this.pathArray = [];
            for(var i = 0; i < this.points.length; i++) {
                if(i == 0) {
                    this.pathArray = this.pathArray.concat(
                        [
                         'M',
                         this.vectron.map.realX(this.points[0].x),
                         this.vectron.map.realY(this.points[0].y)
                        ]
                    );
                } else {
                    this.pathArray = this.pathArray.concat(
                        [
                         'L',
                         this.vectron.map.realX(this.points[i].x),
                         this.vectron.map.realY(this.points[i].y)
                        ]
                    );
                }
            } 
            this.obj = this.vectron.screen.path(this.pathArray).attr({stroke: "#333"});
        },

        guide:function() {
            this.guideObj.remove();
            var guideArray = []
            guideArray = guideArray.concat(
                [
                 'M',
                 this.vectron.map.realX(this.points[this.points.length-1].x),
                 this.vectron.map.realY(this.points[this.points.length-1].y)
                ]
            );
            guideArray = guideArray.concat(
                [
                 'L',
                 this.vectron.cursor.realX,
                 this.vectron.cursor.realY
                ]
            );
            this.guideObj = this.vectron.screen.path(guideArray).attr({stroke: "#aaa"});
        },

        /*
         *  Should this be based on map coordinates or game coordinates?
         */ 
        scale:function(factor) {

            for(var i = 0, ii = this.points.length; i < ii; i++) {
                this.points[i].x *= factor;
                this.points[i].y *= factor;
            }
        }
    };

    return Wall;

});
