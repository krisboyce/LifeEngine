import { up, down, left, right } from "../../Directions";
import Cell from "../Cell";
import { CellState } from "../CellState";
import { CellTags } from "../CellTags";

// A body cell defines the relative location of the cell in it's parent organism. It also defines their functional behavior.
class BodyCell extends Cell {
    static state = new CellState(
        'bodycell',
        '#FFF',
        'The base body cell.',
        [CellTags.Living, CellTags.Observable],
        super.state
    );

    static {
        console.log(this.state)
    }
    
    constructor(org, loc_col, loc_row) {
        super();
        this.org = org;
        this.loc_col = loc_col;
        this.loc_row = loc_row;
        var distance = Math.max(Math.abs(loc_row)*2 + 2, Math.abs(loc_col)*2 + 2);
        if (this.org.anatomy.birth_distance < distance) {
            this.org.anatomy.birth_distance = distance;
        }
    }

    initInherit(parent) {
        // deep copy parent values
        this.loc_col = parent.loc_col;
        this.loc_row = parent.loc_row;
    }
    
    initRandom() {
        // initialize values randomly
    }

    initDefault() {
        // initialize to default values 
    }

    


    getRealCol() {
        return this.org.c + this.rotatedCol(this.org.rotation);
    }
    
    getRealRow() {
        return this.org.r + this.rotatedRow(this.org.rotation);
    }

    getGridCell() {
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        return this.org.env.grid_map.cellAt(real_c, real_r);
    }

    rotatedCol(dir){
        switch(dir){
            case up:
                return this.loc_col;
            case down:
                return this.loc_col * -1;
            case left:
                return this.loc_row;
            case right:
                return this.loc_row * -1;
        }
    }

    rotatedRow(dir){
        switch(dir){
            case up:
                return this.loc_row;
            case down:
                return this.loc_row * -1;
            case left:
                return this.loc_col * -1;
            case right:
                return this.loc_col;
        }
    }

    
}

export default BodyCell;
