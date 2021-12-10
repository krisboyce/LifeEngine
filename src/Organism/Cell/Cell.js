import { CellState } from "./CellState";


export default class Cell {
    static state = new CellState(
        'cell',
        'black',
        'The base cell, you should define something more specific.',
        []
    );

    constructor() {
    }

    getType(){
        return this.constructor;
    }

    performFunction(env) {
        // default behavior: none
    }

    static inheritTags() {
        return this.state.tags = [...this.state.tags, ...super.state.tags];
    }

    static render(ctx, cell, size) {
        ctx.fillStyle = this.state.color;
        ctx.fillRect(cell.x, cell.y, size, size);
    }
}