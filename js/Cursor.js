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

    function Cursor(vectron) {

        this.vectron = vectron;
        this.active = true;

        this.snap = true; // snap to grid?

        //Real coordinates used to draw things
        //Aamap has a mapX and mapY function which convert these to the XML values to be used.
        this.realX;
        this.realY;

        this.obj = vectron.screen.path();

    }  
     
    Cursor.prototype = {

        constructor: Cursor,

        // Called when settings saved or anythign changes so the debug log can be removed
        render:function(newX, newY, spacing) {

            if(!this.active) {
                return;
            }

            this.obj.remove();

            /*
             * snap to grid only with drawing tools
             * <tool>.active property is not updated, TODO fix this
             * would be better to receive tools as param and do:
             * if (this.snap && false == tools.select.active)
             */
            if(this.snap && false == (this.vectron.map.currentTool instanceof Tools.Select)) {
                var midWidth = this.vectron.width/2 + (this.vectron.map.zoom * this.vectron.map.panX);
                var midHeight = this.vectron.height/2 - (this.vectron.map.zoom * this.vectron.map.panY);

                this.realX = (midWidth) - Math.round(((midWidth) - newX) /
                    spacing) * spacing;

                this.realY = (midHeight) - Math.round(((midHeight) - newY) /
                    spacing) * spacing;
            } else {
                this.realX = newX;
                this.realY = newY;
            }

            this.obj = this.vectron.screen.path(
                ['M', this.realX - 7, this.realY,
                 'L', this.realX - 2, this.realY,
                 'M', this.realX + 2, this.realY,
                 'L', this.realX + 7, this.realY,
                 'M', this.realX, this.realY - 7,
                 'L', this.realX, this.realY - 2,
                 'M', this.realX, this.realY + 2,
                 'L', this.realX, this.realY + 7]
            );

        },

        show:function() {
            this.active = true; //Draw the cursor!
            this.render();
        },

        hide:function() {
            this.active = false; //Dont draw the cursor!
            this.obj.remove();
        }

    };

    return Cursor;

});
