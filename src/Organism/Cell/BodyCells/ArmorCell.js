import { BodyCellState } from "../CellState";
import BodyCell from "./BodyCell";

class ArmorCell extends BodyCell {
    static state = new BodyCellState(ArmorCell, "armor", "", "");
    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
    }
}

export default ArmorCell;