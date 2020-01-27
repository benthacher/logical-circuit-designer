class NorGate extends OrGate {
    constructor(pos, numInputs) {
        super(pos, numInputs);
    }

    drawShape() {
        super.drawShape();

        let tip = this.pos.add(new Vector(this.width / 2, 0));

        circle(tip.x + Gate.ioDisplayRadius / 2, tip.y, Gate.ioDisplayRadius / 2, 'white', true, Layer.GAME);
        strokeCircle(tip.x + Gate.ioDisplayRadius / 2, tip.y, Gate.ioDisplayRadius / 2, 'black', Gate.displayLineWeight, true, Layer.GAME);
    }

    getOutputValue() {
        return !super.getOutputValue();
    }
}