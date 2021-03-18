/*
********************************************************************************
Vectron - map editor for Armagetron Advanced.
Copyright (C) 2014  Tristan Whitcher    (tristan.whitcher@gmail.com)
David Dubois        (ddubois@jotunstudios.com)
Carlo Veneziano     (carlorfeo@gmail.com)
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
    'aamapTools/SelectTool',
    'aamapTools/SpawnTool',
    'aamapTools/WallTool',
    'aamapTools/ZoneTool',
    'Mediator'
], function(SelectTool, SpawnTool, WallTool, ZoneTool, Mediator) {
    'use strict';

    var AamapTools = function() {
        this.tools = {
            select: new SelectTool(),
            spawn: new SpawnTool(),
            wall: new WallTool(),
            zone: new ZoneTool()
        };

        this.activeTool = null;

        Mediator.subscribe('tool:connect', this.selectTool, this);
    }

    AamapTools.prototype = {
        selectTool: function (toolName) {
            var tool = this.tools[toolName];

            if (tool && tool.get('active') == false) { 
                this.deselectCurrent();
                this.activeTool = tool.set('active', true);
            }

            return this;
        },

        deselectCurrent: function () {
            if (this.activeTool) {
                this.activeTool.set('active', false);
                this.activeTool = null;
            }
        }
    };

    return AamapTools;

});
