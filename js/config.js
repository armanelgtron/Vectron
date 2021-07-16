/*
********************************************************************************
Vectron - map editor for Armagetron Advanced.
Copyright (C) 2017  Glen Harpring       (armanelgtron@gmail.com)
Copyright (C) 2014  Tristan Whitcher    (tristan.whitcher@gmail.com)
David Dubois        (ddubois@jotunstudios.com)
Copyright (C) 2010  Carlo Veneziano     (carlorfeo@gmail.com)
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
var config_autoAdjustGridSpacing = true;

// default values:
function _config_check_default(item)
{
    switch(item)
    {
        case "darkTheme": return "true";
        case "showInfoBar": return "true";
        case "showDebug": return "false";
    }
}



function _config_get(item)
{
    if(window.localStorage)
    {
        return localStorage.getItem(item);
    }
    else if(window.sessionStorage)
    {
        return sessionStorage.getItem(item);
    }
    else
    {
        if(!window._localStorage) window._localStorage = {};
        if(window._localStorage[item] === undefined) return null;
        else return window._localStorage[item];
    }
}

function _config_set(item,value)
{
    if(window.localStorage)
    {
        return localStorage.setItem(item,value);
    }
    else if(window.sessionStorage)
    {
        return sessionStorage.setItem(item,value);
    }
    else
    {
        if(!window._localStorage) window._localStorage = {};
        window._localStorage[item] = value;
    }
}

function _config_check(item)
{
    var value = _config_get(item);
    if(value === null)
        value = _config_check_default(item);

    return (value=="true");
}

function _config_set_enable(item)
{
    return _config_set(item,"true");
}
function _config_set_disable(item)
{
    return _config_set(item,"false");
}



function config_load()
{
    // load values without changing anything
    if(_config_check("darkTheme"))
        enable_dark_theme(true);
    
    if(_config_check("showInfoBar"))
        show_info_bar(true);
    
    if(!_config_check("showDebug"))
        hide_debug(true);
}


var __darktheme_has_loaded = false;
function enable_dark_theme(noset)
{
    var theme = document.getElementById("theme");
    if("onload" in theme && !__darktheme_has_loaded)
    {
        theme.onload = function()
        {
            config_isDark = true;
            __darktheme_has_loaded = true;
            vectron_render();
        };
    }
    else
    {
        config_isDark = true;
        vectron_render();
    }
    theme.href = "./css/vectron-dark.css";
    
    document.getElementById("dark-theme").checked = true;
    if(!noset) _config_set_enable("darkTheme");
}
function disable_dark_theme(noset)
{
    var theme = document.getElementById("theme");
    if(theme.onload) theme.onload = null;
    theme.href = "";
    
    config_isDark = false;
    vectron_render();
    
    document.getElementById("dark-theme").checked = false;
    if(!noset) _config_set_disable("darkTheme");
}

function show_info_bar(noset)
{
    document.getElementsByClassName("info")[0].style.display = "";
    //marginRight
    document.getElementById("canvas_container").style.right = "100px";
    vectron_render();
    
    document.getElementById("show-info-bar").checked = true;
    if(!noset) _config_set_enable("showInfoBar");
}
function hide_info_bar(noset)
{
    document.getElementsByClassName("info")[0].style.display = "none";
    document.getElementById("canvas_container").style.right = "";
    vectron_render();
    
    document.getElementById("show-info-bar").checked = false;
    if(!noset) _config_set_disable("showInfoBar");
}

function show_debug(noset)
{
    document.getElementById("debug_box").className = "";
    
    document.getElementById("show-debug-panel").checked = true;
    if(!noset) _config_set_enable("showDebug");
}
function hide_debug(noset)
{
    document.getElementById("debug_box").className = "nodbug";
    
    document.getElementById("show-debug-panel").checked = false;
    if(!noset) _config_set_disable("showDebug");
}
