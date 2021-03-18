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

define(['Mediator'], function(Mediator) {
    'use strict';

    var BaseButton = Backbone.View.extend({
        events: {
            click: function(event) {
                event.preventDefault();
                if (_.isFunction(this.onClick)) {
                    this.onClick();
                };
            }
        },

        initialize: function(options) {
            this.name = this.$el.data('name');
            this.type = this.$el.data('type');

            // listen to event, ex: 'button:zoom-in-enable'
            Mediator.subscribe('button:' + this.name + '-enable', this.setEnabled, this);

            // listen to event, ex: 'button:zoom-in-active'
            Mediator.subscribe('button:' + this.name + '-active', this.setActive, this);
        },

        setEnabled: function (enabled) {
            if (enabled) {
                this.$el.removeClass('disabled');
            } else {
                this.$el.addClass('disabled');
            }
        },

        setActive: function (active) {
            if (active) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        }
    });

    return BaseButton;
});
