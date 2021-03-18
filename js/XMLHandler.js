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
    'tools/WallPoint',
    'AamapObjects/Wall',
    'AamapObjects/Zone',
    'AamapObjects/Spawn',
], function(WallPoint, Wall, Zone, Spawn) {

    function XMLHandler(vectron, options) {

        this.vectron = vectron;

        $('#files').change(this.handle.bind(this));

    }

    XMLHandler.prototype = {

        constructor: XMLHandler,

        //Returns aamapObject representation of a map
        //Also stores the dtd and required info into the map provided

        process:function(xml) {
            this.vectron.gui.writeLog(xml);
            var vectron = this.vectron;
            var ptsx = [];
            var ptsy = [];

            $(xml).find("Spawn").each(function() {
                var spawn = $(this);

                var x = spawn.attr("x");
                var y = spawn.attr("y");
                var xdir = spawn.attr("xdir");
                var ydir = spawn.attr("ydir");            

                ptsx.push(parseFloat(x));
                ptsy.push(parseFloat(y));

                var spawnOb = new Spawn(vectron, vectron.map.nextId);

                spawnOb.x = parseFloat(x);
                spawnOb.y = parseFloat(y);
                spawnOb.xDir = parseInt(xdir);
                spawnOb.yDir = parseInt(ydir);

                vectron.map.add(spawnOb);
            });

            $(xml).find("Zone").each(function() {
                var zone = $(this);
                var effect = zone.attr("effect");
                var radius = zone.find("ShapeCircle").attr("radius");
                var x = zone.find("Point").attr("x");
                var y = zone.find("Point").attr("y");

                ptsx.push(parseFloat(x));
                ptsy.push(parseFloat(y));

                vectron.map.add(
                    new Zone(
                        vectron, parseFloat(x), parseFloat(y), parseFloat(radius), vectron.map.zoneTool.whatType[effect],
                        vectron.map.nextId)
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

                var wallObj = new Wall(vectron, vectron.map.nextId);
                wallObj.points = points;
                wallObj.render();
                vectron.map.add(wallObj);
            });

            var max_x = Math.max.apply(Math, ptsx);
            var min_x = Math.min.apply(Math, ptsx);
            var max_y = Math.max.apply(Math, ptsy);
            var min_y = Math.min.apply(Math, ptsy);

            this.vectron.map.panX = -1*(max_x + min_x)/2;
            this.vectron.map.panY = -1*(max_y + min_y)/2;
            this.vectron.render();

        },

        writeZone:function(zone) {

        },

        writeSpawn:function(spawn) {

        },

        writeWall:function(wall) {

        },

        propertyDTD:function(dtd) {

        },

        propertyAxes:function(axes) {

        },

        load:function(vectron) {

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                this.vectron.gui.writeLog("File reading supported by your browser. Good.");
            } else {
                this.vectron.gui.writeLog("And you can't read files D:. NOOB.");
            }
        },

        handle:function(evt) {
            this.vectron.gui.writeLog("SDF.");

            var reader = new FileReader();
            reader.onload = this.loadingComplete.bind(this);
            reader.readAsText(evt.target.files[0]);
        },

        loadingComplete: function(evt) {
            this.process(evt.target.result);
        },

        // not used (think so)
        onload:function() {
            alert(this.result);
            this.vectron.gui.writeLog("HI");
            this.process(this.result);
        }

    };

    return XMLHandler;

});
