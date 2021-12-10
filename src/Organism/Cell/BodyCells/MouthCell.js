import BodyCell from "./BodyCell";
import HyperParameters from "../../../Hyperparameters";
import { CellState } from "../CellState";
import { Empty, Food } from "../EnvironmentCells/EnvironmentCells";

class MouthCell extends BodyCell{
    static state = new CellState(
        "mouth",
        "#DEB14D",
        "Mouth: Eats adjacent food.",
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
        for (var loc of HyperParameters.edibleNeighbors){
            var cell = env.grid_map.cellAt(real_c+loc[0], real_r+loc[1]);
            this.eatNeighbor(cell, env);
        }
    }

    eatNeighbor(n_cell, env) {
        if (n_cell == null)
            return;
        if (n_cell.type == Food){
            env.changeCell(n_cell.col, n_cell.row, Empty, null);
            this.org.food_collected++;
        }
    }
}

export default MouthCell;