import { CellState } from "../CellState";
import { CellTags } from "../CellTags";
import EnvironmentCell from "./EnvironmentCell";

export default class WallCell extends EnvironmentCell {
    static state = new CellState(
        'wall',
        'gray',
        'Wall: blocks movement and reproduction',
        [CellTags.Observable, ...super.state.tags]
    );
    constructor(){
        super();
    }
}