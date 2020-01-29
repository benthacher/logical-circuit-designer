let wires = [];

class Wire {
    constructor() {
        // array of position vectors where a break in the wire is made
        this.stops = [];

        this.value;
    }

    setStart(start) {
        this.start = start;
        return this;
    }

    setEnd(end, index) {
        this.end = end;
        this.endIndex = index;
        return this;
    }

    release() {
        try {
            this.start.outputs.splice(this.start.outputs.indexOf(this), 1);
            this.setStart(null);

            this.end.inputs[this.endIndex] = null;
            this.setEnd(null, null);

            wires.splice(wires.indexOf(this), 1);
            
        } catch (e) {
            console.log(e);
        }
    }

    updateStops() {
        let displayStart = this.start.getOutputDisplayPos();
        let temp = displayStart.copy();
        let displayEnd = this.end.getInputDisplayPos(this.endIndex);

        let totalStops = [displayStart, ...this.stops, displayEnd];

        if (this.stops.length == 0 && getAngle(displayEnd, displayStart) % (PI / 2) !== 0)
            this.stops.push(new Vector(displayStart.x + ((displayEnd.x - displayStart.x) / 2), displayStart.y),
                            new Vector(displayStart.x + ((displayEnd.x - displayStart.x) / 2), displayEnd.y));

        // use IK to fix stops
        for (let i = totalStops.length - 1; i >= 1; i--) {
            let initial = totalStops[i];
            let final = totalStops[i - 1];

            //set final based on initial
            fixStops(final, initial);
        }

        displayStart.x = temp.x;
        displayStart.y = temp.y;

        for (let i = 0; i < totalStops.length - 1; i++) {
            let initial = totalStops[i];
            let final = totalStops[i + 1];
            
            //set final based on initial
            fixStops(final, initial);
        }
    }

    draw() {
        this.color = Wire.showColors ? (this.value ? Wire.trueColor : Wire.falseColor) : Wire.noColor;
        let ctx = layers[Layer.GAME];

        let drawStart = calcScreenCoords(this.start.getOutputDisplayPos());
        let drawEnd = calcScreenCoords(this.end.getInputDisplayPos(this.endIndex));

        ctx.beginPath();
        ctx.moveTo(drawStart.x, drawStart.y);

        this.stops.forEach(stop => {
            let screenCoords = calcScreenCoords(stop);
            ctx.lineTo(screenCoords.x, screenCoords.y);
        });

        ctx.lineTo(drawEnd.x, drawEnd.y);
        
        ctx.lineWidth = Wire.wireThickness * camera.zoom;
        ctx.strokeStyle = this.color;

        ctx.stroke();

        if (Wire.displayStops) {
            this.stops.forEach(stop => {
                circle(stop.x, stop.y, Gate.ioDisplayRadius, 'white', true, Layer.GAME);
                strokeCircle(stop.x, stop.y, Gate.ioDisplayRadius, 'black', Gate.displayLineWeight, true, Layer.GAME);
            });
        }
    }

    setValue(value) {
        this.value = value;
    }
}

Wire.trueColor = '#0f0';
Wire.falseColor = '#f00';
Wire.noColor = 'black';
Wire.displayStops = false;
Wire.showColors = false;
Wire.wireThickness = 4;

Wire.toggleWireColors = () => Wire.showColors = !Wire.showColors; 

function fixStops(final, initial) {
    let angle = getAngle(final, initial);

    if ((angle > -PI / 4 && angle < PI / 4) ||
        (angle < -(3 * PI) / 4 || angle > (3 * PI) / 4)) {
        final.y = initial.y;

    } else if ((angle > -(3 * PI) / 4 && angle < -PI / 4) ||
               (angle <  (3 * PI) / 4 && angle >  PI / 4)) {
        final.x = initial.x;

    }    
    final.x = Math.floor(final.x / Gate.gridSize) * Gate.gridSize;
    final.y = Math.floor(final.y / Gate.gridSize) * Gate.gridSize;
    
    initial.x = Math.floor(initial.x / Gate.gridSize) * Gate.gridSize;
    initial.y = Math.floor(initial.y / Gate.gridSize) * Gate.gridSize;
}