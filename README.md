# Vectron 2.0.2

### Features legend:

- *keyb shortcuts are written between [brackets]*
- *'mod' means 'ctrl' (pc) or 'command' (mac)*

---

# Essential features
### DONE
- map pan [space]
- map zoom-in button [+] or mousewheel up
- map zoom-out button [-] or mousewheel down
- snap cursor to grid [x]

### TODO
- select/edit tool - [del] to remove
- span tool
- wall tool
- zone tool
- settings panel (use http://getbootstrap.com/javascript/#modals)
- xml import
- xml export
- display different grid as zoom changes
- ...

---

# Advanced features
### TODO
- select/edit wall-points tool
- snap cursor to objects
- wall drawing: draw points dragging the cursor, filter them by min-distance threshold
  and join them (could use http://jsfiddle.net/pxemt/2/)
- wall modifiers, ex. cut/divide at point, join walls, etc...
- set zoom 100% button [mod+1]
- fit map to screen button [mod+0]
- history undo/redo [mod+z]/[mod+shift+z]
- ...

---

### Notes:

- The y axis is inverted: in AA the y value is higher on top,
  while in browser the y value is higher on bottom.
- By now vectron starts displaying the map center on the top-left corner of the screen.
  To respect the maps standard, an empty map should start with the center point on the bottom-left corner.
- Keyb shortcuts may change during development.
