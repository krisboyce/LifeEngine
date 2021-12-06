import { BodyCellState } from "../CellState";
import BodyCell from "./BodyCell";

class MoverCell extends BodyCell{
    static state = new BodyCellState(MoverCell, "mover", "", "");

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.org.anatomy.is_mover = true;
    }
}

export default MoverCell;