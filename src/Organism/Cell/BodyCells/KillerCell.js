import BodyCell from "./BodyCell";
import HyperParameters from "../../../Hyperparameters";
import { BodyCellState } from "../CellState";
import { Armor, Killer } from "./BodyCells";

class KillerCell extends BodyCell{
    static state = new BodyCellState(KillerCell, "killer", "", "");

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of HyperParameters.killableNeighbors) {
            var cell = env.grid_map.cellAt(c+loc[0], r+loc[1]);
            this.killNeighbor(cell);
        }
    }

    killNeighbor(n_cell) {
        // console.log(n_cell)
        if(n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.type == Armor) 
            return;
        var is_hit = n_cell.type == Killer; // has to be calculated before death
        n_cell.owner.harm();
        if (HyperParameters.instaKill && is_hit) {
            this.org.harm();
        }
    }
}

export default KillerCell;
