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

define([], function() {
    'use strict';

    function Point(x, y) {
        if (x === undefined || isNaN(x)) {
            x = 0;
        }
        if (y === undefined || isNaN(y)) {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }

    Point.prototype = {
        add: function (point) {
            this.x += point.x;
            this.y += point.y;
            return this;
        },

        subtract: function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        },

        clone: function () {
            return new Point(this.x, this.y);
        },

        toString: function () {
            return this.x + ',' + this.y;
        },

        getDistanceFromSegment: function(segment) {

        },

        getDistanceFromPoint: function (point) {
            // pythagoras
            return Math.sqrt(
                Math.pow(this.x - point.x, 2) +
                Math.pow(this.y - point.y, 2)
            );
        }
    };




    function Segment (start, end) {
        this.start = start;
        this.end = end;
    }

    Segment.prototype = {
        getDistanceFromPoint: function (point) {
            
        }
    };



    function PathBuilder() {
        var string = '';

        this.moveTo = function (x, y) {
            string += 'M' + x + ' ' + y;
            return this;
        };

        this.lineTo = function (x, y) {
            string += 'L' + x + ' ' + y;
            return this;
        };

        this.getString = function () {
            return string;
        };
    }

    return {
        Point: Point,
        Segment: Segment,
        PathBuilder: PathBuilder
    };
});
