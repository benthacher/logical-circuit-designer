class GameState {
    constructor() {
        this.gates = [];
        this.wires = [];
    }

    save() {
        gates.forEach(gate => {
            this.gates.push(gate.copy());
        });
    }
}