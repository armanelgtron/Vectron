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
    'geometry',
    'raphael',
    'Mediator',
    'mousewheel'
], function(geometry, Raphael, Mediator) {
    'use strict';

    var Canvas = Backbone.View.extend({

        initialize: function(options) {
            this.zoom = 1;
            this.zoomMaxLimit = 100;
            this.zoomMinLimit = 0.01;
            this.zoomStep = 1.05;

            this.gridSize = 5000;
            this.gridStep = 10;
            this.gridStart = new geometry.Point;

            this.cursorSize = 10;

            this.snapTo = {
                grid: false,
                objects: false
            };

            // canvas anchor point to handle panning
            this.anchor = new geometry.Point;
            this.cursorPanStart = null;

            this.paper = new Raphael(
                this.el,
                this.$el.width(),
                this.$el.height()
            );

            this.objects = this.paper.set();
            this.createGrid();

            this.mousePos = new geometry.Point;
            this.updateCursorPos(0, 0);
            this.createCursorPointer();

            // temp centering
            var centerX = this.paper.width / 2;
            var centerY = -this.paper.height / 2;
            this.setAnchor(centerX, centerY);
            this.setZoom(10);

            this.render();
        },

        subscriptions: {
            'aamap:addedObject': 'addObject',
            'aamap:removedObject': 'removeObject',

            'canvas:zoom-in': 'zoomIn',
            'canvas:zoom-out': 'zoomOut',

            'canvas:pan-start': function () {
                if (! this.cursorPanStart) {
                    this.cursorPanStart = this.cursorPos.clone();
                }
            },

            'canvas:pan-stop': function () {
                this.cursorPanStart = null;
            },

            'canvas:snap': function () {
                this.snapTo.grid = !this.snapTo.grid;
                Mediator.publish('button:snap-active', this.snapTo.grid);
            },

            'window:resize': 'updateCanvasSize'
        },

        events: {
            mousemove: function (event) {
                if (this.cursorPanStart) {
                    // move canvas
                    var panTo = this
                        .screenToMap(event.offsetX, event.offsetY, true)
                        .subtract(this.cursorPanStart);

                    this.setAnchor(panTo.x, panTo.y);
                    this.render();
                } else {
                    // update cursor
                    this.updateCursorPos(event.offsetX, event.offsetY);
                }

                this.updateCursorPointer();
                this.updateMousePos(event.offsetX, event.offsetY);
            },

            mousewheel: function (event) {
                // delta depends on wheel speed
                if (event.deltaY > 0) {
                    this.zoomIn(event.deltaY, true);
                } else if (event.deltaY < 0) {
                    this.zoomOut(Math.abs(event.deltaY), true);
                };
            },

            // trigger filtered events for external use
            click: function (event) {
                Mediator.publish('canvas:click', this.externalInterface());
            },

            mousedown: function (event) {
                Mediator.publish('canvas:mousedown', this.externalInterface());
            },

            mouseup: function (event) {
                Mediator.publish('canvas:mouseup', this.externalInterface());
            }
        },

        externalInterface: function () {
            if (this._externalInterface) {
                return this._externalInterface;
            }

            return this._externalInterface = {
                getCursorPos: function (allowSnap) {
                    if (allowSnap) {
                        return this.cursorPos;
                    } else {
                        return this.realPos;
                    }
                }.bind(this)
            }
        },

        updateMousePos: function (x, y) {
            this.mousePos.x = x;
            this.mousePos.y = y;
            Mediator.publish('canvas:mouse-moved', this.mousePos);
        },

        /**
         * @x, y: mouse pos
         */
        updateCursorPos: function (x, y) {
            this.realPos = this.cursorPos = this.screenToMap(x, y);

            if (this.snapTo.grid && ! this.snapLocked) {
                // store original cursor position for adjustPan()
                this.realPos = this.cursorPos.clone();

                this.snapToGrid();
            }

            Mediator.publish('canvas:cursor-moved', this.cursorPos);
        },

        isPanning: function () {
            return this.cursorPanStart != null;
        },

        snapToGrid: function () {
            var halfStep = this.gridStep / 2;

            var adjust = new geometry.Point(
                this.cursorPos.x % this.gridStep,
                this.cursorPos.y % this.gridStep
            );

            if (this.cursorPos.x >= 0 && adjust.x >= halfStep) {
                adjust.x -= this.gridStep;
            } else if (this.cursorPos.x < 0 && adjust.x < -halfStep) {
                adjust.x += this.gridStep;
            }

            if (this.cursorPos.y >= 0 && adjust.y >= halfStep) {
                adjust.y -= this.gridStep;
            } else if (this.cursorPos.y < 0 && adjust.y < -halfStep) {
                adjust.y += this.gridStep;
            }

            this.cursorPos.subtract(adjust);
        },

        // move cross
        updateCursorPointer: function () {
            if (! this.cursorPointer)
                return;

            var screenPos = this.mapToScreen(this.cursorPos.x, this.cursorPos.y);
            screenPos.x = Math.round(screenPos.x);
            screenPos.y = Math.round(screenPos.y);

            this.cursorPointer.x.transform('T' + screenPos.x + ' ' + screenPos.y);
            this.cursorPointer.y.transform('T' + screenPos.x + ' ' + screenPos.y);
        },

        /**
         * @object type AamapObject
         */
        addObject: function (object) {
            var canvasElement;

            switch(object.type) {
                case 'zone':
                    var x = object.get('x');
                    var y = object.get('y'); // fix aamap y vs browser y
                    var radius = object.get('radius');
                    canvasElement = this.paper
                        .circle(x, y, radius)
                        .attr('stroke', object.getColor());
                    break;
            }

            object.set('canvasElement', canvasElement);

            this.objects.push(canvasElement);
            this.render();
        },

        /**
         * @object type AamapObject
         */
        removeObject: function (object) {
            object.get('canvasElement').remove();
            this.render();

            return this;
        },

        updateCanvasSize: function() {
            this.paper.setSize(this.$el.width(), this.$el.height());

            this.createCursorPointer();

            return this;
        },

        createGrid: function () {
            if (! this.paper) return;

            var pathBuilder = new geometry.PathBuilder;

            for (var x = -this.gridSize; x <= this.gridSize; x += this.gridStep) {
                pathBuilder
                    .moveTo(x, -this.gridSize)
                    .lineTo(x, this.gridSize);
            }

            //for (var y = - this.gridSize; y <= 0; y += this.gridStep) {
            for (var y = -this.gridSize; y <= this.gridSize; y += this.gridStep) {
                pathBuilder
                    .moveTo(-this.gridSize, y)
                    .lineTo(this.gridSize, y);
            }

            if (this.grid) {
                this.grid.remove();
            }

            // render grid
            this.grid = this.paper
                .path(pathBuilder.getString())
                .attr('stroke', '#222');

            this.objects.push(this.grid);
        },

        createCursorPointer: function () {
            if (this.cursorPointer) {
                this.cursorPointer.x.remove();
                this.cursorPointer.y.remove();
            }

            this.cursorPointer = {};

            var paper = this.paper,
                color = '#fff';

            function pointerPath (pathBuilder) {
                return paper
                    .path(pathBuilder.getString())
                    .attr('stroke', color);
            }

            // vertical line
            var pathBuilder = new geometry.PathBuilder()
                .moveTo(0, this.cursorSize)
                .lineTo(0, -this.cursorSize);

            this.cursorPointer.x = pointerPath(pathBuilder);

            // horizontal line
            pathBuilder = new geometry.PathBuilder()
                .moveTo(-this.cursorSize, 0)
                .lineTo(this.cursorSize, 0);

            this.cursorPointer.y = pointerPath(pathBuilder);
        },

        /**
         * @times type Number: zoom multiplier
         * @targetMouse type bool: target mouse after zoom
         */
        zoomIn: function (times, targetMouse) {
            times = times || 1;

            var nextZoom = Math.min(this.zoomMaxLimit, this.zoom * this.zoomStep * times);
            if (nextZoom == this.zoom) return;

            this.setZoom(nextZoom, targetMouse);
        },

        /**
         * @times type Number: zoom multiplier
         * @targetMouse type bool: target mouse after zoom
         */
        zoomOut: function (times, targetMouse) {
            times = times || 1;

            var nextZoom = Math.max(this.zoomMinLimit, this.zoom / this.zoomStep / times);
            if (nextZoom == this.zoom) return;

            this.setZoom(nextZoom, targetMouse);
        },

        render: function () {
            var transformString = [
                'S',
                this.zoom,
                - this.zoom, // inverse y
                0, 0,
                'T',
                this.anchor.x * this.zoom,
                - this.anchor.y * this.zoom
            ].join(' ');

            //console.log('render', transformString);
            this.objects.transform(transformString);
        },

        /**
         * adjust this.anchor so that the target point stays still after zooming
         * @zoomTo type Number
         * @targetMouse type bool: true when using mousewheel, false otherwise
         */
        adjustPan: function(zoomTo, targetMouse) {
            var targetX, targetY, // target point in screen coordinates
                realTarget; // screen target translated into real map coordinates

            if (targetMouse) {
                // target point is current mouse pos
                targetX = this.mousePos.x;
                targetY = this.mousePos.y;
                realTarget = this.realPos;
            } else {
                // target point is screen center
                targetX = this.paper.width / 2;
                targetY = this.paper.height / 2;
                realTarget = this.screenToMap(targetX, targetY);
            }

            var panX = (targetX - realTarget.x * zoomTo) / zoomTo;
            var panY = (- targetY - realTarget.y * zoomTo) / zoomTo;
            this.setAnchor(panX, panY);
        },

        setZoom: function (zoomTo, targetMouse) {
            // call adjustPan before setting new zoom
            // because it depends on this.zoom original value
            this.adjustPan(zoomTo, targetMouse);

            this.zoom = zoomTo;
            this.render();

            Mediator.publish('canvas:zoom-changed', this.zoom);

            // enable/disable zoom-in button
            if (this.zoom >= this.zoomMaxLimit) {
                Mediator.publish('button:zoom-in-enable', false);
            } else {
                Mediator.publish('button:zoom-in-enable', true);
            }

            this.updateCursorPos(this.mousePos.x, this.mousePos.y);

            // enable/disable zoom-out button
            if (this.zoom <= this.zoomMinLimit) {
                Mediator.publish('button:zoom-out-enable', false);
            } else {
                Mediator.publish('button:zoom-out-enable', true);
            }
        },

        setAnchor: function (x, y) {
            this.anchor.x = x;
            this.anchor.y = y;
            this.render();
            //console.log('pan', this.anchor.toString());
            Mediator.publish('canvas:anchor-changed', this.anchor);
        },

        getCurrentCenter: function () {
            var x = this.paper.width / 2 + this.anchor.x;
            var y = this.paper.height / 2 + this.anchor.y;
            return new geometry.Point(x, y);
        },

        /**
         * @point type PoinT: map coordinates
         * @returns type Point: SVG coordinates
         */
        mapToScreen: function (mapX, mapY) {
            var x = (this.anchor.x + mapX) * this.zoom;
            var y = - (this.anchor.y + mapY) * this.zoom;
            return new geometry.Point(x, y);
        },

        /**
         * @point type Point: SVG coordinates
         * @returns type Point: map coordinates
         */
        screenToMap: function (screenX, screenY, discardPan) {
            var point = new geometry.Point(
                screenX / this.zoom,
                - screenY / this.zoom
            );
            if (discardPan) {
                return point;
            }
            return point.subtract(this.anchor);
        }
    });

    return Canvas;
});
