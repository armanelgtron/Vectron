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
    'Mediator'
], function(BaseButton, Mediator) {
    'use strict';

    var ToolButton = BaseButton.extend({
        /*
        initialize: function (options) {
            ToolButton.__super__.initialize.apply(this, arguments);
        },
        */

        onClick: function () {
            // ask for tool selection
            Mediator.publish('tool:connect', this.name);
        },

        subscriptions: {
            'tool:status-changed': 'updateStatus'
        },

        updateStatus: function (tool) {
            if (tool.get('name') == this.name) {
                this.setActive(tool.get('active'));
            };
        }
    });

    return ToolButton;
});
