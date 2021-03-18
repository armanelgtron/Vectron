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

define(['geometry', 'Mediator'], function(geometry, Mediator) {
    'use strict';

    function LabeledValue(name, value) {
        this.$el = $('<span class="var"/>');

        var $name = $('<span class="name">' + name + '</span>')
            .appendTo(this.$el);

        var $value = $('<span class="value">' + value + '</span>')
            .appendTo(this.$el);

        this.set = function (value) {
            $value.html(value);
        };
    }

    var Info = Backbone.View.extend({
        initialize: function(options) {
            this.cursor = {
                x: new LabeledValue('x: ', 0),
                y: new LabeledValue('y: ', 0)
            };

            //this.zoom = new LabeledValue('zoom: ', '100%');
            this.zoom = new LabeledValue('zoom: ', 1);

            this.anchor = {
                x: new LabeledValue('x: ', 0),
                y: new LabeledValue('y: ', 0)
            };

            this.mouse = {
                x: new LabeledValue('x: ', 0),
                y: new LabeledValue('y: ', 0)
            };

            this.$el
                .append('cursor')
                .append(this.cursor.x.$el)
                .append(this.cursor.y.$el)
                .append('<br>')
                .append(this.zoom.$el)
                .append('<br>map anchor')
                .append(this.anchor.x.$el)
                .append(this.anchor.y.$el)
                .append('<br>mouse')
                .append(this.mouse.x.$el)
                .append(this.mouse.y.$el)
                ;
        },

        // Backbone.Mediator automatic subscriptions
        subscriptions: {
            'canvas:cursor-moved': function (cursor) {
                this.cursor.x.set(cursor.x);
                this.cursor.y.set(cursor.y);
            },

            'canvas:zoom-changed': function (value) {
                //this.zoom.set(Math.round(value * 100) + '%');
                this.zoom.set(value);
            },

            'canvas:anchor-changed': function (anchor) {
                this.anchor.x.set(anchor.x);
                this.anchor.y.set(anchor.y);
            },

            'canvas:mouse-moved': function (mousePos) {
                this.mouse.x.set(mousePos.x);
                this.mouse.y.set(mousePos.y);
            }
        }
    });

    return Info;
});
