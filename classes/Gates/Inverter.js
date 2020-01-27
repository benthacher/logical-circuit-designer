class Inverter extends Gate {
    
    //num inputs for AND gate defaults to 2
    constructor(pos, numInputs) {
        super(pos, numInputs || 1);
        this.width /= 2;
    }

    drawShape() {
        let ctx = layers[Layer.GAME];

        let leftTop = calcScreenCoords(this.pos.subtract(new Vector(this.width / 2, this.height / 2)));
        let rightTop = leftTop.add(new Vector(this.width * camera.zoom, 0));
        // let rightBottom = leftTop.add(new Vector(this.width * camera.zoom, this.height * camera.zoom));
        let leftBottom = leftTop.add(new Vector(0, this.height * camera.zoom));

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = Gate.displayLineWeight * camera.zoom;

        let tip = new Vector(rightTop.x, rightTop.y + this.height * camera.zoom / 2);

        ctx.beginPath();
        ctx.moveTo(leftTop.x, leftTop.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.lineTo(leftBottom.x, leftBottom.y);
        ctx.lineTo(leftTop.x, leftTop.y);
        ctx.fill();
        ctx.stroke();
        
        circle(tip.x + Gate.ioDisplayRadius * camera.zoom / 2, tip.y, Gate.ioDisplayRadius * camera.zoom / 2, 'white', false, Layer.GAME);
        strokeCircle(tip.x + Gate.ioDisplayRadius * camera.zoom / 2, tip.y, Gate.ioDisplayRadius * camera.zoom / 2, 'black', Gate.displayLineWeight * camera.zoom, false, Layer.GAME);
    }

    getOutputValue() {
        return !(this.input && this.inputs[0].value);
    }

    setNumInputs(n) {
        super.setNumInputs(1);
    }
}