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


var config_isDark = false;
var config_scrollWheelZoom = true;
var config_snapToPosition = true;

function config_load()
{
    // Initialize default values if necessary
    if(localStorage.getItem("darkTheme") == null)
        localStorage.setItem("darkTheme","true");
    
    if(localStorage.getItem("showInfoBar") == null)
        localStorage.setItem("showInfoBar","false"); 
    
    if(localStorage.getItem("showDebug") == null)
        localStorage.setItem("showDebug","false");
    
    
    // Load saved values
    if(localStorage.getItem("darkTheme") == "true")
        enable_dark_theme();
    
    if(localStorage.getItem("showInfoBar") == "true")
        show_info_bar();
    
    if(localStorage.getItem("showDebug") == "false")
        hide_debug();
}


function enable_dark_theme()
{
    document.getElementById("theme").href = "./css/vectron-dark.css";
    config_isDark = true;
    vectron_render();
    
    document.getElementById("dark-theme").checked = true;
    localStorage.setItem("darkTheme","true");
}
function disable_dark_theme()
{
    document.getElementById("theme").href = "";
    config_isDark = false;
    vectron_render();
    
    document.getElementById("dark-theme").checked = false;
    localStorage.setItem("darkTheme","false");
}

function show_info_bar()
{
    document.getElementsByClassName("info")[0].style.display = "";
    //marginRight
    document.getElementById("canvas_container").style.right = "100px";
    vectron_render();
    
    document.getElementById("show-info-bar").checked = true;
    localStorage.setItem("showInfoBar","true");
}
function hide_info_bar()
{
    document.getElementsByClassName("info")[0].style.display = "none";
    document.getElementById("canvas_container").style.right = "";
    vectron_render();
    
    document.getElementById("show-info-bar").checked = false;
    localStorage.setItem("showInfoBar","false");
}

function show_debug()
{
    document.getElementById("debug_box").className = "";
    
    document.getElementById("show-debug-panel").checked = true;
    localStorage.setItem("showDebug","true");
}
function hide_debug()
{
    document.getElementById("debug_box").className = "nodbug";
    
    document.getElementById("show-debug-panel").checked = false;
    localStorage.setItem("showDebug","false");
}
