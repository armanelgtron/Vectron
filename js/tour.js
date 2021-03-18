var tour;

tour = new Shepherd.Tour({
    defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: true,
        /*cancelLinkText: "cancel"*/
    }
});

tour.addStep('welcome-step', {
    title: "Vectron",
    text: 'Welcome to Vectron. Vectron is a map editor for Armagetron Advanced. This tutorial explains all of the editors tools.',
    attachTo: '#canvas_container middle',
    classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
    buttons: [{
        text: 'Show Me Around',
        action: tour.next
    }],

    when: {
        show: function() {
            $('#canvas_container').addClass('blur');
        },
    }

});


tour.addStep('gui-step', {
    title: "The GUI",
    text: 'This button toggles the Vectron GUI. Press this to access information about the current map. This also lets you save your progress or load maps into the editor!',
    attachTo: '.toolbar-gui-open right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-gui-open').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-gui-open').removeClass('highlight');
        }
    }

});

tour.addStep('select-step', {
    title: "Select Tool",
    text: 'The select tool allows you to select multiple elements by dragging a selection area. You can delete the selection using the delete key.',
    attachTo: '.toolbar-toolSelect right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolSelect').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolSelect').removeClass('highlight');
        }
    }

});

tour.addStep('wall-step', {
    title: "Wall Tool",
    text: 'The wall tool allows you to place walls on the map. Click once to start a wall and to add a new point. Double click to end the wall.',
    attachTo: '.toolbar-toolWall right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolWall').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolWall').removeClass('highlight');
        }
    }

});

tour.addStep('zone-step', {
    title: "Zone Tool",
    text: 'The zone tool creates zones on the map. You can select the type of zone when you first activate the zone tool. To place a zone, simply click once. You can resize the zone using the +/- keys on your keyboard. Holding shift will force the zone to resize to the nearest grid unit.',
    attachTo: '.toolbar-toolZone right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolZone').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolZone').removeClass('highlight');
        }
    }

});

tour.addStep('spawn-step', {
    title: "Spawn Tool",
    text: 'The spawn tool creates spawn points on the map. Once activated, click once to select the location of the spawn, then move your mouse to the angle you want the spawn to be facing, and click again to set the angle.',
    attachTo: '.toolbar-toolSpawn right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolSpawn').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolSpawn').removeClass('highlight');
        }
    }

});

tour.addStep('lock-step', {
    title: "Snap-to-Grid",
    text: 'The lock is the snap-to-grid functionality. With the lock enabled, walls and zones will only be placed perfectly on the defined grid lines. To get more gridlines try scaling the map with the scale tools below.',
    attachTo: '.toolbar-toolLock right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolLock').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolLock').removeClass('highlight');
        }
    }

});

tour.addStep('zoom-step', {
    title: "Zoom In / Zoom Out",
    text: 'The zoom buttons allow the canvas to be displayed larger or smaller. This does not actually scale the map to a new grid size.',
    attachTo: '.toolbar-toolZoomIn right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolZoomIn').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolZoomIn').removeClass('highlight');
        }
    }

});

tour.addStep('scale-step', {
    title: "Scale Up / Scale Down",
    text: 'The scale buttons allow you to actually rescale the map to change the unit size. This is useful if you need more grid space somewhere you did not originally plan for.',
    attachTo: '.toolbar-toolScaleUp right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Next',
        action: tour.next
    }],

    when: {
        show: function() {
            $('.toolbar-toolScaleUp').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-toolScaleUp').removeClass('highlight');
        }
    }

});

tour.addStep('cancel-step', {
    title: "Cancel action / Delete last",
    text: 'The cancel button will cancel the current action. It will also attempt to remove the last added object to the map.',
    attachTo: '.toolbar-disconnect right',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tour.back
    }, {
        text: 'Get Started!',
        action: tour.complete
    }],

    when: {
        show: function() {
            $('.toolbar-disconnect').addClass('highlight');
        },
        hide: function() {
            $('.toolbar-disconnect').removeClass('highlight');
        }
    }

});

tour.on('complete', function() {
    $('#canvas_container').removeClass('blur');
})

tour.on('cancel', function() {
    $('#canvas_container').removeClass('blur');
})

tour.start();
