import HyperParameters from "../../../Hyperparameters";
import { CellState } from "../CellState";
import BodyCell from "./BodyCell";

class ChloroCell extends BodyCell{
    static state = new CellState(
        "chloro",
        "",
        "",
        [],
        super.state
    );

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        for (var loc of HyperParameters.breathableNeighbors){
            var cell = env.grid_map.cellAt(real_c+loc[0], real_r+loc[1]);
            this.synthesize(cell, env);
        }
    }

    synthesize(n_cell, env) {
        if (n_cell == null){
            this.org.food_collected++;
            console.log('.');
        }
    }
}

export default ChloroCell;