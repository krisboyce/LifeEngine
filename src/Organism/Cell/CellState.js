export class CellState {
    constructor(name, color, description, tags, parent) {
        this.name = name;
        this.color = color;
        this.description = description;
        this.tags = tags || [];
        console.log(parent);
        if (parent) this.tags = [...this.tags, ...parent.tags];
    }
}