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

requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'libs/jquery',
        bootstrap: 'libs/bootstrap.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        raphael: 'libs/raphael-min',
        mousetrap: 'libs/mousetrap.min',
        marknote: 'libs/marknote',
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
        bootstrap: ['jquery'],
        raphael: {
            exports: 'Raphael'
        }
    }
});

requirejs(['jquery', 'vectron', 'bootstrap'], function($, Vectron) {

    // bad practice, just use for debugging in console
    //window.vectron = new Vectron();

    new Vectron();

    $('[rel=tooltip]').tooltip();

});
