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

define(['Tools'], function(Tools) {

    function Aamap(vectron) {

        this.vectron = vectron;
        this.screen = vectron.screen;
        this.active = true;

        this.xml = '';

        this.aamapObjects = [];

        this.wallTool = new Tools.Wall(vectron);
        this.zoneTool = new Tools.Zone(vectron);
        this.spawnTool = new Tools.Spawn(vectron);
        this.selectTool = new Tools.Select(vectron);

        this.currentTool = null;

        this.nextId = 0;

        this.gridObj = null;

        this.zoom = 15;

        this.panX = 0;
        this.panY = 0;

    }  

    Aamap.prototype = {

        constructor: Aamap,

        // Called when settings saved or anythign changes so the debug log can be removed
        render:function() {
            if(this.gridObj != null) {
                this.gridObj.remove();
            }
            this.grid();
            for(var i = 0; i < this.aamapObjects.length; i++) {
                this.aamapObjects[i].render();
            }
            if(this.selectTool.selectedObjs != []) {
                for(var i = 0; i < this.selectTool.selectedObjs.length; i++) {
                    this.selectTool.select(this.selectTool.selectedObjs[i]);
                }
            }
        },

        scale:function(factor) {

            for(var i = 0, ii = this.aamapObjects.length; i < ii; i++) {
                this.aamapObjects[i].scale(factor);
            }
            this.panX *= factor;
            this.panY *= factor;
            this.vectron.render();
        },

        add:function(obj) {
            //add to xml of the obj
            this.xml += obj.xml;
            this.aamapObjects.push(obj);
            this.nextId++;
        },

        remove:function() {
            var delOb = this.aamapObjects.pop();
            if(delOb.obj != null)
                delOb.obj.remove();
        },


        // Needs a better way to delete selected objects :\ Not sure how.
        sift:function() {


        },

        show:function() {
            
            this.active = true; //Draw the cursor!
        },

        hide:function() {

            this.active = false; //Dont draw the cursor!
        },

        mapX:function(realX) {
            return (realX - this.vectron.width/2) / this.zoom - this.panX;
        },

        mapY:function(realY) {
            return -1*(realY - this.vectron.height/2) / this.zoom - this.panY;
        },

        realX:function(mapX) {
            return this.vectron.width/2 + ((mapX + this.panX)*this.zoom);
        },

        realY:function(mapY) {
            return this.vectron.height/2 + (-1*(mapY + this.panY)*this.zoom);
        },

        grid:function() {
            var gridArray = [];
            var midWidth = this.vectron.width/2 + (this.zoom * this.panX);
            var midHeight = this.vectron.height/2 - (this.zoom * this.panY);

            for(var i=midWidth; i < this.vectron.width; i+= this.zoom) {
                gridArray = gridArray.concat(["M", i, this.vectron.height, "L", i, 0]);
            }
        
            for(var i=midWidth; i > 0; i -= this.zoom) {
                gridArray = gridArray.concat(["M", i, this.vectron.height, "L", i, 0]);
            }
        
            for(var i=midHeight; i < this.vectron.height; i+= this.zoom) {
                gridArray = gridArray.concat(["M", this.vectron.width, i, "L", 0, i]);
            }
        
            for(var i=midHeight; i > 0; i -= this.zoom) {
                gridArray = gridArray.concat(["M", this.vectron.width, i, "L", 0, i]);
            }
            
            this.gridObj = this.vectron.screen.path(gridArray).attr("stroke", "#d6d6ec");

        }

    };

    return Aamap;

});
