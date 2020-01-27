class Input extends Gate {
    constructor(pos, label, value) {
        super(pos, 0);

        this.width = this.height;

        this.value = value;
        this.label = label;
    }

    drawShape() {
        rect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height, 'white', true, Layer.GAME);
        strokeRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height, 'black', Gate.displayLineWeight, true, Layer.GAME);
        
        text(this.label, 'Verdana', 20, 'black', this.pos.x, this.pos.y, true, Layer.GAME);
    }

    setValue(value) {
        this.value = value;
    }
    
    getOutputValue() {
        return this.value;
    }

    setNumInputs(n) {
        console.log(`Can't set number of inputs on input:`, this);
        return;
    }
}