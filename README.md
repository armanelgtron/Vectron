# Vectron 1.1

A map editor for Armagetron Advanced.

Originally created by Carlo Veneziano and re-written by Tristan Whitcher.


### Features legend:

- *keyb shortcuts are written between [brackets]*
- *'mod' means 'ctrl' (pc) or 'command' (mac)*

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
