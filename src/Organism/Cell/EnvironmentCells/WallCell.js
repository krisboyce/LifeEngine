import { CellState } from "../CellState";
import EnvironmentCell from "./EnvironmentCell";

export default class WallCell extends EnvironmentCell {
    static state = new CellState('wall', 'gray', '');
    constructor(){
        super();
    }
}