class GameState {
    constructor() {
        this.gates = [];
        this.wires = [];
    }

    save() {
        let gate = gates[0];
        let copy = new gate.constructor(gate.pos.copy(), gate.numInputs);

        if (gate instanceof Input)
            copy.value = gate.value;

        gate.inputs.forEach((input, i) => {
            if (input)
                copy.inputs[i] = input.copy();
        });
        
        gate.outputs.forEach((output, i) => {
            copy.outputs[i] = output.copy();
        });
    }
}