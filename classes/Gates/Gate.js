let gates = [];

class Gate {
    constructor(pos, numInputs) {
        this.pos = pos;

        this.numInputs = numInputs;
        this.inputs = new Array(numInputs);
        this.connectedInputs = 0;
        this.outputs = [];

        this.width = Gate.width;
        this.height = Gate.height * (numInputs || 1);
    }

    /**
     * 
     * @param {Array} inputs 
     * @param {Number} index 
     */
    attachInput(input, index) {
        input.setEnd(this, index);
        this.inputs[index] = input;

        return this;
    }

    /**
     * 
     * @param {Wire} output 
     */
    attachOutput(output) {
        output.setStart(this);

        this.outputs.push(output);

        return this;
    }

    /**
     * 
     * @param {Number} numInputs 
     */
    setNumInputs(numInputs) {
        if (this.numInputs > numInputs)
            this.inputs.slice(numInputs, this.inputs.length).forEach(input => input.release());
        
        this.numInputs = numInputs;
        this.inputs.length = numInputs;
        
        this.height = Gate.height * numInputs;
        
        return this;
    }
    
    getInputDisplayPos(index) {
        let displayPos = new Vector(
            this.pos.x - this.width / 2 - Gate.gridSize,
            (this.pos.y - this.height / 2) + (this.height / this.numInputs) / 2 + index * (this.height / this.numInputs)
        );

        return displayPos;
    }

    getOutputDisplayPos() {
        let displayPos = new Vector(
            this.pos.x + this.width / 2 + Gate.gridSize,
            this.pos.y
        );

        return displayPos;
    }

    draw() {
        let ctx = layers[Layer.GAME];

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Gate.displayLineWeight;

        for (let i = 0; i < this.numInputs; i++) {
            let displayPos = this.getInputDisplayPos(i);
            let screenCoords = calcScreenCoords(displayPos);

            ctx.lineWidth = Gate.wireThickness * camera.zoom;
            ctx.strokeStyle = 'black';

            ctx.beginPath();
            ctx.moveTo(screenCoords.x, screenCoords.y);
            ctx.lineTo(screenCoords.x + Gate.gridSize * 1.5 * camera.zoom, screenCoords.y);
            
            ctx.stroke();

            if (Wire.displayStops) {
                circle(displayPos.x, displayPos.y, Gate.ioDisplayRadius, 'white', true, Layer.GAME);
                strokeCircle(displayPos.x, displayPos.y, Gate.ioDisplayRadius, 'black', Gate.displayLineWeight, true, Layer.GAME);
            }
        }

        let outputDisplayPos = this.getOutputDisplayPos();
        let screenCoords = calcScreenCoords(outputDisplayPos);

        ctx.lineWidth = Gate.wireThickness * camera.zoom;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.moveTo(screenCoords.x, screenCoords.y);
        ctx.lineTo(screenCoords.x - Gate.gridSize * camera.zoom, screenCoords.y);
        
        ctx.stroke();
        
        this.drawShape();

        if (Wire.displayStops) {
            circle(outputDisplayPos.x, outputDisplayPos.y, Gate.ioDisplayRadius, 'white', true, Layer.GAME);
            strokeCircle(outputDisplayPos.x, outputDisplayPos.y, Gate.ioDisplayRadius, 'black', Gate.displayLineWeight, true, Layer.GAME);
        }
    }
/**
 * 
 * @param {Gate} other 
 */
    connect(other) {
        let connection = new Wire('black', Gate.wireThickness);

        this.attachOutput(connection);
        other.attachInput(connection, this.connectedInputs);

        wires.push(connection);
    }

    push() {
        if (this)
            gates.push(this);
        return this;
    }

    remove() {
        try {
            this.inputs.forEach(input => {
                if (input)
                    input.release()
            });
            this.outputs.forEach(output => {
                if (output)
                    output.release()
            });

        } catch (e) {
            console.log(e);
        }
        gates.splice(gates.indexOf(this), 1);
    }

    copy(clazz) {
        let copy = new clazz(this.pos.copy(), this.numInputs);

        this.inputs.forEach((input, i) => {
            if (input)
                copy.inputs[i] = input.copy();
        });
        
        this.outputs.forEach((output, i) => {
            copy.outputs[i] = output.copy();
        });
    }
}

Gate.wireThickness = 4;
Gate.gridSize = 20;
Gate.width = Gate.gridSize * 4;
Gate.height = Gate.gridSize * 2;
Gate.displayLineWeight = 2;
Gate.ioDisplayRadius = 10;

Gate.updateValues = function() {
    wires.forEach(wire => wire.setValue(wire.start.getOutputValue()));
}