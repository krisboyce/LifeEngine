import { Cells } from '../../Registry'
// A cell exists in a grid map.
class GridCell{
    constructor(type, col, row, x, y){
        this.owner = null; // owner organism
        this.cell_owner = null; // owner cell of ^that organism
        this.setType(type);
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
    }

    setType(type) {
        if(!Cells.All().find(x => x == type)) throw new Error(`Invalid type:${type.name} (${type})`);
        this.type = type;
    }
}

export default GridCell;
