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
    'Canvas',
    'Aamap',
    'aamapObjects',
    'AamapTools',
    'Toolbar',
    'Info',
    'Mediator',
    'geometry',
    'mousetrap'
], function(Canvas, Aamap, aamapObjects, AamapTools, Toolbar, Info, Mediator, geometry) {
    'use strict';

    var Vectron = Backbone.View.extend({

        initialize: function() {
            this.currentMap = new Aamap();
            this.maps = [this.currentMap];

            this.aamapTools = new AamapTools();

            this.toolbar = new Toolbar({
                el: this.$('.toolbar')
            });

            this.info = new Info({
                el: this.$('.info')
            });


            // temporary, must move to event handler
            this.initShortcuts();

            this.aamapTools.selectTool('select');

            this.canvas = new Canvas({
                el: this.$('.canvas-container')
            });


            // testing map/canvas
            var death = aamapObjects.createZone(0, 0, 10, 'death');
            this.currentMap.add(death);

            var win = aamapObjects.createZone(250, -250, 250, 'win');
            this.currentMap.add(win);

            var rubber = aamapObjects.createZone(250, -250, 50, 'rubber');
            this.currentMap.add(rubber);

            var fortress = aamapObjects.createZone(-250, 250, 250, 'fortress');
            this.currentMap.add(fortress);

            var target = aamapObjects.createZone(-250, 250, 50, 'target');
            this.currentMap.add(target);
        },

        events: {
            keydown: function (event) {
                if (event.keyCode == '32') {
                    if (! this.canvas.isPanning()) {
                        Mediator.publish('canvas:pan-start');
                    }
                }
            },

            keyup: function (event) {
                if (event.keyCode == '32') {
                    Mediator.publish('canvas:pan-stop');
                }
            }
        },

        subscriptions: {
            'tool:createdObject': function (object) {
                this.currentMap.add(object);
            }
        },

        initShortcuts: function () {
            Mousetrap.bind('v', function (event) {
                Mediator.publish('tool:connect', 'select');
            }.bind(this));

            Mousetrap.bind('s', function (event) {
                Mediator.publish('tool:connect', 'spawn');
            }.bind(this));

            Mousetrap.bind('w', function (event) {
                Mediator.publish('tool:connect', 'wall');
            }.bind(this));

            Mousetrap.bind('z', function (event) {
                Mediator.publish('tool:connect', 'zone');
            }.bind(this));

            Mousetrap.bind('+', function (event) {
                Mediator.publish('canvas:zoom-in');
            }.bind(this));

            Mousetrap.bind('-', function (event) {
                Mediator.publish('canvas:zoom-out');
            }.bind(this));

            Mousetrap.bind('x', function (event) {
                Mediator.publish('canvas:snap');
            }.bind(this));
        }
    });

    return Vectron;
});