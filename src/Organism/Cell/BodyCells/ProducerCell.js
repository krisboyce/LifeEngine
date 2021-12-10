import BodyCell from "./BodyCell";
import HyperParameters from "../../../Hyperparameters";
import { CellState } from "../CellState";
import { Empty, Food } from "../EnvironmentCells/EnvironmentCells";

class ProducerCell extends BodyCell{
    static state = new CellState(
        "producer",
        "#15DE59",
        "Producer: Produces adjacent food.",
        [],
        super.state
    );
    
    constructor(org, loc_col, loc_row) {
        super(org, loc_col, loc_row);
        this.org.anatomy.is_producer = true;
    }

    performFunction() {
        if (this.org.anatomy.is_mover && !HyperParameters.moversCanProduce)
            return;
        var env = this.org.env;
        var prob = HyperParameters.foodProdProb;
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        if (Math.random() * 100 <= prob) {
            var loc = HyperParameters.growableNeighbors[Math.floor(Math.random() * HyperParameters.growableNeighbors.length)]
            var loc_c=loc[0];
            var loc_r=loc[1];
            var gridCell = env.grid_map.cellAt(real_c+loc_c, real_r+loc_r);
            if (gridCell != null && gridCell.type == Empty){
                env.changeCell(real_c+loc_c, real_r+loc_r, Food, null);
                return;
            }
        }
    }
}

export default ProducerCell;
