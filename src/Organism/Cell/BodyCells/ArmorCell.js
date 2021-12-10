import { CellState } from "../CellState";
import { CellTags } from "../CellTags";
import BodyCell from "./BodyCell";

class ArmorCell extends BodyCell {
    static state = new CellState(
        "armor",
        "#7230DB",
        "Armor: Negates affects of killer cell.",
        [],
        super.state
    );

    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
    }
}

export default ArmorCell;