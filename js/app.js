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

// global config for conditional debugging and logging
window.appConfig = {
    version: '2.0.2',

    production: false,
    development: false,

    debugMediator: false
};

// avoid global variables with encapsulation
(function() {
    'use strict';

    if (window.location.host == 'localhost') {
        appConfig.development = true;
    } else {
        appConfig.production = true;
    }

    // using urlArgs to prevent browser from loading old scripts
    var urlArgs = appConfig.version;

    if (appConfig.development) {
        // never cache in localhost
        urlArgs = new Date().getTime();
    }


    // requirejs configuration

    requirejs.config({
        baseUrl: 'js',

        urlArgs: urlArgs,
        paths: {
            jquery: 'libs/jquery',
            bootstrap: 'libs/bootstrap.min',
            underscore: 'libs/underscore-min',
            backbone: 'libs/backbone-min',
            Mediator: 'libs/backbone-mediator',
            raphael: 'libs/raphael-min',
            mousetrap: 'libs/mousetrap.min',
            marknote: 'libs/marknote',
            mousewheel: 'libs/jquery.mousewheel',
            vectron: 'Vectron'
        },

        // external libs missing define()
        shim: {
            jquery: {
                exports: 'jQuery'
            },
            underscore: {
              exports: '_'
            },
            backbone: {
              deps: ['underscore'],
              exports: 'Backbone'
            },
            Mediator: ['backbone'],
            bootstrap: ['jquery'],
            raphael: {
                exports: 'Raphael'
            }
        }
    });

    // start application

    requirejs(['vectron', 'bootstrap'], function(Vectron) {

        // add version to doc title
        var $title = $('head title');
        $title.text($title.text() + ' ' + appConfig.version);

        window.app = new Vectron({
            el: '#vectron'
        });

        $('[rel=tooltip]').tooltip();

        // trigger window resize globally
        $(window).resize(function () {
            Mediator.publish('window:resize');
        }.bind(this));

    });
})();
