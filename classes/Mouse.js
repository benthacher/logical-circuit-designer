class Mouse {
    constructor() {
        this.pos = zeroVector.copy();
        this.drag = zeroVector.copy();
        this.draggingObjPos = zeroVector.copy();
        this.draggingObj;
        this.canDrag = true;
        this.down = false;
        this.which = 0;
    }

    getMapPos() {
        return new Vector(
            ((this.pos.x - (layerWidth/2)) / camera.zoom) + camera.pos.x,
            ((this.pos.y - (layerHeight/2)) / camera.zoom) + camera.pos.y
        );
    }

    isTouching(gate) {
        let pos = this.getMapPos();

        return (gate.pos.x - gate.width  / 2 < pos.x &&
                gate.pos.x + gate.width  / 2 > pos.x &&
                gate.pos.y - gate.height / 2 < pos.y &&
                gate.pos.y + gate.height / 2 > pos.y);
    }
}