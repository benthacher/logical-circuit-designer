let mouse = new Mouse();

const gateTypes = [AndGate, NandGate, OrGate, NorGate, XorGate, XnorGate, Inverter];

// Pretty gross looking enum below:
// Takes array of Tool names and uses Array.prototype.reduce to create an object in the form:
//      {
//          [Toolname]: [key to press],
//           ...
//      }
// The only reason I did this was to make it easier to rearrange the tools if I wanted to

const Tool = Object.freeze(
    ['Pointer', 'Move', 'Add', 'Net', 'Edit', 'Pan']
    .reduce((obj, val, i) => Object.assign(obj, { [val]: i + 1 }), {}));

let currentTool = Tool.Pointer;

let addComponentMenu = new Toolbar()
                        .setPadding(3)
                        .setBackground('#eee')
                        .setClickColor('#ccc')
                        .setHoverColor('#dedede')
                        .setPos(zeroVector.copy())
                        .add(
                            new ToolbarItem('Input.png', 50, 50, () => {
                                mouse.down = false;
                                let label = prompt('Label for input:');
                                if (!label)
                                    return;
                                let value = prompt('Value for input:');

                                if (value)
                                    new Input(mouse.getMapPos(), label, value == 'true').push();
                            }, true)
                        )
                        .add(
                            (() => {
                                let items = [];

                                gateTypes.forEach(type => {
                                    items.push(new ToolbarItem(new type().constructor.name + '.png', 50, 50, () => {
                                        new type(mouse.getMapPos()).push();
                                        currentTool = Tool.Move;
                                    }, true))
                                });

                                return items;
                            })()
                        )
                        .hide()
                        .push();

let editComponentMenu = new Toolbar()
                        .setPadding(3)
                        .setBackground('#eee')
                        .setClickColor('#ccc')
                        .setHoverColor('#dedede')
                        .setPos(zeroVector.copy())
                        .add([
                            new ToolbarItem('numInputs.png', 50, 50, () => {
                                mouse.down = false;
                                editingComponent.setNumInputs(prompt('Num inputs:') || 1);
                            }, true),
                            new ToolbarItem('toggleOutput.png', 50, 50, () => {
                                if (editingComponent.setValue)
                                    editingComponent.setValue(!editingComponent.value)
                            }, true)
                        ])
                        .hide()
                        .push();
let editingComponent;

let toolToolbar = new Toolbar()
                        .setPadding(3)
                        .setBackground('#eee')
                        .setClickColor('#ccc')
                        .setHoverColor('#dedede')
                        .setPos(zeroVector.copy())
                        .add(
                            (() => {
                                let items = [];

                                for (let tool of Object.keys(Tool)) {
                                    items.push(new ToolbarItem(tool + '.png', 40, 40, () => currentTool = Tool[tool], false));
                                }

                                return items;
                            })()
                        )
                        .show()
                        .push();

function hideContextMenus() {
    toolbars.forEach(toolbar => {
        if (toolbar.items[0].hideOnClick)
            toolbar.hide()
    });
}

/**
 * 
 * @param {Vector} pos 
 * @param {boolean} invert
 */
function drag(pos, invert) {
    if (mouse.canDrag) {
        mouse.draggingObjPos = pos.copy();
        mouse.canDrag = false;
    }
    pos.set(
        mouse.draggingObjPos
            .subtract(mouse.drag
                .subtract(mouse.pos)
                .divide(camera.zoom)
                .scale(invert ? -1 : 1)));
}

let keys = {};
let callbackHandler = new CallbackHandler();

function events() {
    callbackHandler.handleCallbacks();
}

function resize() {
    layerWidth  = window.innerWidth;
    layerHeight = window.innerHeight;

    canvases.forEach(canvas => {
        canvas.width = layerWidth;
        canvas.height = layerHeight
    });
}

window.onresize = resize;

window.onmousemove = e => {
    mouse.pos.x = e.x;
    mouse.pos.y = e.y;
};

