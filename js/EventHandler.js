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

define(['mousetrap', 'Tools'], function(Mousetrap, Tools) {

    function EventHandler(vectron) {

        //setup key handling here also.
        vectron.map.selectTool.connect();

        var space = false;
        var spaceX = 0;
        var spaceY = 0;
        var startPanX = null;
        var startPanY = null;
        $(function() {
          $(document).keyup(function(evt) {
            if (evt.keyCode == 32) {
              space = false;
              startPanX = null;
              startPanY = null;
              vectron.cursor.render(vectron.cursor.pageXVal, vectron.cursor.pageYVal, vectron.map.zoom);
              vectron.render();
              vectron.cursor.render(vectron.cursor.pageXVal, vectron.cursor.pageYVal, vectron.map.zoom);
            }
          }).keydown(function(evt) {
            if (evt.keyCode == 32) {
              space = true;
              spaceX = vectron.cursor.realX;
              spaceY = vectron.cursor.realY;
              if(startPanX == null)
                startPanX = vectron.map.panX;
              if(startPanY == null)
                startPanY = vectron.map.panY;
            }
          });
        });

        window.onresize = function() {
            vectron.render();
        }

        $("#canvas_container").mousemove(function(event) {
            if(!vectron.map.active)
                return;
            event.pageX -= 50;

            vectron.cursor.pageXVal = event.pageX;
            vectron.cursor.pageYVal = event.pageY;

            if(space) {
                vectron.map.panX = startPanX + ((event.pageX - spaceX) / vectron.map.zoom);
                vectron.map.panY = startPanY + ((spaceY - event.pageY) / vectron.map.zoom);
                vectron.render();
                return;
            }
            vectron.cursor.render(event.pageX, event.pageY, vectron.map.zoom);

            if(vectron.map.currentTool instanceof Tools.Zone) {
                vectron.map.currentTool.guide();

            } else if(vectron.map.currentTool instanceof Tools.Select) {
                if(vectron.map.currentTool.active)
                    vectron.map.currentTool.progress();

            } else if( vectron.map.currentTool != null ) {
                if(vectron.map.currentTool.active)
                    vectron.map.currentTool.currentObj.guide();
            }

        });

        $("#canvas_container").mouseleave(function(e) {
            e.preventDefault();
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Select) {
                if(vectron.map.currentTool.active)
                    vectron.map.currentTool.complete();
            }

        }); 


        $("#canvas_container").mousedown(function(e) {
            e.preventDefault();
            if(!vectron.map.active)
                return;

            if(vectron.map.currentTool instanceof Tools.Select) {
                vectron.map.currentTool.start();
            }

        }); 

        $("#canvas_container").mouseup(function(e) {
            e.preventDefault();
            if(!vectron.map.active)
                return;

            if(vectron.map.currentTool instanceof Tools.Wall) {

                if(vectron.map.wallTool.active)
                    vectron.map.currentTool.progress();
                else
                    vectron.map.currentTool.start();

            } else if(vectron.map.currentTool instanceof Tools.Zone) {

                vectron.map.currentTool.complete();

            } else if(vectron.map.currentTool instanceof Tools.Spawn) {

               if(vectron.map.spawnTool.active)
                    vectron.map.currentTool.complete();
                else
                    vectron.map.currentTool.start();
            } else if(vectron.map.currentTool instanceof Tools.Select) {

                vectron.map.currentTool.complete();

            }

        }); 

        $("#canvas_container").dblclick(function(e) {
            e.preventDefault();
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Wall) {
                if(vectron.map.wallTool.active)
                    vectron.map.currentTool.complete();
            }

        });

        // TOOLBAR

        $("#toolbar-gui-open").mouseup(function(e) {
            if(!vectron.gui.active) {
                vectron.gui.show(); // sets active state
                $("#toolbar-gui-open").hide();
                $("#toolbar-gui-close").show();
            }
            vectron.gui.writeLog('GUI TOGGLE');
            $("#zones-menu").hide();
        });

        $("#toolbar-gui-close").mouseup(function(e) {
            if(vectron.gui.active) {
                vectron.gui.hide();
                $("#toolbar-gui-close").hide();
                $("#toolbar-gui-open").show();
            }
            vectron.gui.writeLog('GUI TOGGLE');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolSelect").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Select) {
                return;
            } else {
                vectron.map.selectTool.connect();
                vectron.gui.writeLog('Select Tool Connected.');
            }
            $("#zones-menu").hide();
        });

        $("#toolbar-toolWall").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Wall) {
                return;
            } else {
                vectron.map.wallTool.connect();
                vectron.gui.writeLog('Wall Tool Connected.');
            }
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZone").mouseup(function(e) {
            $("#zones-menu").toggle();

        });
            //ZONES

        $("#toolbar-toolZone-death").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(!(vectron.map.currentTool instanceof Tools.Zone)) {
                vectron.map.zoneTool.connect();
            }
            vectron.map.zoneTool.type = 0;
            vectron.map.currentTool.guide();
            vectron.gui.writeLog('DeathZone selected.');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZone-win").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(!(vectron.map.currentTool instanceof Tools.Zone)) {
                vectron.map.zoneTool.connect();
            }
            vectron.map.zoneTool.type = 1;
            vectron.map.currentTool.guide();
            vectron.gui.writeLog('WinZone selected.');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZone-target").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(!(vectron.map.currentTool instanceof Tools.Zone)) {
                vectron.map.zoneTool.connect();
            }
            vectron.map.zoneTool.type = 2;
            vectron.map.currentTool.guide();
            vectron.gui.writeLog('TargetZone selected.');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZone-fortress").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(!(vectron.map.currentTool instanceof Tools.Zone)) {
                vectron.map.zoneTool.connect();
            }
            vectron.map.zoneTool.type = 4;
            vectron.map.currentTool.guide();
            vectron.gui.writeLog('FortressZone selected.');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZone-rubber").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(!(vectron.map.currentTool instanceof Tools.Zone)) {
                vectron.map.zoneTool.connect();
            }
            vectron.map.zoneTool.type = 3;
            vectron.map.currentTool.guide();
            vectron.gui.writeLog('RubberZone Selected.');
            $("#zones-menu").hide();
        });

            // SPAWN
        $("#toolbar-toolSpawn").mouseup(function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Spawn) {
                return;
            } else {
                vectron.map.spawnTool.connect();
                vectron.gui.writeLog('Spawn Tool Connected.');
            }
            $("#zones-menu").hide();
        });

        $("#toolbar-toolUnlock").mouseup(function(e) {
            vectron.cursor.snap = true;
            $('#toolbar-toolUnlock-list').css('display','none');
            $('#toolbar-toolLock-list').css('display','block');
            $("#zones-menu").hide();
        });

        $("#toolbar-toolLock").mouseup(function(e) {
            vectron.cursor.snap = false;
            $('#toolbar-toolLock-list').css('display','none');
            $('#toolbar-toolUnlock-list').css('display','block');
            $("#zones-menu").hide();
        });

            //cancel
        $("#toolbar-disconnect").mouseup(function(e) {
            if(vectron.map.currentTool instanceof Tools.Zone) {
                vectron.map.remove();
            } else if(vectron.map.currentTool instanceof Tools.Wall) {
                if(vectron.map.currentTool.active) {
                    vectron.map.currentTool.disconnect();
                    vectron.map.wallTool.connect();
                } else {
                    vectron.map.remove();
                }
            } else if(vectron.map.currentTool instanceof Tools.Spawn) {
                if(vectron.map.currentTool.active) {
                    vectron.map.currentTool.disconnect();
                    vectron.map.wallTool.connect();
                } else {
                    vectron.map.remove();
                }
            } else if(vectron.map.currentTool instanceof Tools.Select) {
                vectron.map.currentTool.disconnect();
                vectron.map.selectTool.connect();
            }
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZoomIn").mousedown(function(e) {
            if(vectron.map.zoom < 60) {
                vectron.map.zoom += 1;
            }
            vectron.render();
            $("#zones-menu").hide();
        });

        $("#toolbar-toolZoomOut").mouseup(function(e) {
            if(vectron.map.zoom > 5) {
                vectron.map.zoom -= 1;
            }
            vectron.render();
            $("#zones-menu").hide();
        });

        //Scaling//

        // Need better icons for these.

        $("#toolbar-toolScaleUp").mousedown(function(e) {
            vectron.map.scale(2);
            $("#zones-menu").hide();
        });

        $("#toolbar-toolScaleDown").mouseup(function(e) {
            vectron.map.scale(0.5);
            $("#zones-menu").hide();
        });



        Mousetrap.bind('shift+w', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Wall) {
                if(vectron.map.wallTool.active)
                    vectron.map.currentTool.complete();
            
            }
        });

         Mousetrap.bind('shift+z', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                vectron.map.zoneTool.type += 1;
                if(vectron.map.zoneTool.type > 4) {
                    vectron.map.zoneTool.type = 0;
                }
                vectron.gui.writeLog('Zone Tool Toggled: '
                    + vectron.map.zoneTool.typeArray[vectron.map.zoneTool.type][0]);
                vectron.map.currentTool.guide();
            }
        });

        Mousetrap.bind('=', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                if(vectron.map.zoneTool.radius < 30) {
                    vectron.map.zoneTool.radius += 0.1;
                    vectron.map.currentTool.guide();
                }
            }
        }, 'keydown');

        Mousetrap.bind('+', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                if(vectron.map.zoneTool.radius < 30) {
                    vectron.map.zoneTool.radius = Math.floor(vectron.map.zoneTool.radius) + 1;
                    vectron.map.currentTool.guide();
                }
            }
        }, 'keydown');

        Mousetrap.bind('-', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                if(vectron.map.zoneTool.radius > 0) {
                    vectron.map.zoneTool.radius -= 0.1;
                    vectron.map.currentTool.guide();
                }
            }
        }, 'keydown');

        Mousetrap.bind('_', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                if(vectron.map.zoneTool.radius > 0) {
                    vectron.map.zoneTool.radius = Math.floor(vectron.map.zoneTool.radius) - 1;
                    vectron.map.currentTool.guide();
                }
            }
        }, 'keydown');

        Mousetrap.bind('w', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Wall) {
                return;
            } else {
                vectron.map.wallTool.connect();
            }
        }, 'keydown');

        Mousetrap.bind('z', function(e) {
            if(!vectron.map.active)
                return;
            if(vectron.map.currentTool instanceof Tools.Zone) {
                return;
            } else {
                vectron.map.zoneTool.connect();
            }
        }, 'keydown');

        Mousetrap.bind('right', function(e) {
            if(!vectron.map.active)
                return;
            vectron.map.panX -= 0.1;
            vectron.render();
        });
        Mousetrap.bind('left', function(e) {
            if(!vectron.map.active)
                return;
            vectron.map.panX += 0.1;
            vectron.render();
        });
        Mousetrap.bind('up', function(e) {
            if(!vectron.map.active)
                return;
            vectron.map.panY -= 0.1;
            vectron.render();
        });
        Mousetrap.bind('down', function(e) {
            if(!vectron.map.active)
                return;
            vectron.map.panY += 0.1;
            vectron.render();
        });
        Mousetrap.bind('shift+space', function(e) {
            if(!vectron.map.active)
                return;
            vectron.map.panY = 0;
            vectron.map.panX = 0;
            vectron.render();
        });

    }  

    return EventHandler;

});
