class AndGate extends Gate {
    
    //num inputs for AND gate defaults to 2
    constructor(pos, numInputs) {
        super(pos, numInputs || 2);
    }

    drawShape() {
        let ctx = layers[Layer.GAME];

        let leftTop = calcScreenCoords(this.pos.subtract(new Vector(this.width / 2, this.height / 2)));
        let rightTop = leftTop.add(new Vector((this.width * camera.zoom / 2), 0));
        // let rightBottom = leftTop.add(new Vector((this.width / 2) * camera.zoom, this.height * camera.zoom));
        let leftBottom = leftTop.add(new Vector(0, this.height * camera.zoom));

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = Gate.displayLineWeight * camera.zoom;

        ctx.beginPath();
        ctx.moveTo(leftTop.x, leftTop.y);
        ctx.lineTo(rightTop.x, rightTop.y);
        //ctx.bezierCurveTo(rightTop.x + Gate.gridSize * 3 * camera.zoom, rightTop.y + Gate.gridSize * camera.zoom, rightTop.x + Gate.gridSize * 3 * camera.zoom, rightBottom.y - Gate.gridSize * camera.zoom, rightBottom.x, rightBottom.y);
        ctx.ellipse(rightTop.x, rightTop.y + this.height * camera.zoom / 2, this.width * camera.zoom / 2, this.height * camera.zoom / 2, 0, -PI / 2, PI / 2, false);
        ctx.lineTo(leftBottom.x, leftBottom.y);
        ctx.lineTo(leftTop.x, leftTop.y);
        ctx.fill();
        ctx.stroke();
    }

    getOutputValue() {
        let output = true;

        for (let i = 0; i < this.numInputs; i++) {
            if (!this.inputs[i] || !this.inputs[i].value)
                output = false;
        }

        return output;
    }
}