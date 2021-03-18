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

var eventHandler_space = false;

var eventHandler_spaceX = 0;
var eventHandler_spaceY = 0;

var eventHandler_startPanX = null;
var eventHandler_startPanY = null;

var eventHandler_startPanRealX = null;
var eventHandler_startPanRealY = null;

var eventHandler_shift = false;

var eventHandler_contextMenu = false;


function eventHandler_init() {

    var $contextMenu = $("#contextMenu");
  
    $("#canvas_container").on("contextmenu", function(e) {
        aamap_active = false;
        $contextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });

    $contextMenu.on("click", "a", function() {
        if(!aamap_active) {
            $contextMenu.hide();
            aamap_active = true;
            return;
        }
    });

    $('body').on("click", function() {
        $contextMenu.hide();
    });



    $(".toolbar-gui-open").mouseup(function(e) {
        if(!gui_active) {
            gui_show(); // sets active state
            $(".toolbar-gui-open").hide();
            $(".toolbar-gui-close").show();
        }
        gui_writeLog('GUI TOGGLE');
        $("#zones-menu").hide();
    });

    $(".toolbar-gui-close").mouseup(function(e) {
        if(gui_active) {
            gui_hide();
            $(".toolbar-gui-close").hide();
            $(".toolbar-gui-open").show();
        }
        gui_writeLog('GUI TOGGLE');
        $("#zones-menu").hide();
    });

    $("#gui-export").mouseup(function(e) {
        var mapName = $("#map_name").val().trim();
        var mapAuthor = $("#map_author").val().trim();
        var mapCategory = $("#map_category").val().trim();
        var mapVersion = $("#map_version").val().trim();
        var mapDtd = $("#map_dtd").val().trim();

        aamap_save(mapName, mapAuthor, mapCategory, mapVersion, mapDtd);
    });

    $("#gui-close").mouseup(function(e) {
        if(gui_active) {
            gui_hide();
            $(".toolbar-gui-close").hide();
            $(".toolbar-gui-open").show();
        }
        gui_writeLog('GUI TOGGLE');
        $("#zones-menu").hide();
    });


    $(".toolbar-toolSelect").mouseup(function(e) {
        vectron_connectTool("select");
        gui_writeLog('Select Tool Connected.');
        $("#zones-menu").hide();
    });


    /*
     * WALL TOOL
     */
    $(".toolbar-toolWall").mouseup(function(e) {
        vectron_connectTool("wall");
        gui_writeLog('WallTool Connected.');
        $("#zones-menu").hide();
    });

    /*
     * Zone tool
     */

    $("#contextMenu .toolbar-toolZone").mouseup(function(e) {
        vectron_connectTool("zone");
    });

    $("#zone-base .toolbar-toolZone").mouseup(function(e) {
        $("#zones-menu").toggle();
    });

    $(".toolbar-toolZone-death").mouseup(function(e) {
        vectron_connectTool("zone");
        zoneTool_type = 0;
        zoneTool_guide();
        gui_writeLog('DeathZone selected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZone-win").mouseup(function(e) {
        vectron_connectTool("zone");
        zoneTool_type = 1;
        zoneTool_guide();
        gui_writeLog('WinZone selected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZone-target").mouseup(function(e) {
        vectron_connectTool("zone");
        zoneTool_type = 2;
        zoneTool_guide();
        gui_writeLog('TargetZone selected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZone-fortress").mouseup(function(e) {
        vectron_connectTool("zone");
        zoneTool_type = 4;
        zoneTool_guide();
        gui_writeLog('FortressZone selected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZone-rubber").mouseup(function(e) {
        vectron_connectTool("zone");
        zoneTool_type = 3;
        zoneTool_guide();
        gui_writeLog('RubberZone selected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolSpawn").mouseup(function(e) {
        vectron_connectTool("spawn");
        $("#zones-menu").hide();
    });

    $(".toolbar-toolUnlock-list .toolbar-toolUnlock").mouseup(function(e) {
        cursor_snap = true;
        $('.toolbar-toolUnlock-list').css('display','none');
        $('.toolbar-toolLock-list').css('display','block');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolLock-list .toolbar-toolLock").mouseup(function(e) {
        cursor_snap = false;
        $('.toolbar-toolLock-list').css('display','none');
        $('.toolbar-toolUnlock-list').css('display','block');
        $("#zones-menu").hide();
    });

    $("#contextMenu .toolbar-toolLock").mouseup(function(e) {
        if(!cursor_snap) {
            $('.toolbar-toolUnlock-list').css('display','none');
            $('.toolbar-toolLock-list').css('display','block');
           
        } else {
            $('.toolbar-toolLock-list').css('display','none');
            $('.toolbar-toolUnlock-list').css('display','block');
        }
        cursor_snap = !cursor_snap;
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZoomIn").mouseup(function(e) {
        if(vectron_zoom < 60) {
            vectron_zoom += 1;
        }
        vectron_render();
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZoomOut").mouseup(function(e) {
        if(vectron_zoom > 5) {
            vectron_zoom -= 1;
        }
        vectron_render();
        $("#zones-menu").hide();
    });

    //Scaling//

    // Need better icons for these.

    $(".toolbar-toolScaleUp").mouseup(function(e) {
        aamap_scale(2);
        aamap_panCenter();
        $("#zones-menu").hide();
    });

    $(".toolbar-toolScaleDown").mouseup(function(e) {
        aamap_scale(0.5);
        aamap_panCenter();
        $("#zones-menu").hide();
    });



    $(".toolbar-disconnect").mouseup(function(e) {
        if(vectron_currentTool == "select" && !vectron_toolActive) {
            selectTool_delete();
        } else if(vectron_currentTool == "wall" && vectron_toolActive) {
            wallTool_disconnect();
            vectron_currentTool = "";
            vectron_connectTool("wall");
        } else if(vectron_currentTool == "spawn" && vectron_toolActive) {
            spawnTool_disconnect();
            vectron_currentTool = "";
            vectron_connectTool("spawn");
        } else {
            aamap_undo();
            vectron_render();
        }
        $("#zones-menu").hide();
    });

    $("#canvas_container").mouseleave(function(e) {
        e.preventDefault();
        if(!aamap_active) return;

        if(vectron_currentTool == "select") {
            if(vectron_toolActive){
                selectTool_complete();
            }
        }

    });

    $("#canvas_container").mouseup(function(e) {
        e.preventDefault();
        if(!aamap_active) {
            $contextMenu.hide();
            aamap_active = true;
            return;
        }
        switch (e.which) {
            case 1:
                if(vectron_currentTool == "wall") {
                    if(!vectron_toolActive) wallTool_start();
                    else wallTool_progress();
                } else if(vectron_currentTool == "zone") {
                    zoneTool_complete();
                } else if(vectron_currentTool == "spawn") {
                    if(!vectron_toolActive)
                        spawnTool_start();
                    else spawnTool_complete();
                } else if(vectron_currentTool == "select" && vectron_toolActive) {
                    selectTool_complete();
                } else if(vectron_currentTool == "move" && vectron_toolActive) {
                    moveTool_complete();
                }
                break;
            case 2:
                //alert('Middle Mouse button pressed.');
                break;
            case 3:
                break;
            default:
                alert('You have a strange Mouse!');
        }
    });

    $("#canvas_container").dblclick(function(e) {
        e.preventDefault();
        if(aamap_active && vectron_currentTool == "wall" && vectron_toolActive) {
            wallTool_complete();
        }
    });

    $("#canvas_container").mousedown(function(e) {
        e.preventDefault();
        if(!aamap_active) {
            return;
        }
        switch (e.which) {
            case 1:
                if(vectron_currentTool == "select" && !vectron_toolActive) {
                    selectTool_start();
                } else if(vectron_currentTool == "move" && !vectron_toolActive) {
                    moveTool_start();
                }
                break;
            case 2:
                //alert('Middle Mouse button pressed.');
                break;
            case 3:
                //alert('Right Mouse button pressed.');
                break;
            default:
                alert('You have a strange Mouse!');
        }
    }); 


    $("#canvas_container").mousemove(function(event) {
        if(!aamap_active) return;

        cursor_pageX = event.pageX - 50;
        cursor_pageY = event.pageY;

        if(eventHandler_space) {
            vectron_screen.setViewBox(eventHandler_spaceX - cursor_pageX, eventHandler_spaceY - cursor_pageY, vectron_width, vectron_height);
            return;
        }

        cursor_render(cursor_pageX, cursor_pageY, vectron_zoom);

        if(vectron_currentTool == "wall" && vectron_toolActive) {
            wallTool_currentObj.guide();
        } else if(vectron_currentTool == "zone") {
            zoneTool_guide();
        } else if(vectron_currentTool == "spawn") {
            if(spawnTool_currentObj != null)
                spawnTool_currentObj.guide();
        } else if(vectron_currentTool == "select" && vectron_toolActive) {
            selectTool_progress();
        } else if(vectron_currentTool == "move" && vectron_toolActive) {
            moveTool_progress();
        }

    });

    $(function() {
        $(document).keyup(function(evt) {
            if (evt.keyCode == 32 && eventHandler_space) {
                vectron_panX = eventHandler_startPanX + ((cursor_pageX - eventHandler_spaceX) / vectron_zoom);
                vectron_panY = eventHandler_startPanY + ((eventHandler_spaceY - cursor_pageY) / vectron_zoom);

                eventHandler_space = false;
                eventHandler_startPanX = null;
                eventHandler_startPanY = null;

                vectron_render();
                cursor_render(cursor_pageX, cursor_pageY, vectron_zoom);
            }
        }).keydown(function(evt) {
            if (evt.keyCode == 32 && !eventHandler_space) {
                eventHandler_space = true;
                eventHandler_spaceX = cursor_realX;
                eventHandler_spaceY = cursor_realY;

                if(eventHandler_startPanX == null) {
                    eventHandler_startPanX = vectron_panX;
                }
                if(eventHandler_startPanY == null) {
                    eventHandler_startPanY = vectron_panY;
                }
            }
        });
    });

    $(function() {
        $(document).keyup(function(evt) {
            if (evt.keyCode == 16 && eventHandler_shift) {
                gui_writeLog("Shift up.");
                eventHandler_shift = false;
            }
        }).keydown(function(evt) {
            if (evt.keyCode == 16 && !eventHandler_shift) {    
                gui_writeLog("shift down.");
                eventHandler_shift = true;
            }
        });
    });

    Mousetrap.bind('del', function(e) {
        if(!aamap_active) return;
        if(vectron_currentTool == "select" && !vectron_toolActive) {
            selectTool_delete();
        }

    });

    Mousetrap.bind('shift+w', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "wall" && vectron_toolActive) {
            wallTool_complete();
        }

    });

     Mousetrap.bind('shift+z', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "zone") {
            zoneTool_type += 1;
            if(zoneTool_type > 4) {
                zoneTool_type = 0;
            }
           gui_writeLog('Zone Tool Toggled: '
                + zoneTool_typeArray[zoneTool_type][0]);
            zoneTool_guide();
        }
    });

    Mousetrap.bind('=', function(e) {
       if(!aamap_active) return;

        if(vectron_currentTool == "zone") {
            if(zoneTool_radius < 30) {
                zoneTool_radius += 0.1;
                zoneTool_guide();
            }
        }
    }, 'keydown');

    Mousetrap.bind('+', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "zone") {
            if(zoneTool_radius < 30) {
                zoneTool_radius = Math.floor(zoneTool_radius) + 1;
                zoneTool_guide();
            }
        }
    }, 'keydown');

    Mousetrap.bind('-', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "zone") {
            if(zoneTool_radius > 0) {
                zoneTool_radius -= 0.1;
                zoneTool_guide();
            }
        }
    }, 'keydown');

    Mousetrap.bind('_', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "zone") {
            if(zoneTool_radius > 0) {
                zoneTool_radius = Math.floor(zoneTool_radius) - 1;
                zoneTool_guide();
            }
        }
    }, 'keydown');

    Mousetrap.bind('w', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool == "wall") {
            return;
        } else {
            vectron_connectTool("wall");
        }
    }, 'keydown');

    Mousetrap.bind('z', function(e) {
        if(!aamap_active) return;

        if(vectron_currentTool != "zone") {
            vectron_connectTool("zone");
        }
    }, 'keydown');

    Mousetrap.bind('right', function(e) {
        if(!aamap_active) return;

        vectron_panX -= 0.1;
        vectron_render();
    });
    Mousetrap.bind('left', function(e) {
        if(!aamap_active) return;

        vectron_panX += 0.1;
        vectron_render();
    });
    Mousetrap.bind('up', function(e) {
        if(!aamap_active) return;

        vectron_panY -= 0.1;
        vectron_render();
    });
    Mousetrap.bind('down', function(e) {
        if(!aamap_active) return;

        vectron_panY += 0.1;
        vectron_render();
    });
    Mousetrap.bind('shift+space', function(e) {
        if(!aamap_active) return;

        aamap_panCenter();
    });

}

window.onresize = function() {
    vectron_render();
}

