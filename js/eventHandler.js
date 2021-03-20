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
        var mapAxes = parseInt($("#map_axes").val().trim());
        var mapSets = $("#map_settings").val().split("\n");

        aamap_save(mapName, mapAuthor, mapCategory, mapVersion, mapDtd, mapAxes, mapSets);
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

    $("#start-tour").mouseup(function(e) {
        tour.complete();
        tour.start();
        if(gui_active) {
            gui_hide();
            $(".toolbar-gui-close").hide();
            $(".toolbar-gui-open").show();
        }
        gui_writeLog('GUI TOGGLE');
        $("#zones-menu").hide();
    });

    // Handle settings changes
    $("#dark-theme").change(function(box)
    {
        if($("#dark-theme").is(':checked'))
            enable_dark_theme();
        else
            disable_dark_theme();
    });
    
    $("#show-info-bar").change(function(box)
    {
        if($("#show-info-bar").is(':checked'))
            show_info_bar();
        else
            hide_info_bar();
    });
    
    $("#show-debug-panel").change(function(box)
    {
        if($("#show-debug-panel").is(':checked'))
            show_debug();
        else
            hide_debug();
    });


    $(".toolbar-copy").mouseup(function(e) {
        selectTool_copy();
    });
    
    $(".toolbar-paste").mouseup(function(e) {
        selectTool_paste();
    });

    $(".toolbar-toolSelect").mouseup(function(e) {
        vectron_connectTool("select");
        gui_writeLog('Select Tool Connected.');
        $("#zones-menu").hide();
    });

    $(".toolbar-toolNavigation").mouseup(function(e) {
        vectron_connectTool("navigation");
        gui_writeLog('Navigation Tool Connected.');
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
        vectron_zoom *= 1.1;
        vectron_zoom_adjustment();
        vectron_render();
        $("#zones-menu").hide();
    });

    $(".toolbar-toolZoomOut").mouseup(function(e) {
        vectron_zoom /= 1.1;
        vectron_zoom_adjustment();
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
            if(wallTool_currentObj.points.length > 1)
            {
                wallTool_currentObj.points.pop();
                vectron_render();
                wallTool_currentObj.guide();
            }
            else
            {
                wallTool_disconnect();
                vectron_currentTool = "";
                vectron_connectTool("wall");
            }
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

    $(".toolbar-redo").mouseup(function(e) {
        aamap_redo();
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
                } else if(vectron_currentTool == "navigation" && vectron_toolActive) {
                    navigationTool_complete();
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
                } else if(vectron_currentTool == "navigation" && !vectron_toolActive) {
                    navigationTool_start();
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
            navigationTool_progress();
            return;
        }

        cursor_render(cursor_pageX, cursor_pageY, vectron_zoom*vectron_grid_spacing);

        if(vectron_currentTool == "wall" && vectron_toolActive) {
            wallTool_currentObj.guide();
            navigationTool_autopan(function(){
                wallTool_currentObj.guide();
            });
        } else if(vectron_currentTool == "zone") {
            zoneTool_guide();
        } else if(vectron_currentTool == "spawn") {
            if(spawnTool_currentObj != null)
                spawnTool_currentObj.guide();
        } else if(vectron_currentTool == "select" && vectron_toolActive) {
            selectTool_progress();
        } else if(vectron_currentTool == "navigation" && vectron_toolActive) {
            navigationTool_progress();
        }

    });
    
    var prev_vectron_zoom = 0;
    var __zoom_timeout;
    document.getElementById("canvas_container").onwheel=(function(event)
    {
        if(config_scrollWheelZoom)
        {
            if(prev_vectron_zoom == 0)
            {
                prev_vectron_zoom = vectron_zoom;
            }
            if(event.deltaY > 0)
            {
                if(vectron_zoom > 0.01)
                    vectron_zoom *= 0.98;
            }
            else
            {
                vectron_zoom /= 0.98;
            }
            
            var vs = ((vectron_zoom)-prev_vectron_zoom)*(1/vectron_zoom);
            vectron_screen.setViewBox(
                (vectron_width/2)*vs, (vectron_height/2)*vs,
                vectron_width-(vectron_width*vs), vectron_height-(vectron_height*vs)
            );
            clearTimeout(__zoom_timeout);
            __zoom_timeout = setTimeout(function(){prev_vectron_zoom=0;vectron_render()},150);
        }
    });

    $(function() {
        $(document).keyup(function(evt) {
            if (evt.keyCode == 32 && eventHandler_space) {
                eventHandler_space = false;
                var tool = vectron_toolActive;
                navigationTool_complete();
                vectron_toolActive = tool;
            }
        }).keydown(function(evt) {
            if (evt.keyCode == 32 && !eventHandler_space) {
                eventHandler_space = true;
                navigationTool_clickX = cursor_realX;
                navigationTool_clickY = cursor_realY;

                if(navigationTool_startPanX == null) {
                    navigationTool_startPanX = vectron_panX;
                }
                if(navigationTool_startPanY == null) {
                    navigationTool_startPanY = vectron_panY;
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

    Mousetrap.bind('escape', function(e) {
        if(vectron_toolActive)
        {
            if(vectron_currentTool == "wall")
            {
                wallTool_disconnect();
                vectron_currentTool = "";
                vectron_connectTool("wall");
            }
            else if(vectron_currentTool == "spawn")
            {
                spawnTool_disconnect();
                vectron_currentTool = "";
                vectron_connectTool("spawn");
            }
        }
    });

    Mousetrap.bind('right', function(e) {
        if(!aamap_active) return;

        navigationTool_manualPan(-1.6*vectron_zoom,0);
    });
    Mousetrap.bind('left', function(e) {
        if(!aamap_active) return;

        navigationTool_manualPan(1.6*vectron_zoom,0);
    });
    Mousetrap.bind('up', function(e) {
        if(!aamap_active) return;

        navigationTool_manualPan(0,-1.6*vectron_zoom);
    });
    Mousetrap.bind('down', function(e) {
        if(!aamap_active) return;

        navigationTool_manualPan(0,1.6*vectron_zoom);
    });
    Mousetrap.bind('shift+space', function(e) {
        if(!aamap_active) return;

        aamap_panCenter();
    });

}

window.onresize = function() {
    vectron_render();
}

