class GameState {
    constructor() {
        this.gates = [];
        this.wires = [];

        gates.forEach(gate => {
            this.gates.push(gate.copy());
        });

        wires.forEach(wire => {
            let startCopy = this.gates[gates.indexOf(wire.start)];
            let endCopy = this.gates[gates.indexOf(wire.end)];
            let wireCopy = new Wire();

            wireCopy.setStart(startCopy);
            wireCopy.setEnd(endCopy, wire.endIndex);

            startCopy.attachOutput(wireCopy);
            endCopy.attachInput(wireCopy, wire.endIndex);

            wire.stops.forEach(stop => wireCopy.stops.push(stop.copy()));

            this.wires.push(wireCopy);
        });
    }

    restore() {
        gates = [];
        wires = [];

        this.gates.forEach(gate => {
            gates.push(gate.copy());
        });

        this.wires.forEach(wire => {
            let startCopy = gates[this.gates.indexOf(wire.start)];
            let endCopy = gates[this.gates.indexOf(wire.end)];
            let wireCopy = new Wire();

            wireCopy.setStart(startCopy);
            wireCopy.setEnd(endCopy, wire.endIndex);

            startCopy.attachOutput(wireCopy);
            endCopy.attachInput(wireCopy, wire.endIndex);

            wire.stops.forEach(stop => wireCopy.stops.push(stop.copy()));

            wires.push(wireCopy);
        });
    }

    isCurrent() {
        let isCurrent = true;

        this.gates.forEach((gate, i) => {
            if (!gate.pos.equals(gates[i].pos) ||
                gate.value !== gates[i].value ||
                gate.label !== gates[i].value)
                isCurrent = false;
        });

        this.wires.forEach((wire, i) => {
            let stopsEqual = true;

            wire.stops.forEach((stop, j) => {
                if (!stop.equals(wires[i].stops[j]))
                    stopsEqual = false;
            });

            if (!stopsEqual)
                isCurrent = false;
        });

        return isCurrent;
    }
}

GameState.states = [];
GameState.statePointer = -1;

GameState.save = () => {
    GameState.states.length = GameState.statePointer + 1;
    GameState.states.push(new GameState());

    GameState.statePointer++;
    console.log(GameState.statePointer);
}

GameState.undo = () => {
    if (GameState.statePointer > 0)
        GameState.restore(--GameState.statePointer);
}

GameState.redo = () => {
    if (GameState.statePointer < GameState.states.length - 1)
        GameState.restore(++GameState.statePointer);
}

GameState.restore = index => {
    console.log(index);
    if (index > -1 && index < GameState.states.length)
        GameState.states[index].restore();
}