window.onmousewheel = e => {
    camera.zoom += (e.wheelDelta) / 1000;
};

window.oncontextmenu = e => e.preventDefault();

window.onmousedown = e => {
    mouse.down = true;
    mouse.which = e.which;
    mouse.drag = mouse.pos.copy();

    switch (currentTool) {
        case Tool.Add:
            addComponentMenu.setPos(mouse.pos.copy()).show();
            editComponentMenu.hide();
            editingComponent = null;
            currentTool = Tool.Pointer;
            break;
        case Tool.Edit:
            let touchingGate = false;
            gates.forEach(gate => {
                if (mouse.isTouching(gate)) {
                    editingComponent = gate;
                    touchingGate = true;
                }
            });

            if (touchingGate) {
                editComponentMenu.setPos(mouse.pos.copy()).show();
                addComponentMenu.hide();
            }
            break;
        case Tool.Move:
            if (mouse.which == 1) {
                gates.forEach(gate => {
                    if (mouse.isTouching(gate) && mouse.canDrag) {
                        mouse.draggingObj = gate;
                    }
        
                    if (gate == mouse.draggingObj) {
                        if (mouse.isTouching(gate) && mouse.canDrag) {
                            mouse.canDrag = false;
                            mouse.draggingObjPos = gate.pos.copy();
                            mouse.drag = mouse.pos.copy();
                        }
                    }
                });
                
                if (Wire.displayStops) {
                    wires.forEach(wire => {
                        wire.stops.forEach(stop => {
                            if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius && mouse.canDrag) {
                                mouse.draggingObj = stop;
                            }
            
                            if (stop == mouse.draggingObj) {
                                if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius && mouse.canDrag) {
                                    mouse.canDrag = false;
                                    mouse.draggingObjPos = stop.copy();
                                    mouse.drag = mouse.pos.copy();
                                }
                            }
                        });
                    });
                }
            } else if (mouse.which == 3) {
                gates.forEach(gate => {
                    if (mouse.isTouching(gate))
                        gate.remove();
                    
                    for (let i = 0; i < gate.numInputs; i++) {
                        if (gate.inputs[i] && dist(gate.getInputDisplayPos(i), mouse.getMapPos()) < Gate.ioDisplayRadius) {
                            gate.inputs[i].release();
                            return;
                        }
                    }
                });
                if (Wire.displayStops) {
                    wires.forEach(wire => {
                        wire.stops.forEach((stop, i) => {
                            if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius)
                                wire.stops.splice(i, 1);
                        });
                    });
                }
                break;
            }
            break;
        case Tool.Net:
            switch (mouse.which) {
                case 1:
                    gates.forEach(gate => {
                        for (let i = 0; i < gate.numInputs; i++) {
                            if (dist(gate.getInputDisplayPos(i), mouse.getMapPos()) < Gate.ioDisplayRadius) {
                                mouse.connectionStart = { gate, i };
                                return;
                            }
                        }
                        if (dist(gate.getOutputDisplayPos(), mouse.getMapPos()) < Gate.ioDisplayRadius) {
                            mouse.connectionStart = { gate, i: -1 };
                            return;
                        }
                    });
                    break;
                case 3:
                    wires.forEach(wire => {
                        let displayStart = wire.start.getOutputDisplayPos();
                        let displayEnd = wire.end.getInputDisplayPos(wire.endIndex);
                
                        let totalStops = [displayStart, ...wire.stops, displayEnd];
        
                        for (let i = 0; i < totalStops.length - 1; i++) {
                            let initial = totalStops[i];
                            let final = totalStops[i + 1];
        
                            if (isIntersecting(initial, final, mouse.getMapPos(), Gate.ioDisplayRadius)) {
                                wire.stops.splice(i, 0, mouse.getMapPos());
                                currentTool = Tool.Move;
                            }
                        }
                    });
                    break;
            }
            
    }

    if (e.which == 1) {
        // gates.forEach(gate => {
        //     if (mouse.isTouching(gate) && mouse.canDrag) {
        //         mouse.draggingObj = gate;
        //     }

        //     if (gate == mouse.draggingObj) {
        //         if (mouse.isTouching(gate) && mouse.canDrag) {
        //             mouse.canDrag = false;
        //             mouse.draggingObjPos = gate.pos.copy();
        //             mouse.drag = mouse.pos.copy();
        //         }
        //     }
        // });

        if (Wire.displayStops) {
        //     wires.forEach(wire => {
        //         wire.stops.forEach(stop => {
        //             if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius && mouse.canDrag) {
        //                 mouse.draggingObj = stop;
        //             }
    
        //             if (stop == mouse.draggingObj) {
        //                 if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius && mouse.canDrag) {
        //                     mouse.canDrag = false;
        //                     mouse.draggingObjPos = stop.copy();
        //                     mouse.drag = mouse.pos.copy();
        //                 }
        //             }
        //         });
        //     });

            // gates.forEach(gate => {
            //     for (let i = 0; i < gate.numInputs; i++) {
            //         if (dist(gate.getInputDisplayPos(i), mouse.getMapPos()) < Gate.ioDisplayRadius) {
            //             mouse.connectionStart = { gate, i };
            //             return;
            //         }
            //     }
            //     if (dist(gate.getOutputDisplayPos(), mouse.getMapPos()) < Gate.ioDisplayRadius) {
            //         mouse.connectionStart = { gate, i: -1 };
            //         return;
            //     }
            // });
        }

        let hoveredToolbar = false;
        toolbars.forEach(toolbar => {
            toolbar.items.forEach(item => {
                if (item.isBeingHovered())
                    hoveredToolbar = true;
            });
        });

        // if (!hoveredToolbar)
        //     hideContextMenus();
    }

    if (e.which == 2)
        hideContextMenus();
}

