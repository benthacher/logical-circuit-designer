const FPS = 60;

let gateA;
let gateB;
let inputA;

let drawGrid = true;

let canAddAndGate = true;

function init() {
    setBackground('white');

    gateA = new AndGate(new Vector(100, 100), 2).push();
    gateB = new OrGate(new Vector(500, 100), 2).push();

    gateA.connect(gateB);

    inputA = new Input(new Vector(100, 500), 'A', true).push();
    
    callbackHandler.attach('Shift', CallbackMode.PRESS,   () => Wire.displayStops = true );
    callbackHandler.attach('Shift', CallbackMode.RELEASE, () => Wire.displayStops = false);

    callbackHandler.attach('g', CallbackMode.PRESS, () => drawGrid = !drawGrid);
    callbackHandler.attach('c', CallbackMode.PRESS, () => Wire.showColors = !Wire.showColors);

    callbackHandler.attach('Escape', CallbackMode.PRESS, () => toolbars.forEach(toolbar => toolbar.hide()));
}

function draw() {
    // camera.update(map.width, map.height);
    
    clear(Layer.GAME);
    clear(Layer.UI);
    // draw gridlines
    if (drawGrid) {
        for (let r = 0; r < map.height; r += Gate.gridSize) {
            lineTo(0, r, map.width, r, '#ccc', 1, true, Layer.GAME);
        }
        for (let c = 0; c < map.width; c += Gate.gridSize) {
            lineTo(c, 0, c, map.height, '#ccc', 1, true, Layer.GAME);
        }
    }

    wires.forEach(wire => wire.draw());
    gates.forEach(gate => gate.draw());

    toolbars.forEach(toolbar => toolbar.draw());
}

function logic() {
    if (mouse.draggingObj)
        canvases[Layer.UI].style.cursor = 'grabbing';
    if (mouse.down) {
        switch (mouse.which) {
            case 2:
                let cameraPrevPos = camera.pos.copy();
                drag(camera.pos, true);
                
                if (cameraPrevPos.x !== camera.pos.x || cameraPrevPos.y !== camera.pos.y)
                    canvases[Layer.UI].style.cursor = 'move';

                if (Wire.displayStops) {
                    wires.forEach(wire => {
                        wire.stops.forEach((stop, i) => {
                            if (dist(stop, mouse.getMapPos()) < Gate.ioDisplayRadius)
                                wire.stops.splice(i, 1);
                        });
                    });
                }
                break;
            case 1:
                gates.forEach(gate => {
                    if (gate == mouse.draggingObj) {
                        if (mouse.draggingObjPos)
                            gate.pos.set(
                                mouse.draggingObjPos
                                    .subtract(mouse.drag
                                        .subtract(mouse.pos)
                                        .divide(camera.zoom)));
                    }
                });
                if (Wire.displayStops) {
                    wires.forEach(wire => {
                        wire.stops.forEach(stop => {
                            if (stop == mouse.draggingObj) {
                                if (mouse.draggingObjPos)
                                    stop.set(
                                        mouse.draggingObjPos
                                            .subtract(mouse.drag
                                                .subtract(mouse.pos)
                                                .divide(camera.zoom)));
                            }
                        });
                    });
                }
                if (mouse.connectionStart) {
                    let pos;
                    if (mouse.connectionStart.i > -1)
                        pos = mouse.connectionStart.gate.getInputDisplayPos(mouse.connectionStart.i);
                    else
                        pos = mouse.connectionStart.gate.getOutputDisplayPos();

                    lineTo(pos.x, pos.y, mouse.getMapPos().x, mouse.getMapPos().y, 'black', Gate.wireThickness, true, Layer.GAME);
                    canvases[Layer.UI].style.cursor = 'crosshair';
                }
                break;
            case 3:
                
                break;
        }
    } else
        canvases[Layer.UI].style.cursor = 'auto';

    wires.forEach(wire => {
        if (!Wire.displayStops) 
            wire.updateStops();
    });

    if (!Wire.displayStops) {
        gates.forEach(gate => {
            gate.pos.x = Math.floor(gate.pos.x / Gate.gridSize) * Gate.gridSize;
            gate.pos.y = Math.floor(gate.pos.y / Gate.gridSize) * Gate.gridSize;
        });
    }

    if (editComponentMenu.display)
        canvases[Layer.UI].style.cursor = 'help';
    
    if (addComponentMenu.display)
        canvases[Layer.UI].style.cursor = 'copy';


    Gate.updateValues();

    toolbars.forEach(toolbar => toolbar.pollClickEvents());
}