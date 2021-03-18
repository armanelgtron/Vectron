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

    function GUI(vectron) {

        this.vectron = vectron;
        this.active = false;

        this.debug;
        this.messages = [];

    }

    GUI.prototype = {

        constructor: GUI,

        // Called when settings saved or anythign changes so the debug log can be removed
        render:function() {

        },

        //Write a message to the debug log
        writeLog:function(message) {
            $('#debug_stream').append('<span>' + message + '</span');
            var element = document.getElementById("debug_stream");
            element.scrollTop = element.scrollHeight;
        },

        //Clear the debug log
        clearLog:function(message) {

        },

        show:function() {
            this.vectron.map.active = false;
            $("#control_box").show();
            this.active = true; //No longer active
        },

        hide:function() {
            $("#control_box").hide();
            this.vectron.map.active = true;
            this.active = false; //Active!
        }

    };

    return GUI;

});