window.onmouseup = e => {
    mouse.down = false;
    mouse.which = 0;
    mouse.canDrag = true;
    mouse.draggingObjPos = null;
    mouse.draggingObj = null;
    if (e.which == 1) {
        gates.forEach(gate => {
            for (let i = 0; i < gate.numInputs; i++) {
                if (dist(gate.getInputDisplayPos(i), mouse.getMapPos()) < Gate.ioDisplayRadius) {
                    mouse.connectionEnd = { gate, i };
                }
            }
            if (dist(gate.getOutputDisplayPos(), mouse.getMapPos()) < Gate.ioDisplayRadius) {
                mouse.connectionEnd = { gate, i: -1 };
            }
        });

        if (mouse.connectionStart && mouse.connectionEnd) {
            let connection = new Wire();

            console.log(mouse.connectionEnd.i);

            if (mouse.connectionStart.i == mouse.connectionEnd.i || mouse.connectionStart.gate == mouse.connectionEnd.gate)
                return;

            if (mouse.connectionStart.i > -1) {
                mouse.connectionStart.gate.attachInput(connection, mouse.connectionStart.i);
                mouse.connectionEnd.gate.attachOutput(connection);
            } else {
                mouse.connectionStart.gate.attachOutput(connection);
                mouse.connectionEnd.gate.attachInput(connection, mouse.connectionEnd.i);
            }
            
            wires.push(connection);
        }
    }

    mouse.connectionStart = null;
    mouse.connectionEnd = null;

    GameState.save();
}

window.onkeydown = e => {
    // console.log(e.key);
    if (!keys[e.key])
        keys[e.key] = {};
    keys[e.key].pressed = true;
    keys[e.key].released = false;
    keys[e.key].canBeReleased = true;
};

window.onkeyup = e => {
    if (!keys[e.key])
        keys[e.key] = {};
    keys[e.key].pressed = false;
    keys[e.key].released = true;
    keys[e.key].canBePressed = true;
};

function isOffscreen(pos, bounds) {
    return (pos.x < -bounds.x || 
            pos.y < -bounds.y || 
            pos.x > layerWidth + bounds.x || 
            pos.y > layerHeight + bounds.y);
}