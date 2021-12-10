import { CellState } from "../CellState";
import { CellTags } from "../CellTags";
import EnvironmentCell from "./EnvironmentCell";

export default class EmptyCell extends EnvironmentCell {
    static state = new CellState(
        'empty',
        '#0E1318',
        'Empty: nothing. can be moved through.',
        [CellTags.Passable, ...super.state.tags]
    );
    constructor(){
        super();
    }
} 