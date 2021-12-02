export class CellState {
    constructor(name, color, description, tags, render) {
        this.name = name;
        this.color = color;
        this.render = render || this.render;
        this.description = description;
        this.tags = tags || [];
    }

    render(ctx, cell, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(cell.x, cell.y, size, size);
    }
}

export class BodyCellState extends CellState{
    constructor(cellType, name, color, description, tags, render) {
        super(name, color, description, tags, render)
        this.CellType = cellType;
        this.tags.push('living');
    }
}