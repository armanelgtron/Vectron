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
    'toolbarButtons/BaseButton',
    'toolbarButtons/ToolButton',
    'toolbarButtons/CanvasButton',
    'Mediator'
], function(BaseButton, ToolButton, CanvasButton, Mediator) {
    'use strict';

    var buttonTypes = {
        tool: ToolButton,
        canvas: CanvasButton
    };

    var Toolbar = Backbone.View.extend({
        initialize: function(options) {
            this.buttons = {};
            this.$('.button')
                .each(this.createButton.bind(this))
                .tooltip({placement: 'right'});
        },

        createButton: function(index, el) {
            var $el = $(el),
                type = $el.data('type'),
                buttonParams = {el: $el},
                button = null;

            try {
                // create specific button type if possible
                button = new (buttonTypes[type])(buttonParams);
            } catch (err) {
                // otherwise create basic button
                button = new BaseButton(buttonParams);
            }

            return this.buttons[button.name] = button;
        }
    });

    return Toolbar;
});
