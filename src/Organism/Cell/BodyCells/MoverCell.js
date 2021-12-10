import { CellState } from "../CellState";
import BodyCell from "./BodyCell";

class MoverCell extends BodyCell{
    static state = new CellState(
        "mover",
        "#60D4FF",
        "Mover: Allows for movement and rotation.",
        [],
        super.state
    );

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.org.anatomy.is_mover = true;
    }
}

export default MoverCell;