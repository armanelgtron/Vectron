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

var spawnTool_currentObj = null;


function spawnTool_connect() {
    $(".toolbar-toolSpawn").css("background-color", "rgba(0,0,0,0.3)");
}

function spawnTool_disconnect() {
    $(".toolbar-toolSpawn").attr("style", "");
    vectron_toolActive = false;
}

function spawnTool_start() {
    spawnTool_currentObj = new Spawn();
    vectron_toolActive = true;
}

function spawnTool_complete() {
    spawnTool_currentObj.guideObj.remove();
    aamap_add(spawnTool_currentObj);
    spawnTool_currentObj.render();
    spawnTool_currentObj = null;
    vectron_toolActive = false;
}